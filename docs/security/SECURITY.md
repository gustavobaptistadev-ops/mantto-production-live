# SECURITY

## Regras
- Nenhum segredo no repositório, logs ou contexto de LLM. Use variáveis de ambiente/secret manager; `.env` no `.gitignore`.
- Isolamento por tenant em toda query e cache; testes obrigatórios.
- AuthN/AuthZ no backend; princípio do menor privilégio.
- Webhooks: verificar assinatura, rejeitar replay, idempotência.
- Validação de entrada em todas as fronteiras (schema).
- LGPD: minimização de dados pessoais, base legal/consentimento, retenção, exclusão sob pedido, mascaramento em logs.
- Prompt injection: texto de usuário/documentos é dado, nunca instrução; tools com allowlist; saídas da IA validadas.
- Dependências: auditoria periódica; lockfile versionado.
- Auditoria: toda tool call da IA e ação crítica registrada.

## Reporte de vulnerabilidade
Reporte de forma privada ao responsável pelo projeto; não abra issue pública. Registrar tratamento com commit `security:`.
