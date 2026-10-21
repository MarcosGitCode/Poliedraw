#!/usr/bin/env bash
set -e

# Garante posicionamento no diretório do projeto
cd "$(dirname "$0")"

echo "📦 Verificando dependências do projeto..."
if [ ! -d "node_modules" ]; then
    echo "⚡ node_modules ausente. Executando npm install..."
    npm install
fi

echo "🚀 Disparando Poliedraw Zero-Friction..."
node start.js
