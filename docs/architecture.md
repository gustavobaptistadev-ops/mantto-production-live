# Arquitetura — MANTTO AI COMMERCE

Este documento consolida a arquitetura canônica do sistema e mapeia os contratos detalhados disponíveis em `CONTEXT/architecture/`.

## 1. Visão Geral da Stack
- **Backend (`apps/api`):** Python 3.12, FastAPI, Pydantic v2, SQLAlchemy 2 (assíncrono), Alembic.
- **Frontend (`apps/web`):** Next.js 14 (App Router), React, TypeScript, Tailwind CSS.
- **Bancos de Dados & Filas:** PostgreSQL (nuvem Render) / SQLite (`mantto_dev.db` para desenvolvimento local ágil), Redis para caching de sessões.
- **Integração de IA:** Abstração OpenAI-compatible (`ManttoLLMClient`) integrada a modelos como Groq / OpenAI / DeepSeek.
- **Mensageria & VTON:** Meta WhatsApp Cloud API v21.0 com webhooks assíncronos e processamento de imagens para Virtual Try-On.

## 2. Princípios de Engenharia
1. **SOLID Enxuto & Pragmático (ADR-0004):** Módulos divididos por domínio (`models`, `schemas`, `router`, `service`). Sem abstrações desnecessárias.
2. **Backend como Fonte da Verdade:** A IA recomenda e conversa, mas regras financeiras, estoque e pedidos residem exclusivamente no backend.
3. **Budget de Tokens & Zero Loops:** Regras rígidas de prompt para agentes em `AI_RULES.md`.
