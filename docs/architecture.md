# Arquitetura — Korczak Technologies Site

## Estado

As cinco etapas planejadas foram implementadas progressivamente na `main`: fundação, design system/navegação, frontend institucional/portfólio, API/persistência e qualidade/operação.

## Estrutura

- `apps/web`: React/Vite, rotas institucionais, catálogo, formulários e estados de interface.
- `apps/api`: API Node.js, validação, MongoDB, health checks e contratos de resposta.
- `packages/shared`: contratos compartilhados entre camadas.
- `docs`: arquitetura, deploy, backup e decisões.
- `.github/workflows`: CI.

## Ambientes

- `development`: execução local e dados de teste.
- `staging`: homologação próxima de produção.
- `production`: dados reais e regras máximas de segurança.

Cada ambiente deve possuir configuração própria. Segredos nunca entram no repositório.

## Princípios obrigatórios

1. O frontend nunca acessa MongoDB diretamente.
2. A API é a fronteira para autenticação, autorização, formulários e persistência.
3. A conexão MongoDB é reutilizada pelo backend, não criada por requisição.
4. Respostas seguem `success/data/error/requestId`.
5. A interface não deve possuir ações decorativas: ações precisam de destino e estados apropriados.
6. Conteúdo KOS e produtos independentes permanece separado.
7. `main` representa a linha de produção.

## Produção

A API oferece `/health`, `/health/live` e `/health/ready`. O último valida a disponibilidade do MongoDB quando configurado. O CI executa build, lint/sintaxe e testes. A interface possui foco acessível, estados de envio e suporte a redução de movimento.

## Pendências explícitas

Autenticação completa de usuários, recuperação de senha, área autenticada, gestão de perfil e administração de contatos/orçamentos permanecem como evolução da camada comercial. Não são simuladas como concluídas.
