# Arquitetura — Fundação

Este repositório implementa a fundação do site institucional e comercial da Korczak Technologies conforme a arquitetura aprovada.

## Limites desta etapa

A Etapa 1 cria somente a base técnica. Conteúdo visual completo, design system, páginas, autenticação, persistência e fluxos comerciais entram nas etapas seguintes.

## Estrutura

- `apps/web`: aplicação Web institucional.
- `apps/api`: API responsável por autenticação, formulários e dados.
- `packages/shared`: contratos compartilhados entre camadas.
- `docs`: documentação de arquitetura, deploy, backup e decisões.

## Ambientes

- `development`: execução local e dados de teste.
- `staging`: ambiente de homologação semelhante à produção.
- `production`: dados reais e regras máximas de segurança.

Cada ambiente deve possuir configuração própria. Segredos nunca entram no repositório.

## Princípios

1. O frontend nunca acessa MongoDB diretamente.
2. A API será a fronteira para autenticação, autorização, formulários e persistência.
3. A conexão com MongoDB será criada de forma controlada pelo backend, não por requisição.
4. Respostas de API seguirão `success/data/error/requestId`.
5. O projeto deve evoluir com componentes reutilizáveis, sem criar microsserviços apenas por estética.
6. `main` é o branch de produção e deve receber código revisado.
