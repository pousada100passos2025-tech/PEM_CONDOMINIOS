# PEM Condomínios Engineering Workflow

Estas regras orientam desenvolvimento e manutenção; não representam funcionalidades visíveis ao usuário final.

## Sequência obrigatória para mudanças relevantes

1. **Grill-me:** fechar ator, condomínio/empresa, unidade quando aplicável, papel/permissão, estados, exceções, idempotência, pagamentos, privacidade e critérios de aceite.
2. **Especificação:** registrar comportamento esperado e limites da mudança.
3. **Plano:** obrigatório para mudanças multietapa, arquiteturais ou que cruzem módulos.
4. **TDD:** escrever o teste primeiro, observar a falha correta, implementar o mínimo e observar o teste passar.
5. **Implementação:** manter escopo mínimo e preservar isolamento entre condomínios.
6. **Verificação:** executar `npm run verify` quando disponível; ele deve executar testes antes do build.
7. **Revisão:** conferir regressões, permissões, RLS, pagamentos e efeitos laterais.
8. **Handoff:** registrar decisões, arquivos, banco, testes, riscos e pendências.
9. **Teach:** atualizar documentação técnica/operacional quando a mudança alterar arquitetura, fluxo ou regras.

## Regras de segurança

- Nunca confiar apenas em filtro de interface para isolamento entre condomínios; a proteção deve existir no caminho de dados apropriado.
- Scripts de patch do build não substituem testes comportamentais permanentes.
- Não remover patches existentes enquanto regras ainda não migradas dependerem deles.
- Não copiar regras do PEM de eventos para o domínio condominial.
- Não fazer deploy ou alteração direta de produção como parte deste fluxo sem autorização específica.

## Artefatos

- Grill-me: `docs/engineering/grill-me-template.md`
- Handoff: `docs/engineering/handoff-template.md`
- Teach: `docs/engineering/teach-guidelines.md`
- Specs: `docs/superpowers/specs/`
- Planos: `docs/superpowers/plans/`
