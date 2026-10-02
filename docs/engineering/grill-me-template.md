# Grill-me — PEM Condomínios

Use antes de mudanças relevantes para fechar requisitos antes do código.

## Contexto
- Qual problema concreto será resolvido?
- Quem é o ator principal: síndico, administrador, funcionário, morador, prestador ou outro?
- Qual condomínio/empresa é dono dos dados?
- A unidade/bloco participa da regra?

## Permissões e isolamento
- Quais papéis podem visualizar, criar, alterar, aprovar ou excluir?
- O que deve acontecer quando um usuário tenta acessar dados de outro condomínio?
- A proteção existe também no banco/RLS ou apenas na interface?

## Estados e exceções
- Quais estados existem antes, durante e depois da ação?
- O que acontece com dados ausentes, duplicados, inválidos ou já processados?
- A operação precisa ser idempotente? Qual chave impede duplicidade?

## Pagamentos e reservas
- Existe cobrança, recibo, reserva, solicitação ou conciliação envolvida?
- Como cancelamento, duplicidade, atraso e confirmação são tratados?

## Privacidade
- Há dados pessoais, documentos, contatos, acessos ou informações financeiras?
- O que pode aparecer em logs, telas, notificações e comprovantes?

## Critérios de aceite
- Liste comportamentos observáveis, inclusive casos negativos.
- Defina quais testes automatizados provarão esses comportamentos.
- Defina o que explicitamente fica fora do escopo.
