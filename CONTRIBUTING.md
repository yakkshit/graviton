# Contributing to Graviton 🪐

Thank you for your interest in contributing to Graviton! As a self-hosted, zero-trust AI coding cockpit, stability, cryptographic safety, and performance are our highest priorities.

---

## Development Setup

1. **Prerequisites:**
   - [Bun](https://bun.sh) (v1.1 or higher)
   - [Node.js](https://nodejs.org) (v18 or higher)
   - [Git](https://git-scm.com)

2. **Clone and Install:**
   ```bash
   git clone https://github.com/yakkshit/graviton.git
   cd graviton
   bun install
   ```

3. **Monorepo Structure:**
   - `packages/cli`: The core executable CLI (`graviton`)
   - `apps/server`: The bidirectional WebSocket & MCP interception telemetry server
   - `apps/cockpit`: The Next.js human control plane cockpit WebUI
   - `apps/web`: The Next.js marketing and documentation site
   - `packages/ui`: Shared UI primitives and 21st.dev components
   - `packages/python`: PyPI wrapper package (`graviton-cli`)

4. **Running Locally:**
   ```bash
   # Run development environment across the workspace
   bun run dev

   # Typecheck all packages
   bun run check-types

   # Build monorepo packages
   bun run build
   ```

---

## Pull Request Guidelines

1. Fork the repo and create a feature branch (`feat/your-feature-name`).
2. Adhere to TypeScript strict mode. Never use `any` unless absolutely necessary.
3. Keep UI components compliant with the dynamic theme engine (`var(--color-accent)`).
4. Run `bun test` and typechecks before submitting.
5. Provide a detailed summary in your pull request based on `.github/PULL_REQUEST_TEMPLATE.md`.

---

## License

By contributing to Graviton, you agree that your contributions will be licensed under the project's [MIT License](./LICENSE).

