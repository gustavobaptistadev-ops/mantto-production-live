# Contrato: Ferramentas de IA

- **Versão:** 0.1.0
- **Status:** DRAFT (aprovação em TASK-0001)

## Entrada
tool_name + args validados por JSON Schema; contexto {tenant_id, conversation_id} injetado pelo backend (nunca pelo LLM)

## Saída
{ok, data|error} serializável e sem credenciais

## Erros
unknown_tool, schema_violation, forbidden, rate_limited, backend_error

## Permissões
Allowlist por agente: search_products, check_stock, create_order, create_payment_link, get_order_status, quote_shipping, handoff_to_human

## Idempotência
Tools mutáveis exigem idempotency key gerada pelo backend

## Regras
Toda chamada auditada. tenant_id nunca vem dos argumentos do LLM. Cada tool crítica tem testes.

## Histórico
- 0.1.0 — rascunho inicial.
