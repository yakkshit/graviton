import { WebSocketServer, WebSocket } from "ws";
import http from "node:http";

export interface DiffProposedPayload {
  id: string;
  filePath: string;
  oldContent: string;
  newContent: string;
  model: string;
  modelType: "claude" | "gemini" | "gpt" | "ollama";
  action: string;
  impactScore: number;
  affectedFiles: string[];
  riskLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  explanation: string;
  timestamp: string;
  status: "pending";
}

export interface DecisionMadePayload {
  id: string;
  filePath: string;
  action: "approved" | "blocked";
  commitHash?: string;
}

export type WebSocketClientMessage =
  | { type: "DECISION_MADE"; payload: { id: string; action: "approved" | "blocked" } }
  | { type: "REQUEST_ROLLBACK"; payload: { commitHash: string } }
  | { type: "PING" };

export class CockpitWebSocketServer {
  private wss: WebSocketServer | null = null;
  private httpServer: http.Server | null = null;
  private port: number;
  private authKey: string | null = null;
  private tunnelUrl: string | null = null;
  private repoPath: string = "";
  private clients = new Set<WebSocket>();
  private decisionResolvers = new Map<string, (decision: "approved" | "blocked") => void>();

  constructor(port = 9121, authKey: string | null = null, tunnelUrl: string | null = null) {
    this.port = port;
    this.authKey =
      authKey ||
      process.env.GRAVITON_AUTH_KEY ||
      process.env.ORBIT_AUTH_KEY ||
      null;
    this.tunnelUrl =
      tunnelUrl ||
      process.env.GRAVITON_TUNNEL_URL ||
      process.env.ORBIT_TUNNEL_URL ||
      null;
    this.repoPath =
      process.env.GRAVITON_REPO_PATH ||
      process.env.ORBIT_REPO_PATH ||
      process.cwd();
  }

  start(onDecision?: (id: string, action: "approved" | "blocked") => Promise<void>): void {
    // 1. Create HTTP server for health checks, remote pairing API, and CORS
    this.httpServer = http.createServer((req, res) => {
      // CORS headers
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Graviton-Key, X-Orbit-Key");

      if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
      }

      const reqUrl = new URL(req.url || "/", `http://localhost:${this.port}`);
      const token =
        reqUrl.searchParams.get("token") ||
        reqUrl.searchParams.get("auth") ||
        reqUrl.searchParams.get("key") ||
        (req.headers["x-graviton-key"] as string) ||
        (req.headers["x-orbit-key"] as string) ||
        req.headers["authorization"]?.replace(/^Bearer\s+/i, "");

      if (reqUrl.pathname === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            status: "ok",
            server: "Graviton Control Plane",
            version: "1.0.0",
            authRequired: Boolean(this.authKey),
            tunnelActive: Boolean(this.tunnelUrl),
            tunnelUrl: this.tunnelUrl,
          })
        );
        return;
      }

      // If authentication is required, protect API endpoints
      if (this.authKey && token !== this.authKey) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "Unauthorized",
            message: "Missing or invalid Graviton auth token.",
          })
        );
        return;
      }

      if (reqUrl.pathname === "/api/status") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            status: "connected",
            authRequired: Boolean(this.authKey),
            tunnelUrl: this.tunnelUrl,
            repoPath: this.repoPath,
            activeClients: this.clients.size,
          })
        );
        return;
      }

      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not Found" }));
    });

    // 2. Attach WebSocket server to HTTP server
    this.wss = new WebSocketServer({ server: this.httpServer });

    this.wss.on("connection", (ws: WebSocket, req: http.IncomingMessage) => {
      const reqUrl = new URL(req.url || "/", `http://localhost:${this.port}`);
      const token =
        reqUrl.searchParams.get("token") ||
        reqUrl.searchParams.get("auth") ||
        reqUrl.searchParams.get("key") ||
        (req.headers["x-graviton-key"] as string) ||
        (req.headers["x-orbit-key"] as string) ||
        req.headers["authorization"]?.replace(/^Bearer\s+/i, "");

      // Enforce auth if authKey is configured
      if (this.authKey && token !== this.authKey) {
        console.warn(
          `[Graviton WS] ⚠️ Unauthorized connection rejected from ${
            req.socket.remoteAddress || "client"
          }`
        );
        ws.send(
          JSON.stringify({
            type: "AUTH_ERROR",
            payload: {
              code: "UNAUTHORIZED",
              message: "Authentication failed: Missing or invalid Graviton auth key.",
            },
          })
        );
        ws.close(4001, "Unauthorized: Invalid auth key");
        return;
      }

      this.clients.add(ws);
      console.log(
        `[Graviton WS] Cockpit client connected. Active clients: ${this.clients.size}`
      );

      // Send initial handshake with telemetry, tunnel, and auth requirements
      ws.send(
        JSON.stringify({
          type: "HANDSHAKE",
          payload: {
            server: "Graviton Engine MCP Bridge",
            version: "1.0.0",
            status: "ready",
            authRequired: Boolean(this.authKey),
            tunnelUrl: this.tunnelUrl || null,
            repoPath: this.repoPath,
          },
        })
      );

      ws.on("message", async (data) => {
        try {
          const parsed = JSON.parse(data.toString()) as WebSocketClientMessage;
          if (parsed.type === "DECISION_MADE") {
            const { id, action } = parsed.payload;
            const resolver = this.decisionResolvers.get(id);
            if (resolver) {
              resolver(action);
              this.decisionResolvers.delete(id);
            }
            if (onDecision) {
              await onDecision(id, action);
            }
          }
        } catch (err) {
          console.error("[Graviton WS] Error parsing client message:", err);
        }
      });

      ws.on("close", () => {
        this.clients.delete(ws);
        console.log(
          `[Graviton WS] Cockpit client disconnected. Active clients: ${this.clients.size}`
        );
      });
    });

    this.httpServer.listen(this.port, () => {
      console.log(`[Graviton WS] Bridge WebSocket & HTTP Server active on port ${this.port}`);
      if (this.authKey) {
        console.log(`[Graviton WS] 🔒 Authentication ENFORCED for all incoming connections.`);
      }
      if (this.tunnelUrl) {
        console.log(`[Graviton WS] 🌐 Public Tunnel active: ${this.tunnelUrl}`);
      }
    });
  }

  /**
   * Broadcast an event to all connected Cockpit WebUI clients.
   */
  broadcast(type: string, payload: unknown): void {
    const message = JSON.stringify({ type, payload });
    for (const client of this.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }

  /**
   * Waits for human decision in the Cockpit WebUI for a specific proposal.
   */
  waitForDecision(diffId: string, timeoutMs = 120000): Promise<"approved" | "blocked"> {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        this.decisionResolvers.delete(diffId);
        resolve("blocked"); // Default safe failover
      }, timeoutMs);

      this.decisionResolvers.set(diffId, (decision) => {
        clearTimeout(timer);
        resolve(decision);
      });
    });
  }

  close(): void {
    if (this.wss) {
      this.wss.close();
    }
    if (this.httpServer) {
      this.httpServer.close();
    }
  }
}
