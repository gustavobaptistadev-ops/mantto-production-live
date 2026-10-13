# Contrato: Webhooks

- **Versão:** 0.1.0
- **Status:** DRAFT (aprovação em TASK-0001)

## Entrada
payload do provedor + assinatura/headers

## Saída
2xx após persistir evento; processamento assíncrono

## Erros
invalid_signature, replay_detected, unknown_event

## Permissões
Endpoint público, autenticado por assinatura HMAC/segredo

## Idempotência
Dedup por event_id (tabela de eventos processados)

## Regras
Verificar assinatura antes de qualquer parse; retries seguros; eventos persistidos para auditoria.

## Histórico
- 0.1.0 — rascunho inicial.
