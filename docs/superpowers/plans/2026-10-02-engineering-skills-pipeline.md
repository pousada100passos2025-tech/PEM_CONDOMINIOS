# PEM Condomínios Engineering Skills Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Formalizar Grill-me, TDD, Handoff e Teach no PEM Condomínios e criar uma fundação real de testes automatizados antes de ampliar o sistema.

**Architecture:** O repositório ganhará uma camada de processo versionada (`AGENTS.md` + templates) e uma suíte Vitest separada dos scripts de patch do build. O build atual continuará existindo, mas `npm test` passará a ser uma verificação explícita e independente para comportamento e contratos de engenharia.

**Tech Stack:** React, TypeScript, Vite, Node.js, Supabase, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-02-engineering-skills-pipeline-design.md`

## Global Constraints

- Não criar funcionalidades de usuário final chamadas Grill-me, TDD, Handoff ou Teach.
- Não copiar regras do PEM de eventos para o Condomínios.
- Não considerar scripts de patch como substitutos permanentes de testes comportamentais.
- Não alterar produção diretamente durante a implantação desse processo.
- O build atual deve continuar funcionando após a introdução da suíte de testes.

## Review Focus

- Adição de testes não pode remover ou mascarar nenhum patch ainda necessário ao build.
- Um agente deve distinguir claramente regras do domínio condominial das regras do PEM de eventos.
- O fluxo deve falhar cedo quando um teste quebrar, sem depender de deploy para descobrir regressão.
- O Handoff deve registrar banco, políticas, integrações, testes, riscos e pendências.
- A documentação Teach deve permitir continuação do projeto sem depender do histórico da conversa.

---

### Task 1: Contrato de engenharia para agentes

**Files:**
- Create: `AGENTS.md`
- Create: `docs/engineering/grill-me-template.md`
- Create: `docs/engineering/handoff-template.md`
- Create: `docs/engineering/teach-guidelines.md`

**Interfaces:**
- Consumes: design aprovado do pipeline.
- Produces: regras de processo obrigatórias para desenvolvimento e manutenção do PEM Condomínios.

- [ ] **Step 1: Criar `AGENTS.md`** com a sequência `Grill-me -> especificação -> plano quando multietapa -> teste falhando -> implementação mínima -> testes/build -> revisão -> Handoff -> Teach`.
- [ ] **Step 2: Criar `grill-me-template.md`** cobrindo ator, condomínio/empresa, papel/permissão, unidade, estados, exceções, idempotência, pagamento, privacidade e critérios de aceite.
- [ ] **Step 3: Criar `handoff-template.md`** exigindo objetivo, decisões, arquivos, banco/RLS/functions, integrações, testes, riscos, pendências e áreas protegidas.
- [ ] **Step 4: Criar `teach-guidelines.md`** para arquitetura, domínio condominial, permissões, fluxos e operação.
- [ ] **Step 5: Revisar os arquivos** e confirmar que não importam regras do domínio de eventos.
- [ ] **Step 6: Commit** `docs: add condo engineering workflow templates`.

### Task 2: Fundação formal de testes

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `tests/engineering/repository-contract.test.ts`

**Interfaces:**
- Consumes: arquivos da Task 1 e scripts atuais de build.
- Produces: `npm test` executando suíte Vitest separada do build e `npm run verify` executando testes + build.

- [ ] **Step 1: Escrever teste de contrato do repositório** verificando presença de `AGENTS.md`, templates e scripts `test`/`verify`.
- [ ] **Step 2: Executar o teste antes da configuração** e confirmar FAIL porque a infraestrutura ainda não existe.
- [ ] **Step 3: Adicionar `vitest` em `devDependencies`** e criar scripts `test: "vitest run"` e `verify: "npm test && npm run build"`, preservando integralmente o script `build` atual.
- [ ] **Step 4: Criar `vitest.config.ts`** com ambiente Node e include `tests/**/*.test.ts`.
- [ ] **Step 5: Executar `npm test`** e confirmar PASS.
- [ ] **Step 6: Executar `npm run verify`** e confirmar que testes e build passam juntos.
- [ ] **Step 7: Commit** `test: establish condo TDD foundation`.

### Task 3: Primeiro contrato de domínio condominial

**Files:**
- Create: `tests/domain/condominium-isolation-contract.test.ts`
- Read-only reference: módulos Supabase e helpers de seleção de condomínio identificados durante execução.

**Interfaces:**
- Consumes: Vitest da Task 2.
- Produces: proteção automatizada contra contexto ausente ou cruzamento indevido entre condomínios.

- [ ] **Step 1: Localizar o menor helper existente** que resolve ou valida o condomínio/empresa ativo.
- [ ] **Step 2: Escrever teste falhando** para contexto ausente, condomínio correto e tentativa de usar entidade pertencente a outro condomínio.
- [ ] **Step 3: Executar somente o teste novo** e confirmar a falha esperada.
- [ ] **Step 4: Aplicar a mudança mínima no helper existente** para tornar o contrato explícito, sem alterar UI não relacionada.
- [ ] **Step 5: Executar o teste novo e `npm run verify`**; ambos devem passar.
- [ ] **Step 6: Commit** `test: protect condominium isolation contract`.

### Task 4: Converter uma verificação de patch em teste de regressão

**Files:**
- Create: `tests/regression/dashboard-premium.test.ts`
- Read-only reference: `scripts/verify-dashboard-premium.mjs`
- Modify only if justified by test: módulo de dashboard coberto pela verificação existente.

**Interfaces:**
- Consumes: suíte Vitest e comportamento atualmente protegido por `verify-dashboard-premium.mjs`.
- Produces: pelo menos uma regra comportamental do dashboard protegida por teste executável, não apenas por inspeção de patch.

- [ ] **Step 1: Ler `verify-dashboard-premium.mjs`** e identificar uma regra observável e estável do dashboard.
- [ ] **Step 2: Reescrever essa regra como teste Vitest falhando ou como teste de regressão que demonstra o comportamento atual esperado.
- [ ] **Step 3: Fazer somente a alteração mínima necessária** caso o teste revele divergência real.
- [ ] **Step 4: Executar `npm run verify`** e confirmar PASS.
- [ ] **Step 5: Manter o script legado enquanto ainda cobrir regras não migradas**; não removê-lo nesta tarefa.
- [ ] **Step 6: Commit** `test: migrate first condo patch check to regression test`.

### Task 5: CI de qualidade

**Files:**
- Create: `.github/workflows/engineering-quality.yml`

**Interfaces:**
- Consumes: `npm run verify` das Tasks 2-4.
- Produces: verificação automática em pull requests e pushes relevantes.

- [ ] **Step 1: Criar workflow** com checkout, setup Node, instalação limpa e `npm run verify`.
- [ ] **Step 2: Configurar `pull_request` e pushes da branch de integração** sem deploy ou escrita em produção.
- [ ] **Step 3: Validar o YAML** e garantir que falha de teste interrompe o job antes do build ser considerado aprovado.
- [ ] **Step 4: Commit** `ci: add condo engineering quality gate`.

### Task 6: Handoff e Teach da implantação

**Files:**
- Create: `docs/handoffs/2026-10-02-engineering-skills-pipeline.md`
- Create: `docs/architecture/engineering-workflow.md`

**Interfaces:**
- Consumes: resultado das Tasks 1-5.
- Produces: contexto reutilizável e documentação operacional do novo processo.

- [ ] **Step 1: Preencher Handoff real** com commits, arquivos, testes, riscos, scripts legados ainda necessários e próximas áreas candidatas a TDD.
- [ ] **Step 2: Criar documentação Teach** explicando o fluxo e as diferenças entre patch de build, teste de regressão e regra de domínio.
- [ ] **Step 3: Executar `npm run verify` novamente** e registrar o resultado.
- [ ] **Step 4: Commit** `docs: hand off and teach condo engineering workflow`.

## Self-review

- Cobertura da spec: as quatro skills aparecem como processo explícito e reutilizável.
- A suíte de testes nasce antes de qualquer expansão de TDD.
- O build e seus patches são preservados enquanto forem necessários.
- O primeiro contrato de domínio prioriza isolamento entre condomínios.
- A migração de verificações legadas é incremental, não uma reescrita arriscada.
