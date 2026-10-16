# Onboarding — MANTTO AI COMMERCE

Guia rápido para desenvolvedores e agentes de IA iniciarem no repositório.

## 1. Pré-requisitos
- **SO:** Windows 10/11 ou Linux.
- **Python:** 3.12+ (localizado preferencialmente em `D:\DEV\tools\Python312` ou PATH global).
- **Node.js:** 20.x ou superior.

## 2. Inicialização Rápida
### Backend
```powershell
cd apps/api
.\.venv\Scripts\python.exe -m uvicorn mantto_api.main:app --port 8000 --reload
```
Acesse a documentação Swagger em: `http://localhost:8000/docs`

### Frontend
```powershell
cd apps/web
npm install
npm run dev
```
Acesse a aplicação em: `http://localhost:3000`

## 3. Ordem Obrigatória de Leitura para IAs
1. `AGENTS.md`
2. `PRODUCT.md`
3. `AI_RULES.md`
4. `docs/architecture.md`
