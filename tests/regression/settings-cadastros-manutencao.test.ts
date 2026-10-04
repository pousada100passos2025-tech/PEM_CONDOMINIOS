import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { patchSource } from "../../scripts/patch-condo-admin-modules.mjs";

const root = process.cwd();
const original = readFileSync(resolve(root, "src/main.jsx"), "utf8");
const main = patchSource(original);

describe("configuracoes, cadastros e manutencao", () => {
  it("exposes the three new navigation modules", () => {
    expect(main).toContain("id:'cadastros'");
    expect(main).toContain("id:'manutencao'");
    expect(main).toContain("id:'configuracoes'");
  });

  it("keeps condominium settings editable, including CNPJ", () => {
    expect(main).toContain('function ConfiguracoesPage');
    expect(main).toContain('Configurações do condomínio');
    expect(main).toContain('label="CNPJ"');
    expect(main).toContain("supabase.from('condominios').update");
  });

  it("provides companies, suppliers and maintenance registers", () => {
    expect(main).toContain('Empresas e fornecedores');
    expect(main).toContain("supabase.from('prestadores_servicos')");
    expect(main).toContain('function ManutencaoPage');
    expect(main).toContain('Manutenção preventiva e corretiva');
    expect(main).toContain("supabase.from('chamados').insert");
  });

  it("wires the patch into the production build", () => {
    const pkg = readFileSync(resolve(root, "package.json"), "utf8");
    expect(pkg).toContain('node scripts/patch-condo-admin-modules.mjs');
  });
});
