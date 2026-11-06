import { DiffItem } from "./cockpit-store";

export const MOCK_INCOMING_DIFFS: Omit<DiffItem, "id" | "timestamp">[] = [
  {
    filePath: "src/db/query.ts",
    fileName: "query.ts",
    model: "Ollama Local (DeepSeek-R1)",
    modelType: "ollama",
    action: "SQL Injection Parameterization",
    impactScore: 8,
    affectedFiles: [
      "src/api/routes/users.ts",
      "src/api/routes/billing.ts",
      "src/auth/session.ts",
      "src/index.ts"
    ],
    riskLevel: "MODERATE",
    summary: "Replaced raw string concatenation in SQL statement with parameterized prepared statement.",
    status: "pending",
    diffLines: [
      { type: "same", text: "export async function findUserByEmail(email: string) {", oldLine: 12, newLine: 12 },
      { type: "remove", text: "  const query = `SELECT * FROM users WHERE email = '${email}'`;", oldLine: 13 },
      { type: "add", text: "  const query = 'SELECT * FROM users WHERE email = $1';", newLine: 13 },
      { type: "add", text: "  return await db.query(query, [email]);", newLine: 14 },
      { type: "same", text: "}", oldLine: 14, newLine: 15 },
    ],
  },
  {
    filePath: "src/orchestrator/mcp-gateway.ts",
    fileName: "mcp-gateway.ts",
    model: "Claude 3.7 Sonnet",
    modelType: "claude",
    action: "Socket Rate Limiting",
    impactScore: 3,
    affectedFiles: ["src/index.ts", "src/orchestrator/executor.ts"],
    riskLevel: "LOW",
    summary: "Configured leaky-bucket rate limiter for MCP agent tool invocations (max 60 req/min).",
    status: "pending",
    diffLines: [
      { type: "same", text: "export class McpGatewayServer {", oldLine: 28, newLine: 28 },
      { type: "add", text: "  private rateLimiter = new TokenBucket({ capacity: 60, refillPerSec: 1 });", newLine: 29 },
      { type: "same", text: "  async handleToolCall(req: JsonRpcRequest) {", oldLine: 29, newLine: 30 },
      { type: "add", text: "    if (!this.rateLimiter.consume()) throw new RpcError('RATE_EXCEEDED');", newLine: 31 },
      { type: "same", text: "    return await this.dispatcher.dispatch(req);", oldLine: 30, newLine: 32 },
      { type: "same", text: "  }", oldLine: 31, newLine: 33 },
      { type: "same", text: "}", oldLine: 32, newLine: 34 },
    ],
  },
];
