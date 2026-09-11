# Arquitetura do site Korczak Technologies

## 1. Princípio

O site é uma aplicação institucional e comercial com frontend estático e backend separado logicamente. O frontend não acessa MongoDB. Toda persistência passa pela API.

## 2. Frontend

HTML5 semântico, CSS responsivo e JavaScript puro. Os arquivos são independentes de framework e usam caminhos relativos para funcionar tanto no GitHub Pages quanto em um servidor próprio.

Camadas:
- conteúdo e navegação em `index.html` e `pages/`;
- tokens, componentes visuais e responsividade em `assets/css/base.css`;
- comportamento global e formulários em `assets/js/main.js`.

## 3. Backend

`apps/api/src/server.mjs` usa Node.js e MongoDB. A mesma aplicação pode servir os arquivos estáticos e a API, eliminando o problema de CORS em produção.

Contrato de resposta:
`{ success: boolean, data?: object, error?: { code, message }, requestId: string }`.

Endpoints principais:
- `GET /health`, `/health/live`, `/health/ready`;
- `GET /api/v1/catalog`;
- `POST /api/v1/auth/register`;
- `POST /api/v1/auth/login`;
- `GET /api/v1/me`;
- `POST /api/v1/contacts`;
- `POST /api/v1/quotes`.

## 4. Segurança

Validação no servidor, limites de tamanho, rate limiting básico, hash de senha com `scrypt`, tokens de sessão armazenados como hash, índices MongoDB, cabeçalhos de segurança e respostas sem exposição de detalhes internos.

## 5. Domínios

O KOS é separado dos produtos independentes. O catálogo pode anunciar contratos e integrações futuras sem afirmar disponibilidade inexistente.

## 6. Operação

CI valida HTML, links locais e sintaxe do backend. A publicação estática usa GitHub Pages. Para um ambiente integrado, o Node pode servir o site e a API no mesmo processo.
