@echo off
setlocal enabledelayedexpansion
title Poliedraw - Inicializador Zero-Friction

cd /d "%~dp0"

echo ========================================================
echo        POLIEDRAW - INICIALIZADOR ZERO-FRICTION (WINDOWS)
echo ========================================================
echo.

:: 1. Verificar se Node.js esta instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao foi encontrado no seu sistema!
    echo Baixe e instale o Node.js LTS em: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: 2. Instalar dependencias se a pasta node_modules nao existir
if not exist "node_modules\" (
    echo [Setup] Primeira execucao detectada. Instalando dependencias via npm...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERRO] Falha ao instalar dependencias com npm.
        pause
        exit /b 1
    )
)

:: 3. Criar arquivo .env se nao existir
if not exist ".env" (
    if exist ".env.example" (
        copy /y ".env.example" ".env" >nul
        echo [Config] Arquivo .env gerado automaticamente com padroes seguros.
    )
)

:: 4. Iniciar orquestrador da aplicacao
echo.
echo [Execucao] Iniciando Poliedraw (Banco, API e Frontend)...
node start.js

pause
