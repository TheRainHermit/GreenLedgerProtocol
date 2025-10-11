#!/bin/bash
# Script de inicio para GreenLedger Protocol Backend

echo "🌿 GreenLedger Protocol - Script de Inicio"
echo "=========================================="

# Verificar si estamos en el directorio correcto
if [ ! -f "simple_server.py" ]; then
    echo "❌ Error: No se encuentra simple_server.py"
    echo "   Ejecuta este script desde el directorio backend/"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creando entorno virtual..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔄 Activando entorno virtual..."
source venv/bin/activate

# Install/update dependencies if needed
if [ -f "requirements.txt" ]; then
    echo "📋 Verificando dependencias..."
    pip install -r requirements.txt > /dev/null 2>&1
fi
    exit 1
fi

# Verificar Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 no está instalado"
    exit 1
fi

# Detener servidor anterior si existe
echo "🔄 Deteniendo servidores anteriores..."
pkill -f "simple_server.py" 2>/dev/null || true
sleep 2

# Iniciar servidor
echo "🚀 Iniciando servidor GreenLedger..."
python3 simple_server.py &
SERVER_PID=$!

# Esperar a que el servidor esté listo
echo "⏳ Esperando que el servidor esté listo..."
sleep 3

# Verificar que el servidor funciona
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ ¡Servidor iniciado correctamente!"
    echo ""
    echo "📡 URLs disponibles:"
    echo "   🌐 Interfaz Web:    http://localhost:8000"
    echo "   ❤️  Health Check:   http://localhost:8000/health"
    echo "   🏆 Leaderboard:     http://localhost:8000/api/v1/rewards/leaderboard"
    echo "   📊 EcoScores:       http://localhost:8000/api/v1/scores/empresa_verde_1"
    echo ""
    echo "⏹️  Para detener: kill $SERVER_PID"
    echo "📝 Log del servidor en: server.log"
    echo ""
    echo "🎯 Presiona Enter para abrir la interfaz web..."
    read
    
    # Intentar abrir en navegador (si está disponible)
    if command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:8000
    elif command -v open &> /dev/null; then
        open http://localhost:8000
    else
        echo "💡 Abre manualmente: http://localhost:8000"
    fi
else
    echo "❌ Error: El servidor no pudo iniciarse"
    echo "📝 Revisa el log en server.log"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi