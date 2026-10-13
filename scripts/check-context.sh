#!/usr/bin/env bash
# Valida o sistema de contexto.
cd "$(dirname "$0")/.."
err=0
fail() { echo "ERRO: $*"; err=1; }

# 1. arquivos obrigatórios
for f in AGENTS.md CLAUDE.md CONTRIBUTING.md PROJECT_STATUS.md DEFINITION_OF_DONE.md BACKLOG.md SPEC.md \
  ARCHITECTURE.md CHANGELOG.md SECURITY.md AI_RULES.md scripts/build-context.sh scripts/check-context.sh \
  AGENTS/sales-agent.md AGENTS/catalog-agent.md AGENTS/operations-agent.md AGENTS/support-agent.md \
  AGENTS/analytics-agent.md AGENTS/qa-agent.md AGENTS/security-agent.md AGENTS/devops-agent.md \
  AGENTS/architect-agent.md AGENTS/reviewer-agent.md AGENTS/backend-agent.md AGENTS/frontend-agent.md AGENTS/ai-agent.md \
  CONTEXT/decisions/ADR-0001.md; do
  [ -f "$f" ] || fail "arquivo obrigatório ausente: $f"
done
for d in architecture business domain ai integrations security database frontend backend operations \
  decisions tasks handoffs contracts locks checkpoints; do
  [ -d "CONTEXT/$d" ] || fail "diretório ausente: CONTEXT/$d"
done

# 2. contratos sem versão / documentação faltante
for c in products inventory orders payments shipping whatsapp ai-tools webhooks; do
  f="CONTEXT/contracts/$c.md"
  [ -f "$f" ] || { fail "contrato ausente: $f"; continue; }
  grep -qE '^- \*\*Versão:\*\* [0-9]+\.[0-9]+\.[0-9]+' "$f" || fail "contrato sem versão: $f"
  for s in "## Entrada" "## Saída" "## Erros" "## Permissões" "## Idempotência" "## Regras"; do
    grep -q "^$s" "$f" || fail "$f sem seção '$s'"
  done
done

# 3. tarefas sem critérios de aceite
for f in CONTEXT/tasks/TASK-[0-9]*.md; do
  [ -f "$f" ] || continue
  grep -q "^## Critérios de aceite" "$f" || fail "tarefa sem critérios de aceite: $f"
done

# 4. links markdown relativos quebrados
while IFS= read -r file; do
  dir=$(dirname "$file")
  grep -oE '\]\(([^)#]+)(#[^)]*)?\)' "$file" | sed -E 's/^\]\(([^)#]+).*/\1/' | while read -r link; do
    case "$link" in http*|mailto:*|/*) continue;; esac
    [ -e "$dir/$link" ] || echo "ERRO: link quebrado em $file -> $link"
  done
done < <(find . -name '*.md' -not -path './node_modules/*' -not -path './.git/*') | grep -q ERRO && { grep -q . /dev/null; err=1; }

# 5. ADRs com status
for f in CONTEXT/decisions/ADR-[0-9]*.md; do
  [ -f "$f" ] && { grep -q "^## Status" "$f" || fail "ADR sem status: $f"; }
done

if [ $err -eq 0 ]; then echo "OK: contexto válido"; else exit 1; fi
