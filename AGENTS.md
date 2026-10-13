# AGENTS.md — Leia PRIMEIRO

> **NUNCA edite código importante antes de ler este arquivo.**
> O repositório é a memória persistente do projeto. Não dependa do histórico de conversa.

## 1. Objetivo
**MANTTO AI COMMERCE**: plataforma de comércio com agentes de IA (vendas, catálogo, operações, suporte, analytics) integrada a WhatsApp, pagamentos e logística. A IA conversa e orquestra; **o backend é a fonte da verdade** (preço, estoque, pagamento, pedidos).

## 2. Stack (ver ADR-0002 e ADR-0003)
- Backend: Python 3.12, FastAPI, Pydantic v2, SQLAlchemy 2, Alembic (`apps/api`)
- Frontend: Next.js + TypeScript (`apps/web`, a criar)
- Banco: PostgreSQL; Cache/filas: Redis (nativos Windows)
- IA: abstração LLM OpenAI-compatible (`LLM_BASE_URL/LLM_API_KEY/LLM_MODEL`)
- **Sem Docker.** Execução nativa no Windows. **Toda instalação/cache deve ficar no drive D:** (ferramentas `D:\DEV\tools`, caches `D:\DEV\mantto-cache`).
> Estado: FOUNDATION; skeleton da API existe. Ver `PROJECT_STATUS.md`.

## 2.1 Estilo de arquitetura (ADR-0004)
SOLID enxuto e pragmático: módulos por domínio (models/schemas/service/router), routers finos, regras no service, interfaces (Protocol) só nas fronteiras externas (pagamento, frete, WhatsApp, LLM). Sem camadas ou abstrações sem uso atual.

## 3. Ordem de leitura mínima
`AGENTS.md` → `AI_RULES.md` → `PROJECT_STATUS.md` → `ARCHITECTURE.md` → tarefa em `CONTEXT/tasks/` → contratos relacionados.
Pack gerado: `scripts/build-context.sh` → `CONTEXT/generated/CURRENT_CONTEXT.md`.

## 4. Hierarquia de contexto (em conflito, vale a ordem)
1. AGENTS.md 2. Regras de segurança (`SECURITY.md`, `AI_RULES.md`) 3. `SPEC.md` 4. Contratos 5. ADRs 6. Arquitetura 7. Tarefa atual 8. Código existente.
Regra específica complementa a geral, **nunca** viola segurança ou contratos.

## 5. Estrutura
```
AGENTS.md CLAUDE.md CONTRIBUTING.md PROJECT_STATUS.md DEFINITION_OF_DONE.md
BACKLOG.md SPEC.md ARCHITECTURE.md CHANGELOG.md SECURITY.md AI_RULES.md
AGENTS/      papéis especializados
CONTEXT/     architecture business domain ai integrations security database
             frontend backend operations decisions tasks handoffs contracts
             locks checkpoints generated
scripts/     build-context.sh, check-context.sh
```

## 6. Comandos
- `bash scripts/build-context.sh` — gera contexto atual
- `bash scripts/check-context.sh` — valida estrutura/documentação
- `powershell scripts/windows/setup.ps1` — venv + dependências (em D:)
- `cd apps/api; .\.venv\Scripts\python -m pytest` / `ruff check .` / `mypy` — testes, lint, typecheck
- `powershell scripts/windows/start-api.ps1` — API dev

## 7. Testes
Testes são contratos executáveis. Regra descoberta → documentar → teste → implementar. Ferramentas críticas de IA exigem testes.

## 8. Segurança (resumo; detalhes em `SECURITY.md`)
Sem segredos no repo/contexto LLM; isolamento por tenant; validação no backend; LGPD; defesa contra prompt injection.

## 9. Regras de IA
Ver `AI_RULES.md` (10 regras obrigatórias).

## 10. Git
Branches: `feature/TASK-XXXX-desc`, `fix/…`, `refactor/…`. Commits pequenos e semânticos (`feat fix refactor test docs security chore`). Nunca apagar histórico.

## 11. Workflow
DISCOVER → READ CONTEXT → PLAN → IMPLEMENT → TEST → REVIEW → UPDATE CONTEXT → HANDOFF. Antes de codar responda: contexto? contrato? arquitetura? arquivos afetados? dependências? ADR? risco? Faltou informação: **não invente** — procure; se não existe, crie uma decisão (ADR).

## 12. Tarefas, locks e conflitos
- Só trabalhe em tarefas do `BACKLOG.md`; fora dele, registre ADR.
- Antes de editar um módulo, crie lock em `CONTEXT/locks/` (ou use branch/worktree).
- Código contradiz a doc? **Não sobrescreva**: registre ADR (divergência, atual, esperado, proposta, impacto).

## 13. Definition of Done
Ver `DEFINITION_OF_DONE.md`.

## 14. Atualizar contexto
Ao alterar API, banco, contrato, integração ou comportamento: atualize docs. Atualize `PROJECT_STATUS.md` em mudanças significativas, crie handoff ao parar e checkpoint após grandes etapas.

## 15. Finalização de tarefa
Resumo · arquivos alterados · testes · riscos · docs atualizadas · próximo passo (+ handoff).
