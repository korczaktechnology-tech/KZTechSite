# Korczak Technologies — Site

Site institucional e comercial da Korczak Technologies, construído para ser simples de operar, rápido, acessível e preparado para evolução.

## Arquitetura de produção

- **Frontend:** HTML5, CSS3 e JavaScript puro, sem React/Vite.
- **Backend:** Node.js HTTP API.
- **Dados:** MongoDB acessado exclusivamente pelo backend.
- **Contratos:** respostas no formato `{ success, data, error, requestId }`.
- **Conta:** cadastro, login por token de sessão, consulta de perfil e encerramento local de sessão.
- **Comercial:** contatos e solicitações de proposta persistidos.
- **Deploy completo recomendado:** Render executando `npm start`, servindo frontend e API no mesmo domínio.
- **GitHub Pages:** espelho estático para conteúdo público. GitHub Pages não executa o backend Node; formulários e conta devem usar a implantação completa no Render.
- **CI/CD:** GitHub Actions valida HTML, referências locais, âncoras, formulários, acessibilidade básica e sintaxe do backend antes da publicação estática.

## Desenvolvimento

```bash
npm install
npm run dev
```

Abra `http://localhost:4000`.

Variáveis principais: `MONGODB_URI`, `MONGODB_DB_NAME`, `PORT` e `CORS_ORIGINS`.

## Validação

```bash
npm run validate
npm run lint
```

## Produção

1. Configure `MONGODB_URI` e `MONGODB_DB_NAME` no ambiente do servidor.
2. Defina `CORS_ORIGINS` somente para origens externas que realmente precisem acessar a API.
3. Use o health check `/health` para disponibilidade e `/health/ready` para prontidão com banco.
4. Mantenha o MongoDB fora do frontend e nunca publique credenciais no repositório.
5. Use HTTPS no ambiente público e mantenha backups do MongoDB fora do processo de deploy.

## Estrutura

- `index.html` — entrada pública.
- `pages/` — páginas institucionais, catálogo, produtos, conta e jurídico.
- `assets/` — CSS e JavaScript compartilhados.
- `apps/api/` — API e persistência.
- `packages/shared/` — contratos compartilhados.
- `docs/` — arquitetura, deploy, backup e decisões.
