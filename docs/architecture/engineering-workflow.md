# Fluxo de engenharia do PEM Condomínios

O desenvolvimento relevante segue esta sequência:

1. Grill-me: fechar ator, condomínio/empresa, papel, unidade, estados, exceções, idempotência, pagamentos, privacidade e critérios de aceite.
2. Especificação: registrar o comportamento esperado.
3. Plano: usar quando a mudança for multietapa ou atravessar subsistemas.
4. TDD: escrever primeiro o teste que demonstra a regra ou regressão.
5. Implementação mínima: alterar apenas o necessário para tornar o teste verde.
6. Verificação: executar `npm run verify`, que roda testes e depois o build atual.
7. Revisão: conferir isolamento entre condomínios, permissões e regressões.
8. Handoff: registrar decisões, arquivos, banco/RLS/functions, integrações, testes, riscos e pendências.
9. Teach: atualizar documentação reutilizável.

## Isolamento entre condomínios

`src/security/condominiumContext.ts` contém o contrato puro inicial. Contexto sem condomínio ativo é inválido e recurso de outro condomínio deve ser bloqueado. O helper não substitui RLS do Supabase.

## Testes e patches

- `npm test`: executa Vitest.
- `npm run verify`: executa testes e, em seguida, o build existente.
- Os scripts de patch continuam presentes enquanto ainda forem necessários.
- `tests/regression/dashboard-premium.test.ts` já migra parte da verificação do dashboard para uma regressão executável.

A CI em `.github/workflows/engineering-quality.yml` executa `npm run verify` em pull requests e na branch de integração deste trabalho.
