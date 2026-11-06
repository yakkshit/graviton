import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { GitEngine } from "./lib/engine";
import { CockpitWebSocketServer } from "./lib/ws-server";
import { createGravitonMcpServer, createOrbitMcpServer } from "./lib/mcp-server";

async function main() {
  console.log("==================================================");
  console.log("  GRAVITON COCKPIT CORE ENGINE & MCP SERVER v1.0  ");
  console.log("==================================================");

  // Parse command line arguments with env fallbacks
  const args = process.argv.slice(2);
  const getArg = (flag: string): string | undefined => {
    const idx = args.indexOf(flag);
    return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : undefined;
  };

  // 1. Initialize local GitEngine
  const targetDir =
    getArg("--dir") ||
    process.env.GRAVITON_REPO_PATH ||
    process.env.ORBIT_REPO_PATH ||
    process.cwd();
  console.log(`[Graviton Engine] Targeting repository: ${targetDir}`);
  const gitEngine = new GitEngine(targetDir);
  await gitEngine.initRepo();

  // 2. Start WebSocket Bridge for Cockpit WebUI
  const wsPort =
    Number(getArg("--port")) ||
    Number(process.env.GRAVITON_WS_PORT) ||
    Number(process.env.ORBIT_WS_PORT) ||
    9121;
  const authKey =
    getArg("--auth-key") ||
    process.env.GRAVITON_AUTH_KEY ||
    process.env.ORBIT_AUTH_KEY ||
    null;
  const tunnelUrl =
    getArg("--tunnel-url") ||
    process.env.GRAVITON_TUNNEL_URL ||
    process.env.ORBIT_TUNNEL_URL ||
    null;
  const wsServer = new CockpitWebSocketServer(wsPort, authKey, tunnelUrl);
  wsServer.start(async (diffId, action) => {
    console.log(`[Graviton Engine] Decision received for ${diffId}: ${action}`);
  });

  // 3. Initialize Model Context Protocol Server
  const mcpServer = createGravitonMcpServer(gitEngine, wsServer);

  // Connect stdio transport if running as an MCP subprocess
  if (
    process.env.GRAVITON_MODE === "mcp" ||
    process.env.ORBIT_MODE === "mcp" ||
    !process.stdin.isTTY
  ) {
    const transport = new StdioServerTransport();
    await mcpServer.connect(transport);
    console.log("[Graviton MCP] Stdio transport connected to client model.");
  } else {
    console.log("[Graviton MCP] Server running in Standalone Daemon mode.");
    console.log(`[Graviton MCP] Cockpit UI connect URL: ws://localhost:${wsPort}`);
  }
}

main().catch((err) => {
  console.error("[Graviton Engine Fatal Error]:", err);
  process.exit(1);
});

