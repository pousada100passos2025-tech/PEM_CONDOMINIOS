# Handoff — Engineering Skills Pipeline — 2026-10-02

## Objetivo
Formalizar Grill-me, TDD, Handoff e Teach no PEM Condomínios, criando uma fundação real de testes sem remover os patches de build ainda necessários.

## Implementado nesta branch
- `AGENTS.md` com fluxo específico do domínio condominial.
- Templates de Grill-me, Handoff e Teach em `docs/engineering/`.
- Vitest configurado e `npm test` criado.
- `npm run verify` executa testes antes do build existente.
- Teste de contrato do repositório.
- Teste de isolamento entre condomínios.
- Helper puro `src/security/condominiumContext.ts`.
- Primeira migração de verificação de dashboard para teste de regressão em `tests/regression/dashboard-premium.test.ts`.
- CI `Engineering Quality` executando `npm run verify`.
- Documentação Teach do fluxo.

## Regra de isolamento
Ausência de condomínio ativo é inválida. Recurso associado a outro condomínio deve ser bloqueado. O helper não substitui políticas RLS no Supabase.

## Banco / RLS / Functions
Nenhuma migration, política RLS ou Edge Function foi alterada nesta implantação.

## Scripts legados preservados
Os scripts `patch-recovery.mjs`, `patch-condo-foundation.mjs`, `patch-condo-save.mjs`, `patch-dashboard-premium.mjs`, `patch-dashboard-actions.mjs` e `verify-dashboard-premium.mjs` permanecem no build enquanto suas regras ainda não estiverem totalmente migradas para testes.

## Produção
Nenhum merge em `main` e nenhum deploy de produção foram realizados.

## Verificação
A CI da branch foi disparada após a criação do workflow. O resultado final deve ser confirmado antes de merge.

## Próximos candidatos a TDD
- autenticação e permissões;
- cadastros principais;
- recibos;
- solicitações e reservas;
- pagamentos;
- recuperação/salvamento atualmente cobertos por patches.

## Não alterar sem nova especificação
- Regras do PEM de eventos não devem ser importadas para este projeto.
- Patches legados não devem ser removidos apenas porque um primeiro teste foi criado.
- Produção não deve ser atualizada diretamente a partir desta branch.
