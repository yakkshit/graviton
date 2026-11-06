import { create } from "zustand";

export interface DiffLine {
  type: "same" | "add" | "remove";
  text: string;
  oldLine?: number;
  newLine?: number;
}

export interface DiffItem {
  id: string;
  filePath: string;
  fileName: string;
  model: string;
  modelType: "claude" | "gemini" | "gpt" | "ollama";
  action: string;
  impactScore: number;
  affectedFiles: string[];
  riskLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  summary: string;
  timestamp: string;
  status: "pending" | "approved" | "blocked" | "reverted";
  diffLines: DiffLine[];
}

export interface FileNode {
  id: string;
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileNode[];
  hasPendingDiff?: boolean;
  diffStatus?: "pending" | "approved" | "blocked";
}

export interface MCPSession {
  id: string;
  name: string;
  model: string;
  modelType: "claude" | "gemini" | "gpt" | "ollama";
  status: "active" | "paused";
  latencyMs: number;
  requestsCount: number;
}

export interface CockpitState {
  activeFilePath: string;
  activeDiffId: string | null;
  pendingDiffs: DiffItem[];
  mcpSessions: MCPSession[];
  gitBranch: string;
  isConnected: boolean;
  activeFilter: "all" | "pending" | "approved" | "blocked";
  
  // Phase 11 & 12: Remote Access, Auth, Tunneling & Modals
  authToken: string | null;
  publicTunnelUrl: string | null;
  serverUrl: string;
  isAuthRequired: boolean;
  authError: string | null;
  isShareModalOpen: boolean;

  // Actions
  setActiveFilePath: (path: string) => void;
  setActiveDiffId: (id: string | null) => void;
  approveDiff: (id: string) => void;
  blockDiff: (id: string) => void;
  rollbackDiff: (id: string) => void;
  toggleSession: (id: string) => void;
  setActiveFilter: (filter: "all" | "pending" | "approved" | "blocked") => void;
  injectNewDiff: (diff: DiffItem) => void;
  setIsConnected: (connected: boolean) => void;
  setGitBranch: (branch: string) => void;
  setAuthToken: (token: string | null) => void;
  setPublicTunnelUrl: (url: string | null) => void;
  setServerUrl: (url: string) => void;
  setIsAuthRequired: (required: boolean) => void;
  setAuthError: (error: string | null) => void;
  setIsShareModalOpen: (open: boolean) => void;
}

const INITIAL_DIFFS: DiffItem[] = [
  {
    id: "diff-001",
    filePath: "src/auth/session.ts",
    fileName: "session.ts",
    model: "Claude 3.7 Sonnet",
    modelType: "claude",
    action: "AST Rewrite / Memory Leak Fix",
    impactScore: 6,
    affectedFiles: [
      "src/api/routes/billing.ts",
      "src/api/routes/users.ts",
      "src/middleware/auth-guard.ts",
      "src/orchestrator/executor.ts",
      "src/index.ts",
      "test/auth.test.ts"
    ],
    riskLevel: "MODERATE",
    summary: "Replaced direct process execution with isolated sandbox runner and secure JWT claim parser.",
    timestamp: "Just now",
    status: "pending",
    diffLines: [
      { type: "same", text: "import { createCipheriv } from 'node:crypto';", oldLine: 1, newLine: 1 },
      { type: "same", text: "import { SessionConfig } from './config';", oldLine: 2, newLine: 2 },
      { type: "same", text: "", oldLine: 3, newLine: 3 },
      { type: "same", text: "export async function resolveSession(token: string) {", oldLine: 4, newLine: 4 },
      { type: "remove", text: "  // Legacy unsafe eval of user-provided token header", oldLine: 5 },
      { type: "remove", text: "  const decoded = eval(`(${Buffer.from(token, 'base64').toString()})`);", oldLine: 6 },
      { type: "add", text: "  // Orbit Protected: Strict JSON AST parser with HMAC validation", newLine: 5 },
      { type: "add", text: "  const decoded = await SessionValidator.verifyAndExtract(token);", newLine: 6 },
      { type: "same", text: "  if (!decoded || !decoded.userId) {", oldLine: 7, newLine: 7 },
      { type: "same", text: "    throw new AuthenticationError('Invalid token signature');", oldLine: 8, newLine: 8 },
      { type: "same", text: "  }", oldLine: 9, newLine: 9 },
      { type: "same", text: "  return decoded;", oldLine: 10, newLine: 10 },
      { type: "same", text: "}", oldLine: 11, newLine: 11 },
    ],
  },
  {
    id: "diff-002",
    filePath: "src/api/routes/billing.ts",
    fileName: "billing.ts",
    model: "Gemini 2.5 Pro",
    modelType: "gemini",
    action: "Idempotency Guard Injection",
    impactScore: 2,
    affectedFiles: ["src/index.ts", "test/billing.test.ts"],
    riskLevel: "LOW",
    summary: "Added Redis-backed idempotency key check to prevent duplicate charge calls during network retry spikes.",
    timestamp: "2m ago",
    status: "pending",
    diffLines: [
      { type: "same", text: "export async function handleSubscriptionCharge(req: Request) {", oldLine: 45, newLine: 45 },
      { type: "same", text: "  const { customerId, tierId, idempotencyKey } = req.body;", oldLine: 46, newLine: 46 },
      { type: "remove", text: "  const charge = await stripe.charges.create({ customerId, tierId });", oldLine: 47 },
      { type: "add", text: "  const cachedCharge = await idempotencyVault.get(idempotencyKey);", newLine: 47 },
      { type: "add", text: "  if (cachedCharge) return cachedCharge;", newLine: 48 },
      { type: "add", text: "  const charge = await stripe.charges.create({ customerId, tierId }, { idempotencyKey });", newLine: 49 },
      { type: "same", text: "  return charge;", oldLine: 48, newLine: 50 },
      { type: "same", text: "}", oldLine: 49, newLine: 51 },
    ],
  },
  {
    id: "diff-003",
    filePath: "src/orchestrator/executor.ts",
    fileName: "executor.ts",
    model: "GPT-4o",
    modelType: "gpt",
    action: "Timeout Guardrail",
    impactScore: 14,
    affectedFiles: [
      "src/index.ts",
      "src/orchestrator/mcp-gateway.ts",
      "src/orchestrator/dispatcher.ts",
      "src/cli/commands.ts",
      "src/api/routes/exec.ts"
    ],
    riskLevel: "HIGH",
    summary: "Refactored process runner. Modified dangerous eval routine; needs engineer verification.",
    timestamp: "5m ago",
    status: "approved",
    diffLines: [
      { type: "same", text: "export async function executePlan(plan: ExecutionPlan) {", oldLine: 82, newLine: 82 },
      { type: "remove", text: "  await child_process.exec(plan.script);", oldLine: 83 },
      { type: "add", text: "  await sandboxRunner.execIsolated(plan.script, { timeoutMs: 5000 });", newLine: 83 },
      { type: "same", text: "}", oldLine: 84, newLine: 84 },
    ],
  },
];

