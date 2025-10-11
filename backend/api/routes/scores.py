"""
📊 Scores Routes - Endpoints para cálculo y consulta de EcoScores
"""

from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any, Optional
import logging
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter()

class ScoreCalculationRequest(BaseModel):
    """Request para cálculo de EcoScore"""
    company_id: str
    datacoins: List[Dict[str, Any]]
    
class ScoreUpdateRequest(BaseModel):
    """Request para actualizar score manualmente"""
    company_id: str
    new_score: float
    reason: str

@router.get("/{company_id}")
async def get_company_score(company_id: str):
    """
    📊 Obtiene el EcoScore actual de una empresa
    
    - **company_id**: Identificador único de la empresa
    """
    try:
        logger.info(f"📊 Obteniendo EcoScore para empresa: {company_id}")
        
        # En implementación real, consultar smart contract ScoreCalculator
        score_data = await _get_mock_company_score(company_id)
        
        return {
            "success": True,
            "company_id": company_id,
            "current_score": score_data["current_score"],
            "previous_score": score_data["previous_score"],
            "score_change": score_data["score_change"],
            "ranking_position": score_data["ranking_position"],
            "total_companies": score_data["total_companies"],
            "last_updated": score_data["last_updated"],
            "score_breakdown": score_data["score_breakdown"]
        }
        
    except Exception as e:
        logger.error(f"❌ Error obteniendo EcoScore: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/calculate/{company_id}")
async def calculate_company_score(company_id: str, request: ScoreCalculationRequest):
    """
    🧮 Calcula el EcoScore de una empresa basado en sus Data Coins
    
    - **company_id**: ID de la empresa
    - **datacoins**: Lista de Data Coins para el cálculo
    """
    try:
        logger.info(f"🧮 Calculando EcoScore para empresa: {company_id}")
        
        # Algoritmo de cálculo de EcoScore (simplificado)
        score = await _calculate_eco_score(request.datacoins)
        
        # En implementación real, actualizar smart contract
        result = await _update_score_on_chain(company_id, score)
        
        # Enviar notificación si hay cambio significativo
        from services.notification_service import NotificationService
        notification_service = NotificationService()
        
        previous_score = 85.0  # En implementación real, obtener score anterior
        if abs(score - previous_score) >= 5.0:
            await notification_service.send_score_update_notification(
                company_id, score, previous_score
            )
        
        return {
            "success": True,
            "company_id": company_id,
            "calculated_score": score,
            "previous_score": previous_score,
            "score_change": score - previous_score,
            "calculation_method": "weighted_average",
            "datacoins_processed": len(request.datacoins),
            "calculated_at": "2024-10-11T12:00:00Z",
            "on_chain_updated": result["success"]
        }
        
    except Exception as e:
        logger.error(f"❌ Error calculando EcoScore: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{company_id}/history")
async def get_score_history(company_id: str, limit: int = 30):
    """
    📈 Obtiene historial de EcoScores de una empresa
    
    - **company_id**: ID de la empresa
    - **limit**: Número de registros históricos (default: 30)
    """
    try:
        logger.info(f"📈 Obteniendo historial de EcoScore para {company_id}")
        
        history = await _get_mock_score_history(company_id, limit)
        
        return {
            "success": True,
            "company_id": company_id,
            "total_records": len(history),
            "score_history": history
        }
        
    except Exception as e:
        logger.error(f"❌ Error obteniendo historial de EcoScore: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{company_id}/update")
