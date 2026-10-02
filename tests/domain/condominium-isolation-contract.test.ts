import { describe, expect, it } from "vitest";
import { assertCondominiumAccess } from "../../src/security/condominiumContext";

describe("PEM Condomínios isolation", () => {
  it("rejects a missing active condominium", () => {
    expect(() => assertCondominiumAccess(undefined, "condominio-a")).toThrow("condomínio ativo obrigatório");
  });

  it("accepts an entity that belongs to the active condominium", () => {
    expect(assertCondominiumAccess("condominio-a", "condominio-a")).toBe("condominio-a");
  });

  it("rejects crossing condominium boundaries", () => {
    expect(() => assertCondominiumAccess("condominio-a", "condominio-b")).toThrow("acesso entre condomínios bloqueado");
  });
});
