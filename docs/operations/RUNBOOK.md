# Runbook Operacional

1. Inicializar banco e Redis: `scripts\windows\services.ps1 init`
2. Parar banco e Redis: `scripts\windows\services.ps1 stop`
3. Logs do banco: `D:\DEV\mantto-data\postgres.log`

Em caso de falha de conexão: verifique se o PostgreSQL não abortou devido a DLLs ausentes (`vcruntime140.dll` e afins do Visual C++ Redistributable).
