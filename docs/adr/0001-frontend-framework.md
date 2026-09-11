# ADR 0001 — Framework do frontend

## Status

Aceito na Etapa 2.

## Contexto

A arquitetura exige uma camada de frontend reutilizavel, roteamento central, separacao entre apresentacao e acesso a dados, cliente de API, respostas tipadas quando aplicavel, lazy loading, boundary de erro e pagina 404.

A especificacao nao fixa um framework especifico. A decisao precisa ser registrada para evitar uma escolha implicita durante a implementacao.

## Decisao

Adotar **React + Vite** para `apps/web`.

- React fornece a camada de componentes reutilizaveis necessaria ao Design System.
- Vite fornece desenvolvimento local e build de producao simples e rapido.
- React Router fornece roteamento centralizado para as rotas canonicas.
- A aplicacao continua isolada em `apps/web`, sem acesso direto ao MongoDB.
- A camada de API permanece em `apps/api` e sera integrada em etapa posterior.

## Consequencias

A partir desta decisao, novos componentes visuais, layouts e rotas do site devem ser implementados sobre React. A Etapa 2 cria somente a fundacao visual e de navegacao; autenticacao, persistencia, formularios conectados, integracoes e demais comportamentos de negocio permanecem para as etapas previstas na arquitetura.
