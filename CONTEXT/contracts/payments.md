# Contrato: Pagamentos

- **Versão:** 0.1.0
- **Status:** DRAFT (aprovação em TASK-0001)

## Entrada
order_id, method, amount (calculado no backend)

## Saída
payment {id, status, link|qr}

## Erros
provider_error, amount_mismatch, already_paid, forbidden

## Permissões
payments:write (sistema); IA só solicita link

## Idempotência
Idempotente por order_id; webhooks deduplicados por event_id

## Regras
SÓ webhook verificado confirma pagamento. IA nunca marca pago.

## Histórico
- 0.1.0 — rascunho inicial.
