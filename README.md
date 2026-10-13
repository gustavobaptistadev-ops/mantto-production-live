# Mantto AI Commerce

Plataforma de comércio assistido por IA (WhatsApp → venda → pagamento → expedição → pós-venda). O backend é a fonte da verdade; a IA só age por ferramentas autorizadas.

**Antes de editar qualquer coisa, leia [AGENTS.md](AGENTS.md).** Contexto persistente em [CONTEXT/](CONTEXT/README.md).

## Estado
Ver [PROJECT_STATUS.md](PROJECT_STATUS.md). Backlog em [BACKLOG.md](BACKLOG.md).

## Rodar a API (dev)
```powershell
cd apps/api
python -m venv .venv
.\.venv\Scripts\python -m pip install -e ".[dev]"
.\.venv\Scripts\python -m pytest
.\.venv\Scripts\python -m uvicorn mantto_api.main:app --reload
```
Endpoints: `/health`, `/ready`, `/metrics`.

## Ambiente nativo Windows (sem Docker, tudo em D:)
Ver [ADR-0003](CONTEXT/decisions/ADR-0003.md). `scripts/windows/setup.ps1` prepara o venv; `scripts/windows/start-api.ps1` inicia a API. PostgreSQL e Redis/Memurai nativos devem ser instalados em `D:\DEV\tools`.

## Docs
`docs/` (arquitetura, banco, segurança, IA, API, operação, deploy). Em construção; cada TASK atualiza a doc correspondente.
