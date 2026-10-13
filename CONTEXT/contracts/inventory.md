# Contrato: Estoque

- **Versão:** 0.1.0
- **Status:** DRAFT (aprovação em TASK-0001)

## Entrada
sku, quantity_delta|reservation {order_id, qty, ttl}

## Saída
stock {sku, on_hand, reserved, available}

## Erros
insufficient_stock, not_found, reservation_expired, forbidden

## Permissões
inventory:read, inventory:write; IA: leitura (check_stock)

## Idempotência
Reserva idempotente por (order_id, sku)

## Regras
Nunca negativo, mesmo sob concorrência (lock/CHECK). Só backend confirma disponibilidade.

## Histórico
- 0.1.0 — rascunho inicial.
