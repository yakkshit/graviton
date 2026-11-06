# 🪐 Graviton CLI (`graviton-cli`)

[![PyPI version](https://img.shields.io/pypi/v/graviton-cli.svg?color=3b82f6)](https://pypi.org/project/graviton-cli/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![Python: 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://pypi.org/project/graviton-cli/)

> **"Your code is the center. AI orbits it. You control the gravity."**

Graviton is a self-hosted, zero-trust AI coding cockpit that sits between your codebase and AI models (Claude, Gemini, GPT-4o, Ollama). It runs a bidirectional MCP gateway with AST blast radius analysis, real-time WebUI diff interception, and git-native rollback capabilities.

---

## ⚡ Installation

Install via pip:

```bash
pip install graviton-cli
```

Or run directly with `pipx`:

```bash
pipx run graviton-cli start
```

*(Note: Graviton executes via native runtime (Bun or Node.js) for sub-millisecond AST parsing).*

---

## 🚀 Quick Start

Initialize Graviton in your repository:

```bash
graviton start
```

This starts:
- 🟢 **MCP Gateway:** `ws://127.0.0.1:9120`
- 🖥️ **Cockpit WebUI:** `http://localhost:9121`

---

## 🔌 IDE Integration (Cursor & Claude Desktop)

Add the Graviton MCP server to your configuration:

### Cursor (`.cursor/mcp.json`):
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

### Claude Desktop (`claude_desktop_config.json`):
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

## 📄 License

MIT © [Yakkshit](https://github.com/yakkshit)
