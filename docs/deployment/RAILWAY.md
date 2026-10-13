# Deploy no Railway (Guia Oficial Mantto)

O **Railway** é atualmente a melhor e mais rápida plataforma em nuvem para hospedar stacks modernas (FastAPI + Next.js + Postgres), pois ele elimina a necessidade de configurar Docker e gerencia monorepos nativamente.

## Arquitetura no Railway
Nosso projeto será dividido em 4 "Serviços" dentro de um único "Project" no Railway:
1. **PostgreSQL** (Banco de dados de Produção)
2. **Redis** (Gerenciador de Filas e Webhooks)
3. **Backend API (FastAPI)**
4. **Frontend Web (Next.js)**

---

## Passo a Passo para Hospedagem

### Passo 1: Subir o código para o GitHub
O Railway puxa o código direto do GitHub.
1. Crie um repositório no GitHub.
2. Faça o push de toda a pasta `mantto`.

### Passo 2: Criar os Bancos de Dados
1. No dashboard do Railway, clique em **New Project** > **Deploy from GitHub repo** (Selecione o repositório do Mantto).
2. Clique em **New** > **Database** > **Add PostgreSQL**.
3. Clique em **New** > **Database** > **Add Redis**.

### Passo 3: Configurar a API (Backend)
1. Clique em **New** > **GitHub Repo** > Selecione o `mantto` novamente.
2. Vá nas **Settings** deste serviço:
   - **Root Directory:** Digite `/apps/api`.
   - O Railway vai identificar automaticamente que é Python e instalar o `requirements.txt`.
3. Vá em **Variables** e adicione:
   - `DATABASE_URL`: `${{Postgres.DATABASE_URL}}` (O Railway preenche automático).
   - `REDIS_URL`: `${{Redis.REDIS_URL}}`
   - `LLM_BASE_URL`: `https://api.freeapi.local/v1` (ou a URL do modelo que escolhemos).
   - `LLM_API_KEY`: sua-chave
4. Vá em **Settings** > **Custom Start Command**:
   - `uvicorn mantto_api.main:app --host 0.0.0.0 --port $PORT`

### Passo 4: Configurar o Dashboard (Frontend)
1. Clique em **New** > **GitHub Repo** > Selecione o `mantto`.
2. Vá nas **Settings** deste novo serviço:
   - **Root Directory:** Digite `/apps/web`.
   - O Railway vai identificar automaticamente que é Next.js, rodar `npm run build` e `npm start`.
3. Vá em **Networking** e clique em **Generate Domain**. Ele criará uma URL pública (ex: `mantto-dashboard.up.railway.app`).

### Passo 5: Atualizar o Webhook do WhatsApp
Vá no Meta for Developers e troque a URL antiga do nosso túnel temporário (`pinggy`) pela nova URL gerada pelo Railway (ex: `https://api-mantto.up.railway.app/whatsapp/webhook`).

## Vantagens dessa abordagem:
- **Zero Configuração de Servidor:** Não precisamos de NGINX ou Linux cru.
- **CI/CD Automático:** Cada vez que você alterar o código da IA, o Railway atualiza sozinho em 1 minuto.
- **Escalabilidade:** Se o WhatsApp bombar de clientes na Black Friday, basta arrastar uma barra no Railway para dar mais memória à IA.
