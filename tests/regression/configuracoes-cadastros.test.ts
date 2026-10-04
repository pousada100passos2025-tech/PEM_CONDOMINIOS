import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();

describe("configuracoes e cadastros", () => {
  it("exposes settings and cadastros in the PEM Condomínios menu", () => {
    const main = readFileSync(resolve(root, "src/main.jsx"), "utf8");

    expect(main).toContain("id:'configuracoes'");
    expect(main).toContain("id:'cadastros'");
    expect(main).toContain("Configurações");
    expect(main).toContain("Cadastros");
  });

  it("persists condominium settings and service providers", () => {
    const main = readFileSync(resolve(root, "src/main.jsx"), "utf8");

    expect(main).toContain("from('condominios').update");
    expect(main).toContain("from('prestadores_servicos').insert");
    expect(main).toContain("Fornecedores");
    expect(main).toContain("Manutenção");
  });
});
