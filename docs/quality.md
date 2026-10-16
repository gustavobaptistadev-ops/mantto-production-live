# Qualidade & Validação — MANTTO AI COMMERCE

Critérios e comandos de validação para garantir a integridade dos contratos e código.

## 1. Comandos Canônicos de Validação

### Backend (Testes & Linter)
```powershell
cd apps/api
.\.venv\Scripts\python -m pytest
```

### Frontend (Typecheck & Build)
```powershell
cd apps/web
npm run build
```

## 2. Invariantes Inegociáveis
- **Zero Alucinação de Preços e Estoque:** Testes de integração devem garantir que valores venham do banco de dados.
- **Isolamento Multi-tenant:** Toda query deve respeitar o tenant ativo.
- **Tratamento de Exceções:** Erros de webhook do WhatsApp ou chamadas externas de LLM nunca devem derrubar a aplicação.
