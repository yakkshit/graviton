"""Graviton CLI - Python execution wrapper.

Seamlessly bridges Python environments with the high-performance Graviton engine.
"""

import os
import shutil
import subprocess
import sys


def find_executable():
    """Find the best runner for the Graviton CLI binary."""
    # 1. Direct native binary in PATH
    native_bin = shutil.which("graviton")
    if native_bin and os.path.abspath(native_bin) != os.path.abspath(sys.argv[0]):
        return [native_bin]

    # 2. Prefer Bunx for sub-millisecond startup
    bunx = shutil.which("bunx")
    if bunx:
        return [bunx, "@yakkshit/graviton"]

    # 3. Fallback to npx
    npx = shutil.which("npx")
    if npx:
        return [npx, "-y", "@yakkshit/graviton"]

    # 4. Check for node runner with global or local dist
    node = shutil.which("node")
    if node:
        return [node]

    return None


def main():
    """Main entrypoint for the `graviton` command in Python environments."""
    runner = find_executable()

    if not runner:
        sys.stderr.write(
            "\033[1;31m[Graviton Error]\033[0m Graviton requires Bun (recommended) or Node.js.\n\n"
            "To install Bun for ultra-fast startup:\n"
            "  \033[1;36mcurl -fsSL https://bun.sh/install | bash\033[0m\n\n"
            "Or install Node.js:\n"
            "  \033[1;36mhttps://nodejs.org\033[0m\n\n"
            "After installing, re-run: \033[1;32mgraviton\033[0m\n"
        )
        sys.exit(1)

    cmd = runner + sys.argv[1:]
    try:
        process = subprocess.run(cmd)
        sys.exit(process.returncode)
    except KeyboardInterrupt:
        sys.exit(130)
    except Exception as exc:
        sys.stderr.write(f"\033[1;31m[Graviton Error]\033[0m Failed to execute Graviton: {exc}\n")
        sys.exit(1)


if __name__ == "__main__":
    main()

