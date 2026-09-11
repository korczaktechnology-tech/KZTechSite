# Korczak Technologies — Site

Site institucional e comercial da Korczak Technologies.

## Estado

Etapa 1 — Fundação técnica.

## Estrutura

```text
apps/
  web/        aplicação web institucional
  api/        fronteira de API
packages/
  shared/     contratos compartilhados
docs/         arquitetura, deploy e operação
.github/      automações de CI
```

## Execução local

Requer Node.js 22 ou superior.

```bash
npm run dev
npm run dev:api
```

A web usa a porta `5173` e a API usa a porta `4000` por padrão.

## Configuração

Use `.env.example` como contrato de variáveis. Nunca publique segredos.

## Arquitetura

A fundação segue a especificação: Git/GitHub, GitHub Actions, ambientes development/staging/production, separação Web/API e preparação para MongoDB, e-mail e infraestrutura de produção.
