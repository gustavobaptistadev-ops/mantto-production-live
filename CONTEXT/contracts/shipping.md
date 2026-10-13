# Contrato: Frete

- **Versão:** 0.1.0
- **Status:** DRAFT (aprovação em TASK-0001)

## Entrada
cep_origem/destino, items (peso/dimensões)

## Saída
quotes[{carrier, price, eta_days}], tracking {code, events}

## Erros
invalid_cep, no_quote, provider_error

## Permissões
shipping:read/write

## Idempotência
Cotação cacheável; criação de etiqueta idempotente por order_id

## Regras
Prazo/preço vêm do provedor; IA não estima.

## Histórico
- 0.1.0 — rascunho inicial.
