$ErrorActionPreference = "Stop"

$root = Resolve-Path "$PSScriptRoot\..\.."
Set-Location "$root\apps\web"

if (-Not (Test-Path "node_modules")) {
    Write-Host "Instalando pacotes do frontend..." -ForegroundColor Cyan
    npm install
}

Write-Host "Iniciando Next.js Dev Server..." -ForegroundColor Green
npm run dev
