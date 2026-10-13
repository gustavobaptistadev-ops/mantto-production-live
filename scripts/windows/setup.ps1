# Prepara ambiente de desenvolvimento. Tudo em D: (ADR-0003).
$ErrorActionPreference = 'Stop'
$root = Resolve-Path "$PSScriptRoot\..\.."
$env:PIP_CACHE_DIR = 'D:\DEV\mantto-cache\pip'
$env:TEMP = 'D:\DEV\mantto-cache\tmp'; $env:TMP = $env:TEMP
New-Item -ItemType Directory -Force $env:PIP_CACHE_DIR, $env:TEMP, 'D:\DEV\mantto-data' | Out-Null
Set-Location "$root\apps\api"
if (-not (Test-Path .venv)) { python -m venv .venv }
.\.venv\Scripts\python -m pip install -e ".[dev]"
if (-not (Test-Path "$root\.env")) { Copy-Item "$root\.env.example" "$root\.env"; Write-Host "Criado .env - ajuste os segredos." }
Write-Host "OK. Postgres e Redis nativos: instalar em D: (ver docs/operations/RUNBOOK.md)."
