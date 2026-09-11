# Deploy

## Render — aplicação integrada

Use Node 22+.

- Build command: `npm install`
- Start command: `npm run dev`
- Health check: `/health/ready`
- Environment: `NODE_ENV=production`, `MONGODB_URI=<secret>`, `MONGODB_DB_NAME=KZTechSite`.

O processo Node serve simultaneamente os arquivos estáticos e a API. Assim, formulários e autenticação usam a mesma origem.

## GitHub Pages

O workflow `.github/workflows/ci.yml` publica a árvore estática do branch `site`. Ele não fornece o backend MongoDB; para os fluxos de conta, contato e proposta, use a implantação integrada no Render ou configure uma API pública compatível.
