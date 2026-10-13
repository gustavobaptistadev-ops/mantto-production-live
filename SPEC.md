# SPEC — MANTTO AI COMMERCE (v0.1, rascunho)

## Visão
Plataforma multi-tenant em que lojistas vendem via WhatsApp/web com agentes de IA que atendem, vendem e operam, sempre apoiados por um backend determinístico.

## Atores
Lojista (admin), operador, cliente final, agentes de IA, sistemas externos (WhatsApp, gateway de pagamento, transportadoras).

## Capacidades
1. Catálogo e estoque
2. Conversas de venda (WhatsApp) com IA
3. Pedidos e pagamentos
4. Frete e logística
5. Suporte pós-venda
6. Analytics
7. Dashboard de operação

## Requisitos não funcionais
- Isolamento total entre tenants
- Idempotência em operações críticas (pedido, pagamento, estoque, webhooks)
- LGPD: minimização, consentimento, direito de exclusão
- Observabilidade: logs estruturados, trace de cada tool call da IA
- Auditoria de ações de IA

## Invariantes (não negociáveis)
- IA nunca inventa preço, estoque, prazo ou política.
- Pagamento e estoque só confirmados pelo backend.
- Credenciais jamais chegam ao LLM.

## Fora de escopo (por ora)
Marketplace multi-vendedor, app mobile nativo.

## Perguntas em aberto
Gateway de pagamento, provedor de LLM, provedor WhatsApp (API oficial vs BSP) → registrar ADRs futuros.
