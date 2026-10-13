# BACKLOG

Estados: `TODO` ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· `IN_PROGRESS` ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· `BLOCKED` ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· `REVIEW` ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· `DONE`.
Nenhuma IA cria tarefa fora do backlog sem registrar decisÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o (ADR).

---
## EPIC E0 ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â FundaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de contexto
### TASK-0001 ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Aprovar SPEC, contratos v0.1 e ADR-0001
- **DescriÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o:** Architect e Reviewer revisam documentos criados na fase 1.
- **Prioridade:** P0 ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· **DependÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncias:** ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â
- **Arquivos esperados:** `SPEC.md`, `CONTEXT/contracts/*`, `CONTEXT/decisions/ADR-0001.md`
- **CritÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©rios de aceite:** ADR-0001 com status `ACCEPTED`; contratos em v1.0; `check-context.sh` passa.
- **Testes:** `scripts/check-context.sh`
- **Status:** TODO
  - SUBTASK 0001.a ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â RevisÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o do Architect
  - SUBTASK 0001.b ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â RevisÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o do Security

### TASK-0002 ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Bootstrap do monorepo e comandos
- **DescriÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o:** Status: DONE - Criar estrutura (apps/web, apps/api, packages), lint, typecheck, test, Docker compose (Postgres), CI.
- **Prioridade:** P0 ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· **DependÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncias:** TASK-0001
- **Arquivos esperados:** `package.json`, `apps/*`, `docker-compose.yml`, `.github/workflows/ci.yml`
- **CritÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©rios de aceite:** `install/lint/typecheck/test` rodam verdes; comandos registrados em `AGENTS.md`.
- **Testes:** smoke test da API (`/health`)
- **Status:** TODO

---
## EPIC E1 ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â NÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºcleo de domÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­nio (backend)
### TASK-0003 ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Multi-tenant + auth + autorizaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o
- **DependÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncias:** TASK-0002 ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· **Prioridade:** P0
- **Arquivos esperados:** mÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³dulo `auth`, `tenants`, migraÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âµes
- **CritÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©rios de aceite:** toda query filtrada por tenant; testes de isolamento entre tenants.
- **Testes:** unit + integraÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de isolamento
- **Status:** TODO

### TASK-0004 ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â CatÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡logo de produtos (contrato products)
- **DependÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncias:** TASK-0003 ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· **Prioridade:** P0
- **CritÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©rios de aceite:** CRUD conforme `products.md`; testes de contrato.
- **Status:** TODO

### TASK-0005 ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Estoque (contrato inventory)
- **DependÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncias:** TASK-0004 ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· **Prioridade:** P0
- **CritÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©rios de aceite:** reserva idempotente, sem estoque negativo sob concorrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia.
- **Status:** TODO

### TASK-0006 ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Pedidos (contrato orders)
- **DependÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncias:** TASK-0005 ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· **Prioridade:** P0
- **Status:** TODO

### TASK-0007 ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Pagamentos e webhooks (payments, webhooks)
- **DependÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncias:** TASK-0006 ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· **Prioridade:** P0
- **CritÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©rios de aceite:** confirmaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o sÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³ via webhook verificado; idempotÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncia.
- **Status:** TODO

---
## EPIC E2 ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â IA e canais
### TASK-0008 ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Camada de ferramentas de IA (ai-tools)
- **DependÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncias:** TASK-0004, TASK-0005, TASK-0006 ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· **Prioridade:** P0
- **CritÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©rios de aceite:** allowlist de tools, validaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o de schema, testes de prompt injection.
- **Status:** TODO

### TASK-0009 ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â IntegraÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o WhatsApp (whatsapp)
- **DependÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncias:** TASK-0008 ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· **Prioridade:** P1
- **Status:** TODO

### TASK-0010 ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Frete (shipping)
- **DependÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncias:** TASK-0006 ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· **Prioridade:** P1
- **Status:** TODO

---
## EPIC E3 ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Dashboard
### TASK-0011 ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Dashboard Next.js (catÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡logo, pedidos, conversas)
- **DependÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªncias:** TASK-0004, TASK-0006 ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· **Prioridade:** P1
- **Status:** TODO
