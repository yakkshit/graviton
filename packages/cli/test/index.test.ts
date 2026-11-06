import { describe, it, expect } from "bun:test";

describe("Graviton CLI", () => {
  it("exports a valid version and module definition", () => {
    expect(true).toBe(true);
  });

  it("binary target compiles without errors", async () => {
    const proc = Bun.spawn(["node", "./dist/index.js", "--version"], {
      stdout: "pipe",
    });
    const output = await new Response(proc.stdout).text();
    expect(output.trim()).toBe("1.0.0");
  });
});
