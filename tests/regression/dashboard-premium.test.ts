import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();

describe("dashboard premium regression", () => {
  it("keeps the quick-action flows wired to the main condominium modules", () => {
    const main = readFileSync(resolve(root, "src/main.jsx"), "utf8");

    expect(main).toContain("openFlow('condominios')");
    expect(main).toContain("openFlow('reservas')");
    expect(main).toContain("openFlow('ocorrencias')");
    expect(main).toContain("openFlow('moradores')");
    expect(main).toContain("openFlow('financeiro')");
  });

  it("keeps the premium dashboard structure present", () => {
    const main = readFileSync(resolve(root, "src/main.jsx"), "utf8");
    const css = readFileSync(resolve(root, "src/dashboard-premium.css"), "utf8");

    expect(main).toContain("PEM_DASHBOARD_PREMIUM");
    expect(main).toContain("CENTRAL DE OPERAÇÃO");
    expect(css).toContain("premium-command-center");
    expect(css).toContain("premium-kpi-grid");
    expect(css).toContain("premium-ops-grid");
  });
});
