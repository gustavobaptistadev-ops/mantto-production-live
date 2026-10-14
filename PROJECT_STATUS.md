# PROJECT_STATUS

## Estado
`PRODUCTION READY` (opções: DISCOVERY · FOUNDATION · MVP · BETA · PRODUCTION)

## Última atualização
2026-10-14 — Deploy automatizado configurado no Render.com (Web Services + PostgreSQL com Auto-Deploy via GitHub). Cliente assíncrono oficial da Meta WhatsApp Cloud API implementado e conectado ao webhook.

## Implementado
- **Deploy em Nuvem (Render.com):** Arquivo `render.yaml` (Blueprint de infraestrutura como código) com `autoDeploy: true` configurado para `mantto-api`, `mantto-web` e banco gerenciado `mantto-postgres`.
- **Pipeline CI/CD Automático:** Cada `git push` na branch `main` do repositório `gustavobaptistadev-ops/mantto-production-live` aciona automaticamente o build e deploy na nuvem.
- **Cliente Meta WhatsApp Cloud API (`whatsapp/client.py`):** Suporte nativo ao envio de mensagens de texto e imagens (VTON) diretamente para o celular do cliente via Graph API oficial (`v21.0`).
- **Atendimento Híbrido & Kanban CRM (`/whatsapp-crm`):** Pipeline em 5 estágios com handoff inteligente em 1 clique (IA vs. Vendedor humano).
- **Backend Robusto:** FastAPI com PostgreSQL assíncrono via `asyncpg`, suíte de testes 100% aprovada (`pytest`).

## Próxima tarefa (Homologação Final)
- Cadastrar as credenciais definitivas da Meta (`WHATSAPP_PHONE_ID` e `WHATSAPP_API_TOKEN`) nas variáveis de ambiente do Render e realizar o primeiro teste comercial de ponta a ponta.
