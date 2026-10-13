# HANDOFF - 2026-10-08 - Orders TDD (TASK-0006)

## O que foi feito
1. Analisamos o gargalo com o binário `initdb.exe` do PostgreSQL e redigimos o **ADR-0005**, decidindo por usar SQLite para desenvolvimento local e TDD, mantendo Postgres para Produção.
2. Atualizamos `database.py` e `env.py` (Alembic) para processar dinamicamente conexões do SQLite.
3. Instalamos `aiosqlite` e `greenlet` no ambiente para habilitar queries assíncronas do SQLAlchemy com SQLite.
4. Iniciamos o desenvolvimento orientado a testes (TDD) para o módulo de Pedidos (**TASK-0006**).
5. Criamos:
   - `tests/test_orders.py` com o contrato esperado na API de Orders (usando `httpx.AsyncClient`).
   - Models em SQLAlchemy (`Order`, `OrderItem`).
   - Router (FastAPI) e Schemas (Pydantic) em `apps/api/mantto_api/modules/orders`.
6. Geramos e executamos a migration de pedidos no Alembic local (`6ba38ba9832b`).

## O que não foi feito
- Refinamento do webhook de pagamentos (TASK-0007).
- A correção do fixture de `test_orders.py` está pendente (falhou no `pytest` por erro do novo `pytest-asyncio` ao declarar fixture async).

## Arquivos alterados
- `CONTEXT/decisions/ADR-0005.md`
- `apps/api/mantto_api/config.py` e `database.py`
- `apps/api/alembic/env.py` e migrations
- `apps/api/mantto_api/modules/orders/*`
- `apps/api/tests/test_orders.py`

## Falhas (Gargalos atuais)
- Teste falhando no setup: `'test_create_order' requested an async fixture 'async_client'`. Requer mudança de `@pytest.fixture` para `@pytest_asyncio.fixture` em `test_orders.py`.

## Próxima ação
- Corrigir a declaração da fixture em `test_orders.py`.
- Fazer a lógica de criação de pedidos no Router passar com asserts verdes (TDD).
- Avançar para TDD da TASK-0007 (Pagamentos e Webhooks).
