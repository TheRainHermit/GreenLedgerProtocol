#!/usr/bin/env python3
"""
🚀 Script de arranque para GreenLedger Protocol Backend
"""

import os
import sys

# Agregar el directorio backend al path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

if __name__ == "__main__":
    import uvicorn
    from api.server import app
    
    # Configuración del servidor
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", 8000))
    debug = os.getenv("DEBUG", "True").lower() == "true"
    
    print("🌿 Iniciando GreenLedger Protocol Backend...")
    print(f"📡 Servidor: http://{host}:{port}")
    print(f"📖 Documentación: http://{host}:{port}/docs")
    
    uvicorn.run(
        app,
        host=host,
        port=port,
        reload=debug,
        log_level="info"
    )