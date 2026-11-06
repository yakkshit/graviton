import { Command } from "commander";
import chalk from "chalk";
import path from "node:path";
import { spawn } from "node:child_process";
import fs from "node:fs";
import crypto from "node:crypto";
import localtunnel from "localtunnel";

const program = new Command();

const BANNER = `
${chalk.bold.hex("#3B82F6")("   __________  ___ _    ________________  _   __ ")}
${chalk.bold.hex("#60A5FA")("  / ____/ __ \\/   | |  / /  _/_  __/ __ \\/ | / / ")}
${chalk.bold.hex("#38BDF8")(" / / __/ /_/ / /| | | / // /  / / / / / /  |/ /  ")}
${chalk.bold.hex("#34D399")("/ /_/ / _, _/ ___ | |/ // /  / / / /_/ / /|  /   ")}
${chalk.bold.hex("#10B981")("\\____/_/ |_/_/  |_|___/___/ /_/  \\____/_/ |_/    ")}

${chalk.bold.white("The Self-Hosted Multi-Model AI Coding Cockpit")}
${chalk.hex("#94A3B8")("Your code is the center. AI orbits it. You control the gravity.")}
`;

program
  .name("graviton")
  .description("Graviton - Zero-Trust AI Coding Cockpit & MCP Control Plane")
  .version("1.0.0");

program
  .command("start", { isDefault: true })
  .description("Start the Graviton Core Engine & Cockpit WebUI")
  .option("-p, --port <number>", "WebSocket telemetry port", "9121")
  .option("-d, --dir <path>", "Target repository directory", ".")
  .option("-a, --auth-key <string>", "Secret authentication token required for WS/MCP connections")
  .option("-t, --tunnel", "Automatically spin up a secure public tunnel via localtunnel", false)
  .option("--no-open", "Do not open Cockpit WebUI in default browser")
  .action(async (options) => {
    console.log(BANNER);

    const targetDir = path.resolve(options.dir);
    const wsPort = Number(options.port) || 9121;

    // Security First: Generate or resolve authentication key
    let authKey: string;
    if (options.authKey && typeof options.authKey === "string") {
      authKey = options.authKey;
    } else if (options.tunnel || options.authKey === true) {
      authKey = crypto.randomUUID();
    } else {
      authKey = crypto.randomUUID();
    }

    // Step 1. Establish secure public tunnel if requested
    let publicTunnelUrl: string | null = null;
    let tunnelInstance: localtunnel.Tunnel | null = null;

    if (options.tunnel) {
      console.log(chalk.cyan("  ● Establishing secure public tunnel via localtunnel..."));
      try {
        tunnelInstance = await localtunnel({ port: wsPort });
        publicTunnelUrl = tunnelInstance.url;

        tunnelInstance.on("error", (err: Error) => {
          console.warn(chalk.yellow(`\n  [Tunnel Warning] ${err.message || err}`));
        });

        tunnelInstance.on("close", () => {
          console.log(chalk.gray("\n  [Tunnel Closed] Public tunnel session terminated."));
        });
      } catch (err: any) {
        console.warn(
          chalk.yellow(`  [Tunnel Warning] Failed to initialize tunnel: ${err?.message || err}`)
        );
        console.warn(chalk.gray("  Continuing in local-only mode.\n"));
      }
    }

    // Cockpit WebUI URL with pre-filled auth token and tunnel parameters
    const localCockpitUrl = `http://localhost:3001?token=${authKey}${
      publicTunnelUrl ? `&ws=${encodeURIComponent(publicTunnelUrl)}` : ""
    }`;

    // Display formatted output
    console.log(chalk.bold("🪐 GRAVITON COCKPIT v1.0"));
    console.log(chalk.gray("=".repeat(50)));
    console.log(`[✓] Engine running on port: ${chalk.cyan(wsPort)}`);
    console.log(
      `[✓] Auth Key:               ${chalk.bold.hex("#F59E0B")(authKey)} ${chalk.gray(
        "(Required for all connections)"
      )}`
    );
    console.log(`[✓] Local Cockpit:          ${chalk.cyan(localCockpitUrl)}`);
    if (publicTunnelUrl) {
      console.log(`[✓] Public Tunnel:          ${chalk.bold.hex("#10B981")(publicTunnelUrl)}`);
    } else {
      console.log(`[ ] Public Tunnel:          ${chalk.gray("Disabled (run with --tunnel to enable)")}`);
    }
    console.log(`[✓] Target Repository:      ${chalk.gray(targetDir)}`);
    console.log(chalk.gray("=".repeat(50)));

    if (publicTunnelUrl) {
      console.log(
        chalk.bold.yellow(
          "⚠️  SECURITY: Share the Public Tunnel URL AND Auth Key only with trusted agents/users."
        )
      );
    } else {
      console.log(
        chalk.gray("🔒 Zero-Trust Protection active: local & remote clients must supply Auth Key.")
      );
    }
    console.log("");

    console.log(chalk.bold("  Connect Claude Desktop / Cursor:"));
    console.log(chalk.gray("  Add this to your MCP configuration:"));
    console.log(
      chalk.hex("#E2E8F0")(`  {
    "mcpServers": {
      "graviton": {
        "command": "bunx",
        "args": ["@yakkshit/graviton", "mcp"],
        "cwd": "${targetDir}"
      }
    }
  }`)
    );
    console.log("");
    console.log(chalk.gray("─".repeat(50)));
    console.log(chalk.yellow("● Watching for incoming AI diffs via Model Context Protocol..."));

    // Find the apps/server entry point
    const serverPathCandidates = [
      path.resolve(__dirname, "../../apps/server/index.ts"),
      path.resolve(__dirname, "../../../apps/server/index.ts"),
      path.resolve(__dirname, "../apps/server/index.ts"),
      path.resolve(process.cwd(), "apps/server/index.ts"),
    ];

    const serverScript = serverPathCandidates.find((p) => fs.existsSync(p));

    if (!serverScript) {
      console.error(chalk.red("Error: Could not locate Graviton server runtime (apps/server/index.ts)."));
      process.exit(1);
    }

    const env: NodeJS.ProcessEnv = {
      ...process.env,
      GRAVITON_REPO_PATH: targetDir,
      GRAVITON_WS_PORT: String(wsPort),
      GRAVITON_AUTH_KEY: authKey,
      ORBIT_REPO_PATH: targetDir,
      ORBIT_WS_PORT: String(wsPort),
      ORBIT_AUTH_KEY: authKey,
      ...(publicTunnelUrl ? { GRAVITON_TUNNEL_URL: publicTunnelUrl, ORBIT_TUNNEL_URL: publicTunnelUrl } : {}),
    };

    const serverArgs = [
      serverScript,
      "--dir",
      targetDir,
      "--port",
      String(wsPort),
      "--auth-key",
      authKey,
      ...(publicTunnelUrl ? ["--tunnel-url", publicTunnelUrl] : []),
    ];

    // Spawn server process with correct cwd targeting user's project
    if (typeof (globalThis as any).Bun !== "undefined" && (globalThis as any).Bun?.spawn) {
      const child = (globalThis as any).Bun.spawn(["bun", "run", ...serverArgs], {
        cwd: targetDir,
        env,
        stdio: ["inherit", "inherit", "inherit"],
      });

      const handleCleanup = () => {
        try {
          if (tunnelInstance) tunnelInstance.close();
          child.kill();
        } catch {}
        process.exit(0);
      };

      process.on("SIGINT", handleCleanup);
      process.on("SIGTERM", handleCleanup);

      await child.exited;
    } else {
      const child = spawn("bun", ["run", ...serverArgs], {
        cwd: targetDir,
        stdio: "inherit",
        env,
      });

      const handleCleanup = () => {
        try {
          if (tunnelInstance) tunnelInstance.close();
          child.kill("SIGINT");
        } catch {}
        process.exit(0);
      };

      process.on("SIGINT", handleCleanup);
      process.on("SIGTERM", handleCleanup);

      child.on("exit", (code) => {
        if (tunnelInstance) tunnelInstance.close();
        process.exit(code || 0);
      });
    }
  });

