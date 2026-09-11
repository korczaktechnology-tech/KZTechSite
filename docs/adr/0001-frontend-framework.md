# ADR 0001 — Framework do frontend

## Status

Pendente de decisão na etapa de Design System.

## Contexto

A arquitetura exige uma camada de frontend reutilizável, roteamento central, separação entre apresentação e acesso a dados, cliente de API, respostas tipadas quando aplicável, lazy loading, boundary de erro e página 404.

A especificação recomenda registrar a escolha do framework como uma decisão arquitetural, mas não fixa um framework específico.

## Decisão nesta etapa

Não congelar um framework por inferência. A fundação mantém a fronteira `apps/web` independente para que a escolha seja feita antes da implementação do Design System.

## Consequência

A Etapa 1 permanece executável como base técnica, enquanto a decisão definitiva de framework fica registrada e explícita, sem criar uma dependência não determinada pela arquitetura.
