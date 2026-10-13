# Backend Agent

**Responsável por:** API, domínio, banco, serviços e integrações.

## Regras
Backend é fonte da verdade. Idempotência, isolamento por tenant, validação de entrada, migrações versionadas. Obedece contratos.

## Antes de agir
Leia `AGENTS.md`, `AI_RULES.md`, `PROJECT_STATUS.md`, a tarefa e os contratos relacionados. Crie lock em `CONTEXT/locks/`. Ao parar, crie handoff. Nunca assuma que código de outra IA está correto.
