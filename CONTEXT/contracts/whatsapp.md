# Contrato: WhatsApp

- **Versão:** 0.1.0
- **Status:** DRAFT (aprovação em TASK-0001)

## Entrada
evento inbound {message_id, from, type, body, ts}; outbound {to, template|text}

## Saída
ack 200 rápido; outbound {message_id, status}

## Erros
invalid_signature, rate_limited, window_expired(24h → usar template)

## Permissões
Assinatura do provedor verificada; mapeamento número→tenant no backend

## Idempotência
Deduplicar por message_id

## Regras
Consentimento/opt-out respeitado (LGPD). Mídia tratada como dado não confiável.

## Histórico
- 0.1.0 — rascunho inicial.
