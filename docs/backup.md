# Backup e recuperação

A arquitetura exige política de backup do MongoDB, separação do backup de produção, retenção definida e testes periódicos de restauração.

## Regra operacional

Backup que nunca foi restaurado em teste não deve ser considerado garantia de recuperação.

## Preparação

- definir responsável pela recuperação;
- documentar procedimento de restauração;
- registrar incidentes;
- manter configuração reproduzível em código;
- definir objetivo de recuperação conforme criticidade.

A configuração real de backup será concluída quando a persistência MongoDB for implementada.
