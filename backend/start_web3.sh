#!/bin/bash

# GreenLedger Web3 Setup Script
echo "🌿 GreenLedger - Configuración con Web3"
echo "======================================"

# Intentar instalar web3 en entorno virtual
if [ ! -d "venv" ]; then
    echo "📦 Creando entorno virtual..."
    python3 -m venv venv 2>/dev/null || {
        echo "❌ Error creando entorno virtual"
        echo "📋 Usando instalación global con --break-system-packages"
        pip install web3 --break-system-packages --quiet
        echo "✅ Web3 instalado globalmente"
        python3 simple_server.py
        exit 0
    }
fi

echo "🔄 Configurando entorno virtual..."
# Usar el Python real del sistema para activar el venv
/usr/bin/python3 -m venv venv --clear

# Verificar y usar pip del venv
if [ -f "venv/bin/pip" ]; then
    echo "📋 Instalando web3 en entorno virtual..."
    venv/bin/pip install web3 --quiet
    echo "✅ Web3 instalado en venv"
    echo "🚀 Iniciando servidor..."
    venv/bin/python simple_server.py
else
    echo "⚠️ Problema con entorno virtual, usando instalación global..."
    pip install web3 --break-system-packages --quiet
    echo "✅ Web3 instalado globalmente"
    python3 simple_server.py
fi