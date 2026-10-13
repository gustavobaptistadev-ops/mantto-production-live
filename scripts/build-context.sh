#!/usr/bin/env bash
# Gera CONTEXT/generated/CURRENT_CONTEXT.md
set -euo pipefail
cd "$(dirname "$0")/.."
OUT="CONTEXT/generated/CURRENT_CONTEXT.md"
mkdir -p "$(dirname "$OUT")"

section() { # titulo arquivo
  [ -f "$2" ] || return 0
  printf '\n\n---\n## %s (`%s`)\n\n' "$1" "$2"
  cat "$2"
}

{
  echo "# CURRENT CONTEXT"
  echo "Gerado em: $(date -u +%Y-%m-%dT%H:%M:%SZ) — não editar."
  section "Regras do agente" AGENTS.md
  section "Regras de IA" AI_RULES.md
  section "Status" PROJECT_STATUS.md
  section "Arquitetura" ARCHITECTURE.md
  for f in CONTEXT/tasks/TASK-[0-9]*.md; do [ -f "$f" ] && section "Tarefa" "$f"; done
  for f in CONTEXT/decisions/ADR-[0-9]*.md; do [ -f "$f" ] && section "ADR" "$f"; done
  for f in CONTEXT/contracts/*.md; do section "Contrato" "$f"; done
  latest=$(ls -1 CONTEXT/handoffs/HANDOFF-2*.md 2>/dev/null | sort | tail -n 1 || true)
  if [ -n "${latest:-}" ]; then section "Handoff mais recente" "$latest"; else printf '\n\n---\n## Handoff mais recente\n\nNenhum handoff registrado.\n'; fi
} > "$OUT"

echo "Gerado: $OUT ($(wc -l < "$OUT") linhas)"
