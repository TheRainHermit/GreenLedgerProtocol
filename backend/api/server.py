#!/usr/bin/env python3
"""
🌿 GreenLedger Protocol - API Server
Servidor principal para el sistema de scoring de sostenibilidad
"""

import os
import uvicorn
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from dotenv import load_dotenv
import logging

# Importar servicios y rutas
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.lighthouse_service import LighthouseService
from services.reward_service import RewardService
from services.notification_service import NotificationService
from services.evvm_relayer import EVVMRelayer
from api.routes import datacoins, rewards, scores, wallet

# Cargar variables de entorno
load_dotenv()

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Crear aplicación FastAPI
app = FastAPI(
    title="🌿 GreenLedger Protocol API",
    description="Sistema de scoring de sostenibilidad con recompensas automatizadas",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción usar dominios específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar servicios
lighthouse_service = LighthouseService()
reward_service = RewardService()
notification_service = NotificationService()
evvm_relayer = EVVMRelayer()

# Incluir rutas
app.include_router(datacoins.router, prefix="/api/v1/datacoins", tags=["DataCoins"])
app.include_router(rewards.router, prefix="/api/v1/rewards", tags=["Rewards"])
app.include_router(scores.router, prefix="/api/v1/scores", tags=["Scores"])
app.include_router(wallet.router, prefix="/api/v1/wallet", tags=["Wallet"])

@app.get("/", response_class=HTMLResponse)
async def root():
    """Página principal con información del protocolo"""
    return """
    <html>
        <head>
            <title>🌿 GreenLedger Protocol</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #4CAF50, #2E7D32); color: white; padding: 20px; border-radius: 10px; }
                .endpoint { background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 5px; }
                .method { color: #4CAF50; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🌿 GreenLedger Protocol API</h1>
                <p>Sistema de scoring de sostenibilidad con recompensas automatizadas</p>
            </div>
            
            <h2>📊 Endpoints Disponibles</h2>
            
            <div class="endpoint">
                <span class="method">GET</span> <strong>/docs</strong> - Documentación interactiva (Swagger)
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span> <strong>/health</strong> - Estado del servidor
            </div>
            
            <div class="endpoint">
                <span class="method">POST</span> <strong>/api/v1/datacoins/upload</strong> - Subir métricas ambientales
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span> <strong>/api/v1/scores/{company_id}</strong> - Obtener EcoScore de empresa
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span> <strong>/api/v1/rewards/leaderboard</strong> - Ranking de empresas sostenibles
            </div>
            
            <div class="endpoint">
                <span class="method">POST</span> <strong>/api/v1/rewards/distribute</strong> - Distribuir recompensas PYUSD
            </div>
            
            <h2>🚀 Tecnologías</h2>
            <ul>
                <li><strong>Smart Contracts:</strong> Solidity, Hardhat</li>
                <li><strong>Pagos:</strong> PYUSD, EVVM</li>
                <li><strong>Almacenamiento:</strong> Lighthouse, Envio</li>
                <li><strong>Backend:</strong> Python, FastAPI</li>
                <li><strong>Oráculos:</strong> Pyth Network</li>
            </ul>
        </body>
    </html>
    """

@app.get("/health")
async def health_check():
    """Endpoint de salud del sistema"""
    try:
        # Verificar conexión a servicios críticos
        lighthouse_status = await lighthouse_service.check_health()
        reward_status = await reward_service.check_health()
        
        return {
            "status": "healthy",
            "version": "1.0.0",
            "services": {
                "lighthouse": lighthouse_status,
                "rewards": reward_status,
                "notifications": "active",
                "evvm_relayer": "active"
            },
            "timestamp": "2024-10-11T00:00:00Z"
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail="Service unhealthy")

@app.on_event("startup")
async def startup_event():
    """Inicialización al arrancar el servidor"""
    logger.info("🌿 Iniciando GreenLedger Protocol API...")
    logger.info(f"📝 Documentación disponible en: http://{os.getenv('API_HOST', 'localhost')}:{os.getenv('API_PORT', 8000)}/docs")

@app.on_event("shutdown")
async def shutdown_event():
    """Limpieza al cerrar el servidor"""
    logger.info("🔄 Cerrando GreenLedger Protocol API...")

if __name__ == "__main__":
    # Configuración del servidor
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", 8000))
    debug = os.getenv("DEBUG", "True").lower() == "true"
    
    uvicorn.run(
        "server:app",
        host=host,
        port=port,
        reload=debug,
        log_level="info"
    )