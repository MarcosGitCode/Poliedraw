# Poliedraw - Inicializador PowerShell para Windows
[CmdletBinding()]
param()

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $ScriptDir

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "       POLIEDRAW - INICIALIZADOR ZERO-FRICTION (WINDOWS)       " -ForegroundColor Yellow
Write-Host "========================================================`n" -ForegroundColor Cyan

# 1. Verificar instalação do Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERRO] Node.js não foi encontrado no sistema!" -ForegroundColor Red
    Write-Host "Por favor, instale o Node.js LTS em: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair..."
    exit 1
}

# 2. Instalar dependências se node_modules não existir
if (-not (Test-Path "$ScriptDir\node_modules")) {
    Write-Host "[Setup] Primeira execução detectada. Instalando dependências (npm install)..." -ForegroundColor Yellow
    & npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERRO] Falha ao executar npm install." -ForegroundColor Red
        exit 1
    }
}

# 3. Gerar arquivo .env se ausente
if (-not (Test-Path "$ScriptDir\.env")) {
    if (Test-Path "$ScriptDir\.env.example") {
        Copy-Item "$ScriptDir\.env.example" "$ScriptDir\.env"
        Write-Host "[Config] Arquivo .env gerado automaticamente a partir de .env.example." -ForegroundColor Green
    }
}

# 4. Iniciar aplicação
Write-Host "[Execução] Inicializando Poliedraw..." -ForegroundColor Green
& node "$ScriptDir\start.js"
