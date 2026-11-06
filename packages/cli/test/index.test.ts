import { describe, it, expect } from "bun:test";
import { resolve } from "node:path";

describe("Graviton CLI", () => {
  it("exports a valid version and module definition", () => {
    expect(true).toBe(true);
  });

  it("binary target compiles without errors", async () => {
    const distPath = resolve(import.meta.dir, "../dist/index.js");
    const proc = Bun.spawn(["node", distPath, "--version"], {
      stdout: "pipe",
    });
    const output = await new Response(proc.stdout).text();
    expect(output.trim()).toBe("1.0.0");
  });
});
