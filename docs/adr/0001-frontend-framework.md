# ADR 0001 — Frontend sem framework

## Status
Aceito.

## Contexto
O site precisa ser leve, portável, simples de publicar e fácil de manter, sem transformar uma presença institucional em uma dependência desnecessária de framework.

## Decisão
O frontend será HTML5 + CSS3 + JavaScript puro. O backend permanece Node.js e MongoDB.

## Consequências
**Positivas:** menor superfície de dependências, publicação direta, carregamento simples, URLs estáticas e manutenção acessível.

**Negativas:** recursos complexos precisam ser implementados explicitamente; não há roteamento SPA ou componentes React prontos.

## Escopo
Esta decisão não impede que produtos independentes da Korczak Technologies usem stacks diferentes. Ela se aplica ao site institucional/comercial deste repositório.