const INITIAL_SESSIONS: MCPSession[] = [
  {
    id: "s-claude",
    name: "Claude 3.7 Sonnet",
    model: "claude-3-7-sonnet-20250219",
    modelType: "claude",
    status: "active",
    latencyMs: 14,
    requestsCount: 28,
  },
  {
    id: "s-gemini",
    name: "Gemini 2.5 Pro",
    model: "gemini-2.5-pro",
    modelType: "gemini",
    status: "active",
    latencyMs: 19,
    requestsCount: 42,
  },
  {
    id: "s-gpt",
    name: "GPT-4o",
    model: "gpt-4o",
    modelType: "gpt",
    status: "active",
    latencyMs: 22,
    requestsCount: 15,
  },
  {
    id: "s-ollama",
    name: "Ollama Local (DeepSeek-R1)",
    model: "deepseek-r1:14b",
    modelType: "ollama",
    status: "paused",
    latencyMs: 6,
    requestsCount: 7,
  },
];

export const useCockpitStore = create<CockpitState>((set) => ({
  activeFilePath: "src/auth/session.ts",
  activeDiffId: "diff-001",
  pendingDiffs: INITIAL_DIFFS,
  mcpSessions: INITIAL_SESSIONS,
  gitBranch: "main",
  isConnected: false,
  activeFilter: "all",
  authToken: null,
  publicTunnelUrl: null,
  serverUrl: "ws://localhost:9121",
  isAuthRequired: false,
  authError: null,
  isShareModalOpen: false,

  setActiveFilePath: (path) =>
    set((state) => {
      const matchingDiff = state.pendingDiffs.find((d) => d.filePath === path);
      return {
        activeFilePath: path,
        activeDiffId: matchingDiff ? matchingDiff.id : state.activeDiffId,
      };
    }),

  setActiveDiffId: (id) =>
    set((state) => {
      const match = state.pendingDiffs.find((d) => d.id === id);
      return {
        activeDiffId: id,
        activeFilePath: match ? match.filePath : state.activeFilePath,
      };
    }),

  approveDiff: (id) =>
    set((state) => ({
      pendingDiffs: state.pendingDiffs.map((d) =>
        d.id === id ? { ...d, status: "approved" } : d
      ),
    })),

  blockDiff: (id) =>
    set((state) => ({
      pendingDiffs: state.pendingDiffs.map((d) =>
        d.id === id ? { ...d, status: "blocked" } : d
      ),
    })),

  rollbackDiff: (id) =>
    set((state) => ({
      pendingDiffs: state.pendingDiffs.map((d) =>
        d.id === id ? { ...d, status: "reverted" } : d
      ),
    })),

  toggleSession: (id) =>
    set((state) => ({
      mcpSessions: state.mcpSessions.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "active" ? "paused" : "active" }
          : s
      ),
    })),

  setActiveFilter: (filter) => set({ activeFilter: filter }),

  injectNewDiff: (diff) =>
    set((state) => {
      const exists = state.pendingDiffs.some((d) => d.id === diff.id);
      if (exists) return state;
      return {
        pendingDiffs: [diff, ...state.pendingDiffs],
        activeDiffId: diff.id,
        activeFilePath: diff.filePath,
      };
    }),

  setIsConnected: (connected) => set({ isConnected: connected }),
  setGitBranch: (branch) => set({ gitBranch: branch }),
  setAuthToken: (token) => set({ authToken: token }),
  setPublicTunnelUrl: (url) => set({ publicTunnelUrl: url }),
  setServerUrl: (url) => set({ serverUrl: url }),
  setIsAuthRequired: (required) => set({ isAuthRequired: required }),
  setAuthError: (error) => set({ authError: error }),
  setIsShareModalOpen: (open) => set({ isShareModalOpen: open }),
}));
