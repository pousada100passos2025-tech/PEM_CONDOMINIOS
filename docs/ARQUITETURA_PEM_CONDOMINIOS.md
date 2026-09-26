# PEM Condomínios — arquitetura de adaptação

## Regra principal
O Professional Event Management original é somente fonte de referência. Nenhum arquivo, banco ou deploy do PEM Eventos deve ser alterado durante a adaptação do PEM Condomínios.

## Ambientes isolados
- Repositório: PEM_CONDOMINIOS
- Branch de transformação: pem-base-adaptacao
- Backup pré-transformação: backup-pre-clone-2026-09-26
- Supabase: projeto próprio do Condomínios
- Vercel: projeto próprio do Condomínios

## Fundação reaproveitada do PEM
- autenticação e recuperação de conta
- estrutura SaaS multiempresa
- perfis e permissões
- padrões de dashboard e navegação
- organização por módulos
- financeiro e cobranças como conceitos-base
- notificações e comunicação
- padrões de segurança e isolamento por empresa
- arquitetura responsiva

## Domínio condominial
1. Matriz SaaS
2. Empresas administradoras
3. Condomínios
4. Blocos / torres
5. Unidades / apartamentos / salas
6. Proprietários, inquilinos e moradores
7. Síndicos, subsíndicos, conselheiros e administradores
8. Veículos e pets
9. Financeiro condominial
10. Cobranças e inadimplência
11. Reservas de áreas comuns
12. Comunicados
13. Ocorrências e chamados
14. Documentos
15. Planos por quantidade de condomínios

## Identidade
- Grafite profundo
- Dourado fosco
- Branco quente
- Azul-petróleo discreto
- Marca pública: PEM Condomínios
- Assinatura: Professional Event Management

## Regra de acesso
A matriz administra empresas e planos. Cada empresa administra os condomínios contratados no plano. O síndico administra apenas os condomínios aos quais foi explicitamente vinculado. Moradores e responsáveis de unidade devem permanecer restritos aos dados autorizados da própria unidade/condomínio.
