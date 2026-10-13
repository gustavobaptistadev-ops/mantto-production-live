# Inicia a API em modo dev.
$root = Resolve-Path "$PSScriptRoot\..\.."
Set-Location "$root\apps\api"
.\.venv\Scripts\python -m uvicorn mantto_api.main:app --reload --port 8000
