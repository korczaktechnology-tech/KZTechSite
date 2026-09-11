# Korczak Technologies — Site

Site institucional e comercial da Korczak Technologies.

## Estado

Etapas 1–5 implementadas na `main`, com fundação técnica, design system, navegação, frontend institucional, catálogo, API, persistência MongoDB, integração de contato, health checks, acessibilidade e preparação operacional.

## Estrutura

```text
apps/
  web/        aplicação React/Vite institucional
  api/        API Node.js para regras e persistência
packages/
  shared/     contratos compartilhados
docs/         arquitetura, deploy e operação
.github/      automações de CI
```

## Execução local

Requer Node.js 22 ou superior.

```bash
npm install
npm run dev
npm run dev:api
```

A web usa a porta `5173` e a API usa a porta `4000` por padrão.

## Configuração

Copie `.env.example` para `.env` e configure, quando necessário:

- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `VITE_API_BASE_URL`
- `PUBLIC_SITE_URL`
- `JWT_SECRET` quando a autenticação for habilitada

Nunca publique segredos no repositório.

## API

- `GET /health` — saúde geral
- `GET /health/live` — processo vivo
- `GET /health/ready` — prontidão, incluindo MongoDB configurado
- `GET /api/v1/health/database` — teste de conexão com banco
- `POST /api/v1/contacts` — recebe contatos
- `POST /api/v1/quotes` — recebe solicitações comerciais

Todas as respostas usam `success`, `data` ou `error` e `requestId`.

## Qualidade

O CI executa instalação de dependências, build, validação de sintaxe e testes em pushes para `main` e pull requests. O frontend possui estados de carregamento, sucesso e erro no contato, foco acessível, navegação responsiva e suporte a `prefers-reduced-motion`.

## Segurança operacional

MongoDB é acessado exclusivamente pela API. Entradas públicas são limitadas e validadas. Respostas de erro não expõem detalhes internos. Segredos devem permanecer em variáveis de ambiente do ambiente de execução.

## Arquitetura

A implementação segue a especificação do projeto: separação Web/API, MongoDB atrás do backend, contratos compartilhados, ambientes development/staging/production, Git/GitHub, GitHub Actions, Render e preparação para evolução comercial e integração futura.
