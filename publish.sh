#!/bin/bash
echo "🪐 Graviton Publishing Pipeline..."
echo "Building CLI..."
cd packages/cli && bun run build && cd ../..
echo "Ready to publish. Run: cd packages/cli && npm publish --access public"