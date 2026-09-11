# Deploy

## Pipeline

A publicação deve seguir a ordem arquitetural:

1. Checkout.
2. Instalação determinística.
3. Lint.
4. Type check.
5. Testes unitários.
6. Testes de integração.
7. Build.
8. Testes E2E em ambiente apropriado.
9. Staging.
10. Homologação.
11. Production.
12. Smoke test.
13. Registro da versão.

Uma falha crítica interrompe a publicação.

## Ambientes

Use variáveis distintas para development, staging e production. Nunca coloque senha, token ou credencial no código.

## Infraestrutura prevista

A arquitetura prevê GitHub/GitHub Actions para código e automações e Render para serviços hospedados. CDN, e-mail e Stripe entram conforme necessidade das etapas posteriores.
