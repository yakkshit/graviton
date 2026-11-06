import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { GitEngine } from "./engine";
import { CockpitWebSocketServer, DiffProposedPayload } from "./ws-server";
import { analyzeImpact } from "./ast-analyzer";

export function createGravitonMcpServer(
  engine: GitEngine,
  wsServer: CockpitWebSocketServer
): McpServer {
  const server = new McpServer({
    name: "graviton-engine",
    version: "1.0.0",
  });

  // Type-safe tool registration wrapper avoiding TS2589 generic explosion
  const mcp = server as unknown as {
    registerTool: <T extends Record<string, any> = Record<string, any>>(
      name: string,
      config: {
        description: string;
        inputSchema?: Record<string, z.ZodTypeAny>;
      },
      cb: (args: T) => Promise<{
        content: Array<{ type: string; text: string }>;
        isError?: boolean;
      }>
    ) => void;
  };

  /**
   * TOOL 1: read_file
   */
  mcp.registerTool<{ filePath: string }>(
    "read_file",
    {
      description: "Read the current content of a file in the repository.",
      inputSchema: {
        filePath: z.string().describe("Relative file path from repository root"),
      },
    },
    async ({ filePath }) => {
      try {
        const content = await engine.readFile(filePath);
        return {
          content: [
            {
              type: "text",
              text: content,
            },
          ],
        };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          content: [
            {
              type: "text",
              text: `Error reading file '${filePath}': ${message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  /**
   * TOOL 2: propose_edit
   * Intercepts code modifications. Zero direct disk write.
   * Calculates actual AST blast radius with ts-morph, creates a pre-snapshot,
   * streams diff and impact telemetry to Orbit Cockpit, and awaits human approval.
   */
  mcp.registerTool<{
    filePath: string;
    newContent: string;
    explanation: string;
    model?: string;
  }>(
    "propose_edit",
    {
      description:
        "Propose an atomic edit to a file. Analyzes AST blast radius and requires human-in-the-loop approval via Graviton Cockpit WebUI before hitting disk.",
      inputSchema: {
        filePath: z.string().describe("Relative file path to modify"),
        newContent: z.string().describe("Full proposed replacement content"),
        explanation: z.string().describe("Clear summary of what changed and why"),
        model: z
          .string()
          .optional()
          .describe("Proposing model name (e.g., Claude 3.7 Sonnet)"),
      },
    },
    async ({
      filePath,
      newContent,
      explanation,
      model = "MCP Connected Agent",
    }) => {
      try {
        let oldContent = "";
        try {
          oldContent = await engine.readFile(filePath);
        } catch {
          // New file creation
        }

        // 1. Create safety snapshot before any state modification
        const preSnapshotHash = await engine.createSnapshot(`pre-edit(${filePath})`);

        // 2. Compute actual AST blast radius and dependency impact
        const impact = await analyzeImpact(engine.rootPath, filePath);

        const diffId = `diff-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

        const proposalPayload: DiffProposedPayload = {
          id: diffId,
          filePath,
          oldContent,
          newContent,
          model,
          modelType: model.toLowerCase().includes("claude")
            ? "claude"
            : model.toLowerCase().includes("gemini")
            ? "gemini"
            : model.toLowerCase().includes("gpt")
            ? "gpt"
            : "ollama",
          action: "MCP Intercepted Edit",
          impactScore: impact.affectedFilesCount,
          affectedFiles: impact.affectedFiles,
          riskLevel: impact.riskLevel,
          explanation,
          timestamp: "Just now",
          status: "pending",
        };

        // 3. Broadcast to Graviton Cockpit
        wsServer.broadcast("DIFF_PROPOSED", proposalPayload);
        console.log(
          `[Graviton MCP] Edit proposed on '${filePath}' by ${model}. Blast Radius: ${impact.affectedFilesCount} files. Risk: ${impact.riskLevel}. Awaiting human approval...`
        );

        // 4. Halt execution and wait for human decision
        const decision = await wsServer.waitForDecision(diffId);

        if (decision === "approved") {
          await engine.applyDiff(filePath, newContent);
          const postCommitHash = await engine.createSnapshot(`graviton(applied): ${filePath}`);

          wsServer.broadcast("DECISION_MADE", {
            id: diffId,
            filePath,
            action: "approved",
            commitHash: postCommitHash,
          });

          const gitStatus = await engine.getGitStatus();
          wsServer.broadcast("GIT_UPDATE", gitStatus);

          return {
            content: [
              {
                type: "text",
                text: `SUCCESS: Patch on '${filePath}' was APPROVED by developer in Graviton Cockpit and committed (commit ${postCommitHash}). Blast radius affected ${impact.affectedFilesCount} files.`,
              },
            ],
          };
        } else {
          wsServer.broadcast("DECISION_MADE", {
            id: diffId,
            filePath,
            action: "blocked",
          });

          return {
            content: [
              {
                type: "text",
                text: `INTERCEPTED: Patch on '${filePath}' was BLOCKED and rejected by developer in Graviton Cockpit. Zero changes were written to disk. Reverted to snapshot ${preSnapshotHash}.`,
              },
            ],
          };
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          content: [
            {
              type: "text",
              text: `Error during propose_edit on '${filePath}': ${message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  /**
   * TOOL 3: git_status
   */
  mcp.registerTool(
    "git_status",
    {
      description:
        "Retrieve current repository branch, clean/dirty state, and recent commit hash.",
    },
    async () => {
      try {
        const status = await engine.getGitStatus();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(status, null, 2),
            },
          ],
        };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          content: [
            {
              type: "text",
              text: `Error checking git status: ${message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  /**
   * TOOL 4: request_rollback
   */
  mcp.registerTool<{ commitHash?: string }>(
    "request_rollback",
    {
      description:
        "Roll back working directory and git index to a specific commit hash.",
      inputSchema: {
        commitHash: z
          .string()
          .optional()
          .describe("Commit SHA to reset to. Defaults to HEAD~1"),
      },
    },
    async ({ commitHash }) => {
      try {
        const target = commitHash || "HEAD~1";
        await engine.rollbackTo(target);
        const status = await engine.getGitStatus();
        wsServer.broadcast("GIT_UPDATE", status);

        return {
          content: [
            {
              type: "text",
              text: `Rolled back repository state to '${target}'. Working tree is clean.`,
            },
          ],
        };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          content: [
            {
              type: "text",
              text: `Rollback failed: ${message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  return server;
}

export const createOrbitMcpServer = createGravitonMcpServer;
