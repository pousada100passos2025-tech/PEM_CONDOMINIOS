import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();

describe("dashboard premium regression", () => {
  it("keeps the pre-patch dashboard quick actions wired to core condominium modules", () => {
    const main = readFileSync(resolve(root, "src/main.jsx"), "utf8");

    expect(main).toContain("select('condominios')");
    expect(main).toContain("select('moradores')");
    expect(main).toContain("select('reservas')");
    expect(main).toContain("id:'financeiro'");
    expect(main).toContain("id:'ocorrencias'");
  });

  it("keeps the legacy premium verifier responsible for post-patch premium markers", () => {
    const verifier = readFileSync(resolve(root, "scripts/verify-dashboard-premium.mjs"), "utf8");

    expect(verifier).toContain("PEM_DASHBOARD_PREMIUM");
    expect(verifier).toContain("CENTRAL DE OPERAÇÃO");
    expect(verifier).toContain("premium-command-center");
    expect(verifier).toContain("premium-kpi-grid");
    expect(verifier).toContain("premium-ops-grid");
  });
});