program
  .command("mcp")
  .description("Run the Graviton MCP Server directly over Stdio (for Claude/Cursor)")
  .option("-d, --dir <path>", "Target repository directory", ".")
  .action(async (options) => {
    const targetDir = path.resolve(options.dir);
    const serverPathCandidates = [
      path.resolve(__dirname, "../../apps/server/index.ts"),
      path.resolve(__dirname, "../../../apps/server/index.ts"),
      path.resolve(__dirname, "../apps/server/index.ts"),
      path.resolve(process.cwd(), "apps/server/index.ts"),
    ];

    const serverScript = serverPathCandidates.find((p) => fs.existsSync(p));

    if (!serverScript) {
      console.error(chalk.red("Error: Could not locate Graviton server runtime (apps/server/index.ts)."));
      process.exit(1);
    }

    const mcpEnv: NodeJS.ProcessEnv = {
      ...process.env,
      GRAVITON_REPO_PATH: targetDir,
      GRAVITON_MODE: "mcp",
      ORBIT_REPO_PATH: targetDir,
      ORBIT_MODE: "mcp",
    };

    const serverArgs = [serverScript, "--dir", targetDir];

    if (typeof (globalThis as any).Bun !== "undefined" && (globalThis as any).Bun?.spawn) {
      const child = (globalThis as any).Bun.spawn(["bun", "run", ...serverArgs], {
        cwd: targetDir,
        env: mcpEnv,
        stdio: ["inherit", "inherit", "inherit"],
      });

      await child.exited;
    } else {
      const child = spawn("bun", ["run", ...serverArgs], {
        cwd: targetDir,
        stdio: "inherit",
        env: mcpEnv,
      });

      child.on("exit", (code) => {
        process.exit(code || 0);
      });
    }
  });

program.parse(process.argv);
