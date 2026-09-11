# Korczak Technologies — Site

Site institucional e comercial da Korczak Technologies.

## Arquitetura

- **Frontend:** HTML5, CSS3 e JavaScript puro, sem React/Vite.
- **Backend:** Node.js HTTP API.
- **Dados:** MongoDB acessado exclusivamente pelo backend.
- **Contratos:** respostas no formato `{ success, data, error, requestId }`.
- **Conta:** cadastro, login por token de sessão e consulta de perfil.
- **Comercial:** contatos e solicitações de proposta persistidos.
- **Entrega:** GitHub Actions + GitHub Pages para conteúdo estático; o servidor Node também pode servir frontend e API no mesmo domínio (recomendado para produção).

## Desenvolvimento

```bash
npm install
npm run dev:api
```

Abra `http://localhost:4000`.

Variáveis principais: `MONGODB_URI`, `MONGODB_DB_NAME` e `PORT`.

## Validação

```bash
node scripts/validate-static.mjs
node --check apps/api/src/server.mjs
```

## Estrutura

- `index.html` — entrada pública.
- `pages/` — páginas institucionais, catálogo, produtos, conta e jurídico.
- `assets/` — CSS e JavaScript compartilhados.
- `apps/api/` — API e persistência.
- `packages/shared/` — contratos compartilhados.
- `docs/` — arquitetura, deploy, backup e decisões.