async def update_company_score(company_id: str, request: ScoreUpdateRequest):
    """
    📝 Actualiza manualmente el EcoScore de una empresa
    
    - **company_id**: ID de la empresa
    - **new_score**: Nuevo EcoScore (0-100)
    - **reason**: Motivo de la actualización manual
    """
    try:
        logger.info(f"📝 Actualizando EcoScore manualmente para {company_id}: {request.new_score}")
        
        if not (0 <= request.new_score <= 100):
            raise HTTPException(status_code=400, detail="EcoScore debe estar entre 0 y 100")
        
        # En implementación real, actualizar smart contract con permisos de admin
        result = await _update_score_on_chain(company_id, request.new_score)
        
        # Registrar actualización manual en logs de auditoría
        audit_log = {
            "action": "manual_score_update",
            "company_id": company_id,
            "new_score": request.new_score,
            "reason": request.reason,
            "updated_by": "admin",  # En implementación real, obtener del token JWT
            "timestamp": "2024-10-11T12:00:00Z"
        }
        
        # Enviar notificación
        from services.notification_service import NotificationService
        notification_service = NotificationService()
        await notification_service.send_score_update_notification(
            company_id, request.new_score, 85.0  # Score anterior mock
        )
        
        return {
            "success": True,
            "company_id": company_id,
            "updated_score": request.new_score,
            "reason": request.reason,
            "updated_at": "2024-10-11T12:00:00Z",
            "audit_log": audit_log
        }
        
    except Exception as e:
        logger.error(f"❌ Error actualizando EcoScore: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/leaderboard/global")
async def get_global_score_leaderboard(limit: int = 20):
    """
    🏆 Obtiene el ranking global de EcoScores
    
    - **limit**: Número de empresas en el ranking (default: 20)
    """
    try:
        logger.info(f"🏆 Generando ranking global de EcoScores (top {limit})")
        
        leaderboard = await _get_mock_global_leaderboard(limit)
        
        return {
            "success": True,
            "leaderboard": leaderboard,
            "total_companies": len(leaderboard),
            "average_score": sum(c["eco_score"] for c in leaderboard) / len(leaderboard),
            "generated_at": "2024-10-11T12:00:00Z"
        }
        
    except Exception as e:
        logger.error(f"❌ Error generando ranking global: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analytics/trends")
async def get_score_trends():
    """
    📊 Obtiene tendencias y analytics de EcoScores del sistema
    """
    try:
        logger.info("📊 Generando analytics de tendencias de EcoScores")
        
        trends = {
            "global_average_score": 72.3,
            "score_improvement_rate": 5.7,  # Porcentaje de mejora mensual
            "companies_improving": 128,
            "companies_declining": 28,
            "top_performing_sectors": [
                {"sector": "Tecnología", "average_score": 89.2},
                {"sector": "Energías Renovables", "average_score": 91.5},
                {"sector": "Manufactura Sostenible", "average_score": 78.9}
            ],
            "monthly_score_distribution": [
                {"range": "90-100", "count": 15},
                {"range": "80-89", "count": 42},
                {"range": "70-79", "count": 67},
                {"range": "60-69", "count": 23},
                {"range": "50-59", "count": 9}
            ],
            "score_factors_impact": [
                {"factor": "carbon_emissions", "weight": 30, "avg_contribution": 21.5},
                {"factor": "energy_efficiency", "weight": 25, "avg_contribution": 18.2},
                {"factor": "waste_management", "weight": 20, "avg_contribution": 14.8},
                {"factor": "water_conservation", "weight": 15, "avg_contribution": 10.9},
                {"factor": "renewable_energy", "weight": 10, "avg_contribution": 7.1}
            ],
            "last_updated": "2024-10-11T12:00:00Z"
        }
        
        return {
            "success": True,
            "trends": trends
        }
        
    except Exception as e:
        logger.error(f"❌ Error generando analytics: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/compare/{company_id1}/{company_id2}")
