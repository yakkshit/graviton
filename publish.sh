#!/usr/bin/env bash
set -e

# ==============================================================================
# 🪐 Graviton Production Publishing Pipeline
# Handles npm, PyPI, GitHub, and Vercel release staging.
# ==============================================================================

echo ""
echo "🪐 ========================================================="
echo "          GRAVITON PRODUCTION PUBLISH PIPELINE               "
echo "=========================================================="
echo ""

# 1. Verification & Build
echo "📦 Step 1: Building Graviton Core CLI..."
bun run --cwd packages/cli build

echo "🔍 Step 2: Testing CLI build artifact..."
node ./packages/cli/dist/index.js --help > /dev/null
echo "✓ Graviton CLI compiles and executes successfully."

# 2. npm Publishing Strategy
echo ""
echo "🚀 Step 3: npm Publishing Strategy..."
echo "Strategy: Attempt 'graviton' first. Fall back to '@yakkshit/graviton' if taken."

cd packages/cli
if [ "$1" == "--publish" ]; then
  echo "Attempting publish as 'graviton'..."
  node -e '
    const fs = require("fs");
    const pkg = JSON.parse(fs.readFileSync("./package.json", "utf8"));
    pkg.name = "graviton";
    fs.writeFileSync("./package.json", JSON.stringify(pkg, null, 2) + "\n");
  '

  if npm publish --access public; then
    echo "🎉 Successfully published as 'graviton' to npm!"
  else
    echo "⚠️ 'graviton' taken or restricted. Falling back to '@yakkshit/graviton'..."
    node -e '
      const fs = require("fs");
      const pkg = JSON.parse(fs.readFileSync("./package.json", "utf8"));
      pkg.name = "@yakkshit/graviton";
      fs.writeFileSync("./package.json", JSON.stringify(pkg, null, 2) + "\n");
    '
    npm publish --access public
    echo "🎉 Successfully published as '@yakkshit/graviton' to npm!"
  fi
else
  echo "DRY RUN MODE: Skipping actual network upload."
  echo "To publish for real, run: ./publish.sh --publish"
fi
cd ../..

# 3. PyPI Package Build
echo ""
echo "🐍 Step 4: Python Wrapper (graviton-cli) for PyPI..."
echo "Package located in packages/python"
echo "To build and publish manually to PyPI:"
echo "  cd packages/python"
echo "  python3 setup.py sdist bdist_wheel"
echo "  twine upload dist/*"

# 4. GitHub Setup
echo ""
echo "🐙 Step 5: GitHub Setup (yakkshit/graviton)..."
echo "To push your local repository to GitHub:"
echo "  git remote add origin https://github.com/yakkshit/graviton.git"
echo "  git branch -M main"
echo "  git push -u origin main"

# 5. Vercel Deployment Commands
echo ""
echo "▲ Step 6: Vercel Deployment..."
echo "Configs ready in:"
echo "  - apps/web/vercel.json (Marketing Site)"
echo "  - apps/cockpit/vercel.json (Cockpit App)"
echo ""
echo "To deploy when ready:"
echo "  vercel --cwd apps/web       # Deploy Marketing Site"
echo "  vercel --cwd apps/cockpit   # Deploy Cockpit App"
echo ""
echo "🪐 Graviton is primed and launch-ready!"
