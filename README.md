<p align="center">
  <h1 align="center">🪐 GRAVITON</h1>
  <p align="center">
    <strong>Your code is the center. AI orbits it. You control the gravity.</strong>
  </p>
  <p align="center">
    The self-hosted, zero-trust AI coding cockpit and Model Context Protocol (MCP) control plane.
  </p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@yakkshit/graviton"><img src="https://img.shields.io/npm/v/@yakkshit/graviton?style=for-the-badge&logo=npm&color=3B82F6" alt="npm version"/></a>
  <a href="https://pypi.org/project/graviton-cli"><img src="https://img.shields.io/pypi/v/graviton-cli?style=for-the-badge&logo=pypi&color=3B82F6" alt="PyPI version"/></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License"/></a>
  <a href="https://github.com/yakkshit/graviton"><img src="https://img.shields.io/badge/Build-Passing-10B981?style=for-the-badge&logo=githubactions&logoColor=white" alt="Build Status"/></a>
  <a href="https://bun.sh"><img src="https://img.shields.io/badge/Bun-1.4+-black?style=for-the-badge&logo=bun" alt="Bun"/></a>
  <a href="https://modelcontextprotocol.io"><img src="https://img.shields.io/badge/MCP-Protocol%20Ready-6366F1?style=for-the-badge&logo=anthropic" alt="MCP Ready"/></a>
  <a href="https://turbo.build"><img src="https://img.shields.io/badge/Turborepo-Fast-EF4444?style=for-the-badge&logo=turborepo" alt="Turborepo"/></a>
</p>

---

## ⚡ What is Graviton?

Modern reasoning models (Claude 3.7 Sonnet, Gemini 2.5 Flash, GPT-4o, DeepSeek-R1, Local Ollama) write code at blinding speeds. But giving autonomous agents direct, unmonitored write access to your filesystem invites catastrophic regression, context blindness, and broken production branches.

**Graviton** places a **Zero-Trust Control Plane** between your AI models and your disk:
1. **Traps Proposals in Memory:** Every tool edit is caught in an isolated in-memory buffer before hitting disk.
2. **Computes Blast Radius:** Recursively parses downstream AST dependencies with `ts-morph` to gauge project-wide impact.
3. **Presents Cockpit WebUI:** You inspect unified/split diffs, check affected symbols, and click **Approve**, **Block**, or **Rollback**.
4. **Guarantees Git Determinism:** Auto-commits safety snapshots before writes, enabling single-click rollback without manual Git surgery.

---

## 📦 Installation

### npm (Recommended)
```bash
bunx graviton start
# or
npx graviton start
```

### PyPI
```bash
pip install graviton-cli
graviton start
```

### From Source
```bash
git clone https://github.com/yakkshit/graviton.git
cd graviton
bun install
bun run dev
```

---

## 🚀 Quick Start

```bash
# 1. Start the engine
graviton start

# 2. Open the Cockpit
open http://localhost:9121

# 3. Connect your AI agent
# Add to Cursor Settings → Features → MCP:
{
  "mcpServers": {
    "graviton": {
      "command": "graviton",
      "args": ["mcp"]
    }
  }
}
```

### CLI Command Options

```bash
# Launch Cockpit WebUI and local MCP daemon on target repository:
graviton start --dir . --port 9121

# Spin up an end-to-end encrypted public tunnel for remote pairing:
graviton start --tunnel

# Provide a specific authentication token:
graviton start --tunnel --auth-key "your-secure-secret-token"
```

| Option | Flag | Default | Description |
| :--- | :--- | :--- | :--- |
| **Port** | `-p, --port <number>` | `9121` | WebSocket & HTTP telemetry server port |
| **Target Directory** | `-d, --dir <path>` | `.` | Root directory of the repository to supervise |
| **Auth Key** | `-a, --auth-key <string>` | *(Auto-generated UUID)* | Secret token required for WS/MCP connections |
| **Public Tunnel** | `-t, --tunnel` | `false` | Automatically provisions secure public HTTPS/WSS URL |
| **No Open** | `--no-open` | `false` | Prevent auto-opening default browser to Cockpit WebUI |

---

## 🔌 IDE Integration (Cursor & Claude Desktop)

Graviton exposes native Model Context Protocol (MCP) tools (`read_file`, `propose_edit`, `get_ast_graph`, `rollback_checkpoint`).

### 1. Cursor (`.cursor/mcp.json`)
```json
{
  "mcpServers": {
    "graviton": {
      "command": "graviton",
      "args": ["mcp"]
    }
  }
}
```

### 2. Claude Desktop (`claude_desktop_config.json`)
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "graviton": {
      "command": "graviton",
      "args": ["mcp"]
    }
  }
}
```

---

## 🛡️ Security

- **Zero-trust by default:** AI agents cannot write to disk without human approval.
- **In-memory interception:** All edits intercepted via MCP `propose_edit` tool before hitting the filesystem.
- **AST blast radius analysis:** Deep static analysis before every code change.
- **Atomic Git snapshots:** Auto-commits safety checkpoints before every edit for instant rollback.
- **Encrypted remote pairing:** Optional secure tunneling with token authentication.

---

## 📊 Tech Stack

- **Frontend:** Next.js 16, Tailwind CSS v4, Framer Motion, shadcn/ui, 21st.dev
- **Backend:** Bun, WebSocket, `@modelcontextprotocol/sdk`, `ts-morph`, `simple-git`
- **Monorepo:** Turborepo
- **Package Manager:** Bun
- **Distribution:** npm (`@yakkshit/graviton` / `graviton`), PyPI (`graviton-cli`)

---

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

---

## 📄 License

MIT © 2026 Venkata Sai Yakkshit Reddy Asodi. See [LICENSE](./LICENSE).
