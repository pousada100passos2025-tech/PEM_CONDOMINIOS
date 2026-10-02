import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const file = (path: string) => resolve(root, path);

describe("PEM Condomínios engineering repository contract", () => {
  it("keeps the required engineering workflow artifacts", () => {
    expect(existsSync(file("AGENTS.md"))).toBe(true);
    expect(existsSync(file("docs/engineering/grill-me-template.md"))).toBe(true);
    expect(existsSync(file("docs/engineering/handoff-template.md"))).toBe(true);
    expect(existsSync(file("docs/engineering/teach-guidelines.md"))).toBe(true);
  });

  it("defines an explicit test and verify gate without replacing build", () => {
    const pkg = JSON.parse(readFileSync(file("package.json"), "utf8"));
    expect(pkg.scripts.test).toBe("vitest run");
    expect(pkg.scripts.verify).toBe("npm test && npm run build");
    expect(pkg.scripts.build).toContain("verify-dashboard-premium.mjs");
  });
});
