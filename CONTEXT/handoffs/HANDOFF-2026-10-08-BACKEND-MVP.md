# HANDOFF - 2026-10-08 - Finalização do MVP Backend

## O que foi feito
1. Correção do TDD da TASK-0006 (Orders): resolvemos a issue de eager loading (`MissingGreenlet` exception) no SQLAlchemy utilizando `.options(selectinload(...))` nas chamadas de select assíncrono.
2. Implementação da TASK-0007 (Payments & Webhooks):
   - Criação dos models `Payment` e `WebhookEvent`.
   - Adicionada rota de POST `/webhooks/provider` com verificação de idempotência (via `event_id`).
   - TDD de idempotência em `test_payments.py` (rodando o mesmo evento duas vezes retornando OK na segunda sem duplicar processamento).
3. Implementação da TASK-0004 e TASK-0005 (Catalog & Inventory):
   - Criação de Rotas para criar Produto + Variações + Inventário integrado.
   - Adicionada rota de leitura de estoque por SKU (`/catalog/inventory/{sku}`).
   - TDD `test_catalog.py` escrito para validar a criação de produtos e checagem de inventário, usando UUIDs randômicos no SKU para evitar colisões no banco de testes.
4. Finalização da Base de Dados de testes: Migration única gerada e aplicada contendo todas as tabelas (Tenants, Products, Variants, Inventory, Orders, OrderItems, Payments, Webhooks).
5. Passamos todo o suite de testes de integração (`pytest -v`), totalizando 8 testes **PASSED**.
6. Estado do projeto movido de FOUNDATION para **MVP**.

## O que não foi feito
- Frontend (Next.js).
- Integração real com LLM e as instâncias finais dos Agentes (que consultarão essas APIs).
- Validação HMAC real nos webhooks (atualmente em mock para TDD).

## Arquivos alterados
- `apps/api/tests/test_orders.py`, `test_payments.py`, `test_catalog.py`
- `apps/api/mantto_api/modules/orders/router.py` (add selectinload)
- `apps/api/mantto_api/modules/payments/models.py`, `router.py`
- `apps/api/mantto_api/modules/catalog/router.py`
- `apps/api/mantto_api/main.py`
- `apps/api/alembic/versions/*`
- `PROJECT_STATUS.md` e `BACKLOG.md`

## Falhas (Gargalos atuais)
- Nenhuma falha atual! Todos os testes rodando com 100% de sucesso.

## Próxima ação
- Iniciar o scaffold da aplicação Web (Next.js) em `apps/web` (TASK-0008).
- Implementar as ferramentas (tools) para integração com IA consumindo esses endpoints recém-criados.
