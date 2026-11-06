# Changelog

All notable changes to the Graviton project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-11-06

### Added
- **Core Engine & CLI:**
  - `graviton start`: Launches the local MCP gateway, telemetry server, and Cockpit WebUI.
  - `graviton mcp`: Standard I/O MCP server for direct editor integration with Cursor, Claude Desktop, and VS Code.
  - End-to-end encrypted remote tunneling via `localtunnel` with mandatory token handshake.
- **Zero-Trust File Interception:**
  - Real-time trapping of `propose_edit` operations in an isolated in-memory buffer before any filesystem mutation.
  - Atomic Git snapshot generation before disk application.
- **AST Blast Radius Engine:**
  - Deep semantic dependency scanning via `ts-morph`.
  - Calculates exact affected downstream files, symbols, and automatic risk categorization (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`).
- **Cockpit WebUI (`apps/cockpit`):**
  - High-precision unified and side-by-side split diff inspection.
  - Instant one-click **Approve**, **Block**, and **Rollback** actions.
  - Command Palette (`⌘K`) spotlight search with live diff jumping, theme switching, and session management.
  - Dynamic Accent Theme Engine supporting Electric Blue, Terminal Green, Neon Purple, Cyber Yellow, and Crimson.
  - Sonner notifications, animated blast radius counters, and shimmer skeleton loaders.
- **Marketing Site (`apps/web`):**
  - Scrollytelling interactive demonstration ("The Gravity Loop").
  - 3D interactive cockpit hardware mockup with dynamic perspective and ambient floating.
  - Bento Grid feature panels with glassmorphic depth and flowing borders.
  - Animated live architecture topology map with pulsing central WebUI control plane and SVG data flows.
- **Cross-Platform Distribution:**
  - npm distribution with automated fallback from `graviton` to `@yakkshit/graviton`.
  - PyPI distribution via standalone executable bridge package `graviton-cli`.

