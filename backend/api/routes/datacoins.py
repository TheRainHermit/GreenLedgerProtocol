"""
📊 DataCoins Routes - Endpoints para manejo de métricas ambientales
"""

from fastapi import APIRouter, HTTPException, File, UploadFile, Form
from typing import List, Dict, Any, Optional
import logging
from pydantic import BaseModel
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from services.lighthouse_service import LighthouseService, DataCoin

logger = logging.getLogger(__name__)
router = APIRouter()

# Inicializar servicio
lighthouse_service = LighthouseService()

class DataCoinUploadRequest(BaseModel):
    """Request para subir Data Coin"""
    company_id: str
    metric_type: str
    value: float
    unit: str
    timestamp: str

class DataCoinResponse(BaseModel):
    """Response de Data Coin"""
    success: bool
    lighthouse_hash: Optional[str] = None
    ipfs_url: Optional[str] = None
    error: Optional[str] = None

@router.post("/upload", response_model=DataCoinResponse)
async def upload_datacoin(request: DataCoinUploadRequest):
    """
    📤 Sube una métrica ambiental como Data Coin a Lighthouse
    
    - **company_id**: Identificador único de la empresa
    - **metric_type**: Tipo de métrica (energy_consumption, carbon_emissions, etc.)
    - **value**: Valor numérico de la métrica
    - **unit**: Unidad de medida (kwh, kg_co2, etc.)
    - **timestamp**: Fecha y hora de la medición (ISO 8601)
    """
    try:
        logger.info(f"📊 Subiendo Data Coin: {request.metric_type} para {request.company_id}")
        
        # Crear Data Coin
        datacoin = DataCoin(
            company_id=request.company_id,
            metric_type=request.metric_type,
            value=request.value,
            unit=request.unit,
            timestamp=request.timestamp
        )
        
        # Subir a Lighthouse
        result = await lighthouse_service.upload_datacoin(datacoin)
        
        if result["success"]:
            # Enviar notificación de confirmación
            from services.notification_service import NotificationService
            notification_service = NotificationService()
            await notification_service.send_datacoin_confirmation(
                request.company_id,
                request.metric_type,
                result["lighthouse_hash"]
            )
            
            return DataCoinResponse(
                success=True,
                lighthouse_hash=result["lighthouse_hash"],
                ipfs_url=result["ipfs_url"]
            )
        else:
            raise HTTPException(status_code=400, detail=result["error"])
            
    except Exception as e:
        logger.error(f"❌ Error subiendo Data Coin: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/company/{company_id}")
async def get_company_datacoins(company_id: str, limit: int = 50):
    """
    📋 Obtiene todos los Data Coins de una empresa específica
    
    - **company_id**: ID de la empresa
    - **limit**: Número máximo de resultados (default: 50)
    """
    try:
        logger.info(f"📋 Obteniendo Data Coins para empresa: {company_id}")
        
        datacoins = await lighthouse_service.list_company_datacoins(company_id)
        
        return {
            "success": True,
            "company_id": company_id,
            "total_datacoins": len(datacoins),
            "datacoins": datacoins[:limit]
        }
        
    except Exception as e:
        logger.error(f"❌ Error obteniendo Data Coins: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/hash/{lighthouse_hash}")
async def get_datacoin_by_hash(lighthouse_hash: str):
    """
    🔍 Obtiene un Data Coin específico usando su hash de Lighthouse
    
    - **lighthouse_hash**: Hash único del Data Coin en Lighthouse
    """
    try:
        logger.info(f"🔍 Obteniendo Data Coin por hash: {lighthouse_hash}")
        
        result = await lighthouse_service.get_datacoin(lighthouse_hash)
        
        if result["success"]:
            return {
                "success": True,
                "lighthouse_hash": lighthouse_hash,
                "data": result["data"]
            }
        else:
            raise HTTPException(status_code=404, detail="Data Coin no encontrado")
            
    except Exception as e:
        logger.error(f"❌ Error obteniendo Data Coin: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify/{lighthouse_hash}")
async def verify_datacoin(lighthouse_hash: str):
    """
    ✅ Verifica la integridad de un Data Coin
    
    - **lighthouse_hash**: Hash del Data Coin a verificar
    """
    try:
        logger.info(f"✅ Verificando Data Coin: {lighthouse_hash}")
        
        result = await lighthouse_service.verify_datacoin(lighthouse_hash)
        
        return {
            "success": result["success"],
            "hash": lighthouse_hash,
            "verified": result.get("verified", False),
            "timestamp": "2024-10-11T12:00:00Z"
        }
        
    except Exception as e:
        logger.error(f"❌ Error verificando Data Coin: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/metrics/types")
async def get_metric_types():
    """
    📊 Obtiene la lista de tipos de métricas soportadas
    """
    metric_types = [
        {
            "type": "energy_consumption",
            "name": "Consumo de Energía",
            "units": ["kwh", "mwh", "joules"],
            "description": "Consumo total de energía del período"
        },
        {
            "type": "carbon_emissions",
            "name": "Emisiones de Carbono",
            "units": ["kg_co2", "tons_co2"],
            "description": "Emisiones de CO2 equivalente"
        },
        {
            "type": "water_usage",
            "name": "Uso de Agua",
            "units": ["liters", "m3", "gallons"],
            "description": "Consumo total de agua"
        },
        {
            "type": "waste_generation",
            "name": "Generación de Residuos",
            "units": ["kg", "tons"],
            "description": "Residuos generados en el período"
        },
        {
            "type": "renewable_energy_percentage",
            "name": "Porcentaje de Energía Renovable",
            "units": ["percentage"],
            "description": "Porcentaje de energía proveniente de fuentes renovables"
        },
        {
            "type": "recycling_rate",
            "name": "Tasa de Reciclaje",
            "units": ["percentage"],
            "description": "Porcentaje de materiales reciclados"
        }
    ]
    
    return {
        "success": True,
        "metric_types": metric_types
    }

@router.get("/stats/global")
async def get_global_datacoin_stats():
    """
    📈 Obtiene estadísticas globales de Data Coins en el sistema
    """
    try:
        # En implementación real, consultar base de datos para estadísticas reales
        stats = {
            "total_datacoins": 15847,
            "total_companies": 156,
            "most_common_metrics": [
                {"type": "carbon_emissions", "count": 4521},
                {"type": "energy_consumption", "count": 3892},
                {"type": "water_usage", "count": 2934}
            ],
            "daily_uploads": 127,
            "weekly_uploads": 892,
            "monthly_uploads": 3456,
            "verification_rate": 98.7,
            "last_updated": "2024-10-11T12:00:00Z"
        }
        
        return {
            "success": True,
            "stats": stats
        }
        
    except Exception as e:
        logger.error(f"❌ Error obteniendo estadísticas: {e}")
        raise HTTPException(status_code=500, detail=str(e))