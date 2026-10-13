# Gerencia PostgreSQL e Redis nativos (portáteis, em D:). Uso: services.ps1 init|start|stop|status
param([Parameter(Mandatory)][ValidateSet('init','start','stop','status')][string]$Action)
$ErrorActionPreference = 'Stop'
$root = Resolve-Path "$PSScriptRoot\..\.."
$pgBin = 'D:\DEV\tools\postgres\pgsql\bin'
$pgData = 'D:\DEV\mantto-data\postgres'
$redisDir = Get-ChildItem 'D:\DEV\tools\redis' -Filter redis-server.exe -Recurse | Select-Object -First 1 | Split-Path
$env:TEMP = 'D:\DEV\mantto-cache\tmp'; $env:TMP = $env:TEMP

function Get-DbPassword {
  $envFile = "$root\.env"
  $line = Select-String -Path $envFile -Pattern '^DB_PASSWORD=(.+)$' -ErrorAction SilentlyContinue
  if ($line) { return $line.Matches[0].Groups[1].Value }
  $pw = -join ((48..57 + 65..90 + 97..122) | Get-Random -Count 24 | ForEach-Object { [char]$_ })
  Add-Content $envFile "DB_PASSWORD=$pw"
  return $pw
}

switch ($Action) {
  'init' {
    if (-not (Test-Path "$root\.env")) { Copy-Item "$root\.env.example" "$root\.env" }
    if (-not (Test-Path "$pgData\PG_VERSION")) {
      $pw = Get-DbPassword
      $pwFile = "D:\DEV\mantto-cache\tmp\pgpw.txt"; Set-Content $pwFile $pw -NoNewline
      & "$pgBin\initdb.exe" -D $pgData -U mantto --pwfile=$pwFile -A scram-sha-256 -E UTF8
      Remove-Item $pwFile
    }
    & "$PSScriptRoot\services.ps1" start
    $env:PGPASSWORD = Get-DbPassword
    $exists = & "$pgBin\psql.exe" -U mantto -h localhost -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='mantto'"
    if (-not $exists) { & "$pgBin\createdb.exe" -U mantto -h localhost mantto }
    Write-Host 'Banco mantto pronto.'
  }
  'start' {
    & "$pgBin\pg_ctl.exe" status -D $pgData *> $null
    if ($LASTEXITCODE -ne 0) { & "$pgBin\pg_ctl.exe" start -D $pgData -l 'D:\DEV\mantto-data\postgres.log' -w }
    if (-not (Get-Process redis-server -ErrorAction SilentlyContinue)) {
      Start-Process "$redisDir\redis-server.exe" -ArgumentList '--bind 127.0.0.1 --dir D:\DEV\mantto-data' -WindowStyle Hidden
    }
  }
  'stop' {
    & "$pgBin\pg_ctl.exe" stop -D $pgData -m fast
    Get-Process redis-server -ErrorAction SilentlyContinue | Stop-Process
  }
  'status' {
    & "$pgBin\pg_ctl.exe" status -D $pgData
    if (Get-Process redis-server -ErrorAction SilentlyContinue) { 'redis: running' } else { 'redis: stopped' }
  }
}
