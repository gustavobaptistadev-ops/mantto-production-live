# Contrato: Pedidos

- **Versão:** 0.1.0
- **Status:** DRAFT (aprovação em TASK-0001)

## Entrada
customer_ref, items[{sku, qty}], shipping_address, channel

## Saída
order {id, status, items, totals, payment_status}

## Erros
validation_error, insufficient_stock, invalid_transition, forbidden

## Permissões
orders:read, orders:write; IA: create_order e consulta do próprio cliente

## Idempotência
Idempotency-Key obrigatório na criação

## Regras
Estados: draft→pending_payment→paid→fulfilled→delivered|cancelled. Totais calculados no backend.

## Histórico
- 0.1.0 — rascunho inicial.
