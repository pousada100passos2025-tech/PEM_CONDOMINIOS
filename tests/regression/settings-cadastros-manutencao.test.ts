import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();

describe("configuracoes, cadastros e manutencao", () => {
  it("exposes the three new navigation modules", () => {
    const main = readFileSync(resolve(root, "src/main.jsx"), "utf8");

    expect(main).toContain("id:'cadastros'");
    expect(main).toContain("id:'manutencao'");
    expect(main).toContain("id:'configuracoes'");
  });

  it("keeps condominium settings editable, including CNPJ", () => {
    const main = readFileSync(resolve(root, "src/main.jsx"), "utf8");

    expect(main).toContain('function ConfiguracoesPage');
    expect(main).toContain('Configurações do condomínio');
    expect(main).toContain('label="CNPJ"');
    expect(main).toContain("supabase.from('condominios').update");
  });

  it("provides companies, suppliers and maintenance registers", () => {
    const main = readFileSync(resolve(root, "src/main.jsx"), "utf8");

    expect(main).toContain('Empresas e fornecedores');
    expect(main).toContain('Fornecedor');
    expect(main).toContain('function ManutencaoPage');
    expect(main).toContain('Manutenção preventiva e corretiva');
  });
});