async def compare_company_scores(company_id1: str, company_id2: str):
    """
    🔍 Compara los EcoScores de dos empresas
    
    - **company_id1**: ID de la primera empresa
    - **company_id2**: ID de la segunda empresa
    """
    try:
        logger.info(f"🔍 Comparando EcoScores: {company_id1} vs {company_id2}")
        
        # Obtener scores de ambas empresas
        score1_data = await _get_mock_company_score(company_id1)
        score2_data = await _get_mock_company_score(company_id2)
        
        comparison = {
            "company_1": {
                "company_id": company_id1,
                "current_score": score1_data["current_score"],
                "ranking_position": score1_data["ranking_position"]
            },
            "company_2": {
                "company_id": company_id2,
                "current_score": score2_data["current_score"],
                "ranking_position": score2_data["ranking_position"]
            },
            "score_difference": score1_data["current_score"] - score2_data["current_score"],
            "ranking_difference": score2_data["ranking_position"] - score1_data["ranking_position"],
            "better_performer": company_id1 if score1_data["current_score"] > score2_data["current_score"] else company_id2,
            "comparison_areas": [
                {
                    "metric": "carbon_emissions",
                    "company_1_score": 22.5,
                    "company_2_score": 18.9
                },
                {
                    "metric": "energy_efficiency", 
                    "company_1_score": 19.2,
                    "company_2_score": 21.1
                }
            ],
            "compared_at": "2024-10-11T12:00:00Z"
        }
        
        return {
            "success": True,
            "comparison": comparison
        }
        
    except Exception as e:
        logger.error(f"❌ Error comparando EcoScores: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Funciones auxiliares mock (reemplazar con implementación real)
async def _get_mock_company_score(company_id: str) -> Dict[str, Any]:
    """Mock de datos de EcoScore de empresa"""
    return {
        "current_score": 87.3,
        "previous_score": 85.0,
        "score_change": 2.3,
        "ranking_position": 12,
        "total_companies": 156,
        "last_updated": "2024-10-11T10:30:00Z",
        "score_breakdown": {
            "carbon_emissions": 25.2,
            "energy_efficiency": 21.8,
            "waste_management": 17.5,
            "water_conservation": 13.1,
            "renewable_energy": 9.7
        }
    }

async def _calculate_eco_score(datacoins: List[Dict[str, Any]]) -> float:
    """Algoritmo de cálculo de EcoScore simplificado"""
    if not datacoins:
        return 0.0
    
    # Pesos por tipo de métrica
    weights = {
        "carbon_emissions": 0.30,
        "energy_consumption": 0.25,
        "water_usage": 0.15,
        "waste_generation": 0.20,
        "renewable_energy_percentage": 0.10
    }
    
    # Calcular score ponderado (algoritmo simplificado)
    total_score = 0.0
    total_weight = 0.0
    
    for datacoin in datacoins:
        metric_type = datacoin.get("metric_type")
        value = datacoin.get("value", 0)
        
        if metric_type in weights:
            # Normalizar valor a escala 0-100 (lógica simplificada)
            normalized_score = min(100, max(0, 100 - (value / 100)))
            weighted_score = normalized_score * weights[metric_type]
            total_score += weighted_score
            total_weight += weights[metric_type]
    
    return round(total_score / total_weight if total_weight > 0 else 0.0, 1)

async def _update_score_on_chain(company_id: str, score: float) -> Dict[str, Any]:
    """Mock de actualización en smart contract"""
    return {
        "success": True,
        "transaction_hash": f"0x{'a' * 64}",
        "gas_used": 150000
    }

async def _get_mock_score_history(company_id: str, limit: int) -> List[Dict[str, Any]]:
    """Mock de historial de EcoScores"""
    return [
        {
            "date": "2024-10-11",
            "score": 87.3,
            "change": 2.3,
            "rank": 12
        },
        {
            "date": "2024-10-10",
            "score": 85.0,
            "change": -1.2,
            "rank": 15
        },
        {
            "date": "2024-10-09",
            "score": 86.2,
            "change": 0.8,
            "rank": 13
        }
    ][:limit]

async def _get_mock_global_leaderboard(limit: int) -> List[Dict[str, Any]]:
    """Mock de ranking global"""
    companies = [
        {"company_id": "eco_leader_1", "name": "Green Tech Solutions", "eco_score": 96.8, "rank": 1},
        {"company_id": "eco_leader_2", "name": "Sustainable Industries", "eco_score": 94.2, "rank": 2},
        {"company_id": "eco_leader_3", "name": "Clean Energy Corp", "eco_score": 91.7, "rank": 3},
        {"company_id": "eco_leader_4", "name": "EcoManufacturing", "eco_score": 89.3, "rank": 4},
        {"company_id": "eco_leader_5", "name": "Renewable Solutions", "eco_score": 87.9, "rank": 5}
    ]
    return companies[:limit]