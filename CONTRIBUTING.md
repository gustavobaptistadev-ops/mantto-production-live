# CONTRIBUTING

Vale para humanos e IAs.

1. Leia `AGENTS.md`, `PROJECT_STATUS.md`, `ARCHITECTURE.md`.
2. Escolha tarefa do `BACKLOG.md` (status TODO, dependências satisfeitas). Crie `CONTEXT/tasks/TASK-XXXX.md` se complexa.
3. Crie lock em `CONTEXT/locks/` e branch `feature|fix|refactor/TASK-XXXX-desc`.
4. Siga o workflow: DISCOVER → READ CONTEXT → PLAN → IMPLEMENT → TEST → REVIEW → UPDATE CONTEXT → HANDOFF.
5. Commits semânticos pequenos: `feat: fix: refactor: test: docs: security: chore:`.
6. Atualize docs/contratos junto com o código.
7. Cumpra `DEFINITION_OF_DONE.md`; outro agente (Reviewer) aprova.
8. Libere o lock (`STATUS=RELEASED`) e crie handoff se necessário.

Nunca assuma que código de outra IA está correto. Nunca apague ADRs ou histórico Git.
