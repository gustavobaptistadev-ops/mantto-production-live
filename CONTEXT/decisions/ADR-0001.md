# ADR-0001 — Monólito modular, backend como fonte da verdade, IA via Tool Layer

## Status
PROPOSED (aceitar em TASK-0001)

## Contexto
Projeto novo, repositório vazio, múltiplas IAs desenvolvendo. Precisa de arquitetura simples, testável e segura.

## Problema
Como estruturar o sistema para permitir evolução por várias IAs sem violar segurança, com agentes de IA que não podem inventar dados nem confirmar pagamento/estoque.

## Alternativas
1. Microserviços desde o início — complexidade operacional alta.
2. Monólito modular (módulos com fronteiras e contratos) — simples, extraível depois.
3. IA com acesso direto ao banco — rejeitada (viola AI_RULES 2).

## Decisão
- Monólito modular em TypeScript (API) + Next.js (dashboard) + PostgreSQL multi-tenant.
- IA só interage por Tool Layer com allowlist, schema, auditoria, tenant injetado pelo backend.
- Pagamento e estoque confirmados exclusivamente pelo backend.
- Contexto do projeto vive no repositório (AGENTS.md + CONTEXT/).

## Consequências
+ Menor custo inicial, fronteiras claras para extração futura.
+ Segurança por construção.
- Disciplina de módulos necessária (lint de fronteiras).
- Stack específica (framework da API, ORM) fica para ADR-0002 (TASK-0002).