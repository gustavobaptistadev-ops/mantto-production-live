# HANDOFF - 2026-10-08 - AI Tools & Frontend Scaffold

## O que foi feito
1. Implementação da TASK-0009 (Abstração LLM / AI Tools no Backend):
   - Módulo criado em `apps/api/mantto_api/modules/ai_agent/`.
   - Adicionada leitura de variáveis de LLM no arquivo `config.py` (`llm_base_url`, `llm_api_key`, `llm_model`).
   - Construído client assíncrono padrão (`ManttoLLMClient`) utilizando o protocolo `v1/chat/completions` em `client.py`.
   - Criado registro de abstração de ferramentas (Tools) em `tools.py` para isolar a IA do banco de dados (ex.: a tool `check_inventory` executa a query e retorna dados formatados de forma segura).
   - Rota `/ai/chat` incluída em `router.py` para receber requisições de conversas e coordenar interações com LLM + Tools + LLM Final.
   - Criamos o `test_ai_agent.py` para testar o registro de funções localmente, com 100% de sucesso.
2. Implementação parcial da TASK-0008 (Frontend Scaffold):
   - Criada a estrutura de pastas do Next.js App Router em `apps/web/src/app`.
   - Gerados `package.json`, `layout.tsx` e `page.tsx` para garantir a espinha dorsal inicial. (As dependências podem ser instaladas diretamente via `npm install` sem sobrecarga no terminal da IA local).

## O que não foi feito
- Implementação de todas as Tools descritas nos Contratos de Agentes (apenas `check_inventory` foi feita como prova de conceito para validar a infraestrutura modular).
- Implementação dos fluxos de tela e design system do Frontend.

## Arquivos alterados
- `apps/api/tests/test_ai_agent.py`
- `apps/api/mantto_api/config.py` e `main.py`
- `apps/api/mantto_api/modules/ai_agent/*`
- `apps/web/*` (package.json, src/app/*)
- `PROJECT_STATUS.md` e `BACKLOG.md`

## Próxima ação
- Adicionar todas as demais ferramentas operacionais necessárias aos agentes IA (criação de pedido, check de preço, status de entrega).
- Criar e treinar os Agentes específicos listados no `/AGENTS/` (Sales, Support, Operations) associando os prompts especializados com a lista de Tools registrada.
- Construir os componentes visuais de retaguarda (Dashboard) em Next.js.
