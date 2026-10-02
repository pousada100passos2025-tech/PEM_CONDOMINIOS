# Teach — PEM Condomínios

A documentação Teach existe para que outra pessoa consiga entender e continuar o PEM Condomínios sem depender do histórico de conversa.

## O que documentar
- Arquitetura e responsabilidade dos módulos envolvidos.
- Fluxo de dados do início ao fim.
- Papéis, permissões e limites de acesso.
- Regras de isolamento entre condomínios, empresas, blocos e unidades quando aplicável.
- Fluxos de cadastro, recibos, reservas, solicitações e pagamentos.
- Integrações externas e seus pontos de falha.
- Operação normal, estados intermediários e recuperação de erro.
- Testes que protegem o comportamento e como executá-los.

## Como escrever
- Explique a regra condominial antes do detalhe técnico.
- Use nomes reais de arquivos, tabelas, funções e comandos quando forem estáveis.
- Diferencie claramente patch de build, teste de regressão e regra de domínio.
- Registre decisões importantes e restrições, não o histórico inteiro da conversa.
- Não copiar regras do PEM de eventos apenas por semelhança de nomes.
- Não registrar segredos, tokens, credenciais ou dados pessoais.

## Atualização obrigatória
Atualize Teach quando uma mudança alterar arquitetura, permissões, isolamento, pagamentos, reservas, integrações ou operação de um fluxo crítico.
