# PEM Condomínios Engineering Skills Pipeline Design

## Objetivo
Formalizar no PEM Condomínios um fluxo de engenharia repetível para Grill-me, TDD, Handoff e Teach, adaptado ao domínio condominial e à maturidade atual do repositório.

## Escopo
- Aplicar Grill-me antes de módulos e regras relevantes.
- Criar uma fundação real de testes automatizados e então aplicar TDD.
- Padronizar Handoff entre mudanças, ferramentas e sessões.
- Padronizar Teach para documentação técnica e operacional.

## Situação atual
O projeto possui build com uma sequência de scripts de patch e verificações pontuais, mas ainda não possui suíte formal de testes ou script `test`. A implantação deve começar pela fundação de testes e pela separação entre patch de build e verificação comportamental.

## Fluxo obrigatório
1. Grill-me / requisitos
2. Especificação curta da mudança
3. Plano de implementação quando multietapa
4. Teste automatizado que falha para o comportamento novo ou corrigido
5. Implementação mínima
6. Testes + build + verificações do projeto
7. Code review / verificação final
8. Handoff
9. Teach / atualização da documentação

## Prioridades de TDD
1. Isolamento entre condomínios / empresas
2. Autenticação e permissões
3. Cadastros principais
4. Recibos
5. Solicitação e reserva
6. Pagamentos
7. Dashboard e ações críticas
8. Fluxos de recuperação e salvamento atualmente cobertos por scripts de patch

## Handoff
Cada mudança relevante deve registrar:
- objetivo e contexto;
- decisões tomadas;
- arquivos alterados;
- banco / políticas / integrações afetadas;
- testes executados e resultado;
- riscos conhecidos;
- pendências;
- itens que não devem ser alterados na continuação.

## Teach
A documentação deve explicar arquitetura, domínio condominial, permissões, fluxos principais e operação dos módulos para que outra pessoa consiga continuar o trabalho sem depender do histórico de conversa.

## Restrições
- Não criar funcionalidades de usuário final chamadas Grill-me, TDD, Handoff ou Teach.
- Não copiar regras do PEM de eventos para o Condomínios.
- Não considerar scripts de patch como substitutos permanentes de testes comportamentais.
- Não alterar produção diretamente durante a implantação desse processo.

## Critérios de sucesso
- Existe uma suíte de testes invocável por script próprio.
- Mudanças relevantes começam por requisitos explícitos.
- Fluxos críticos passam a ganhar testes de regressão incrementalmente.
- Cada entrega importante deixa handoff reutilizável.
- A documentação técnica acompanha mudanças relevantes.
