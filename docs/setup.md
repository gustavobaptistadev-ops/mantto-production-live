# Setup do Ambiente & Produção — MANTTO AI COMMERCE

Instruções canônicas de configuração de ambiente local e nuvem.

## 1. Configuração Local
- As ferramentas e dependências devem preferencialmente residir no drive `D:\` (`D:\DEV\tools`).
- Caches de build: `D:\DEV\mantto-cache`.
- Banco de dados de desenvolvimento: SQLite local pré-configurado para agilidade sem dependência de containers.

## 2. Configuração de Nuvem (Render.com)
A aplicação é orquestrada pelo arquivo `render.yaml` na raiz do projeto contendo:
- **`mantto-postgres`:** Banco de dados relacional PostgreSQL gratuito.
- **`mantto-commerce-api`:** Serviço Web Python/FastAPI executando `alembic upgrade head` no build.
- **`mantto-commerce-web`:** Serviço Web Node.js/Next.js apontando via variável interna para a API.
