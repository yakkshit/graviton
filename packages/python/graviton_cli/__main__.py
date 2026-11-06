import os
import platform
import shutil
import subprocess
import sys
from pathlib import Path
from typing import NoReturn


def get_binary_path() -> Path:
    """Resolve the platform-specific standalone binary."""
    system: str = platform.system().lower()
    machine: str = platform.machine().lower()

    if system == "darwin":
        arch: str = "arm64" if machine == "arm64" else "x64"
        binary: str = f"graviton-darwin-{arch}"
    elif system == "linux":
        arch: str = "arm64" if machine in ("arm64", "aarch64") else "x64"
        binary: str = f"graviton-linux-{arch}"
    elif system == "windows":
        binary: str = "graviton-win-x64.exe"
    else:
        raise RuntimeError(f"Unsupported platform: {system} {machine}")

    return Path(__file__).parent.parent / "bin" / binary


def main() -> NoReturn:
    """Execute Graviton native binary or system fallback."""
    binary: Path = get_binary_path()

    if binary.exists():
        try:
            os.chmod(binary, 0o755)
            result = subprocess.run([str(binary)] + sys.argv[1:])
            sys.exit(result.returncode)
        except KeyboardInterrupt:
            sys.exit(130)
        except Exception as exc:
            print(f"Error running Graviton binary: {exc}", file=sys.stderr)
            sys.exit(1)

    # Fallback to bunx or npx runner if precompiled binary is not bundled for this arch
    bunx: str | None = shutil.which("bunx")
    if bunx:
        result = subprocess.run([bunx, "@yakkshit/graviton"] + sys.argv[1:])
        sys.exit(result.returncode)

    npx: str | None = shutil.which("npx")
    if npx:
        result = subprocess.run([npx, "-y", "@yakkshit/graviton"] + sys.argv[1:])
        sys.exit(result.returncode)

    print(f"Error: Graviton binary not found at {binary}", file=sys.stderr)
    print("Please install Bun (https://bun.sh) or Node.js (https://nodejs.org).", file=sys.stderr)
    sys.exit(1)


if __name__ == "__main__":
    main()
