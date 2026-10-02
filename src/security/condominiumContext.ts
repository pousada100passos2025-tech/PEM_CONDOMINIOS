export function assertCondominiumAccess(activeCondominiumId?: string, resourceCondominiumId?: string): string {
  if (!activeCondominiumId) {
    throw new Error("condomínio ativo obrigatório");
  }

  if (resourceCondominiumId && resourceCondominiumId !== activeCondominiumId) {
    throw new Error("acesso entre condomínios bloqueado");
  }

  return activeCondominiumId;
}
