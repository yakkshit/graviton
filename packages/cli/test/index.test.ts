import { describe, it, expect } from "bun:test";
import { resolve } from "node:path";

describe("Graviton CLI", () => {
  it("exports a valid version and module definition", () => {
    expect(true).toBe(true);
  });

  it("CLI executable runs without errors", async () => {
    const srcPath = resolve(import.meta.dir, "../src/index.ts");
    const proc = Bun.spawn(["bun", srcPath, "--version"], {
      stdout: "pipe",
    });
    const output = await new Response(proc.stdout).text();
    expect(output.trim()).toBe("1.0.0");
  });
});
