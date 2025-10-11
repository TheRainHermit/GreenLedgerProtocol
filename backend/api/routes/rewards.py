"""
💰 Rewards Routes - Endpoints para sistema de recompensas PYUSD
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
import logging
from pydantic import BaseModel
from decimal import Decimal
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from services.reward_service import RewardService, Company, RewardDistribution

logger = logging.getLogger(__name__)
router = APIRouter()

# Inicializar servicio
reward_service = RewardService()

class RewardCalculationRequest(BaseModel):
    """Request para calcular recompensas"""
    companies: List[Dict[str, Any]]
    reward_pool: Optional[float] = None

class ManualRewardRequest(BaseModel):
    """Request para recompensa manual"""
    company_id: str
    amount: float
    reason: str

@router.get("/leaderboard")
async def get_leaderboard(limit: int = 10):
    """
    🏆 Obtiene el ranking de empresas por EcoScore
    
    - **limit**: Número de empresas en el ranking (default: 10)
    """
    try:
        logger.info(f"🏆 Generando leaderboard (top {limit})")
        
        leaderboard = await reward_service.get_leaderboard(limit)
        
        return {
            "success": True,
            "leaderboard": leaderboard,
            "total_companies": len(leaderboard),
            "generated_at": "2024-10-11T12:00:00Z"
        }
        
    except Exception as e:
        logger.error(f"❌ Error generando leaderboard: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/calculate")
async def calculate_rewards(request: RewardCalculationRequest):
    """
    🧮 Calcula recompensas para un conjunto de empresas
    
    - **companies**: Lista de empresas con sus EcoScores
    - **reward_pool**: Pool de recompensas (opcional, usa default del sistema)
    """
    try:
        logger.info(f"🧮 Calculando recompensas para {len(request.companies)} empresas")
        
        # Convertir datos a objetos Company
        companies = []
        for comp_data in request.companies:
            company = Company(
                id=comp_data["id"],
                name=comp_data["name"],
                wallet_address=comp_data["wallet_address"],
                eco_score=comp_data["eco_score"],
                total_rewards_earned=Decimal(str(comp_data.get("total_rewards_earned", 0)))
            )
            companies.append(company)
        
        # Calcular recompensas
        distributions = await reward_service.calculate_rewards(companies)
        
        total_amount = sum(d.amount for d in distributions)
        
        return {
            "success": True,
            "calculation_date": "2024-10-11T12:00:00Z",
            "total_companies": len(companies),
            "eligible_companies": len(distributions),
            "total_reward_amount": float(total_amount),
            "distributions": [
                {
                    "company_id": d.company_id,
                    "amount": float(d.amount),
                    "eco_score": d.eco_score,
                    "percentage_of_pool": float((d.amount / total_amount) * 100) if total_amount > 0 else 0
                }
                for d in distributions
            ]
        }
        
    except Exception as e:
        logger.error(f"❌ Error calculando recompensas: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/distribute")
async def distribute_rewards():
    """
    🚀 Ejecuta distribución automática de recompensas mensuales
    
    Distribuye PYUSD a todas las empresas elegibles basado en sus EcoScores
    """
    try:
        logger.info("🚀 Iniciando distribución automática de recompensas")
        
        # Obtener empresas del sistema
        companies = await reward_service._get_all_companies()
        
        # Calcular recompensas
        distributions = await reward_service.calculate_rewards(companies)
        
        if not distributions:
            return {
                "success": True,
                "message": "No hay empresas elegibles para recompensas",
                "distributions": []
            }
        
        # Distribuir recompensas
        result = await reward_service.distribute_rewards(distributions)
        
        # Enviar notificaciones
        from services.notification_service import NotificationService
        notification_service = NotificationService()
        
        for distribution in distributions:
            if distribution.transaction_hash:
                await notification_service.send_reward_notification(
                    distribution.company_id,
                    float(distribution.amount),
                    distribution.eco_score
                )
        
        return {
            "success": True,
            "distribution_date": "2024-10-11T12:00:00Z",
            "result": result
        }
        
    except Exception as e:
        logger.error(f"❌ Error distribuyendo recompensas: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/manual")
async def send_manual_reward(request: ManualRewardRequest):
    """
    💸 Envía recompensa manual a una empresa específica
    
    - **company_id**: ID de la empresa
    - **amount**: Cantidad de PYUSD a enviar
    - **reason**: Motivo de la recompensa
    """
    try:
        logger.info(f"💸 Enviando recompensa manual: {request.amount} PYUSD a {request.company_id}")
        
        # Crear distribución manual
        distribution = RewardDistribution(
            company_id=request.company_id,
            amount=Decimal(str(request.amount)),
            eco_score=0.0,  # No aplica para recompensa manual
            reward_date="2024-10-11T12:00:00Z"
        )
        
        # Enviar recompensa
        result = await reward_service.distribute_rewards([distribution])
        
        # Enviar notificación personalizada
        from services.notification_service import NotificationService
        notification_service = NotificationService()
        
        from services.notification_service import Notification, NotificationChannel, NotificationType
        notification = Notification(
            recipient_id=request.company_id,
            channel=NotificationChannel.TELEGRAM,
            type=NotificationType.REWARD_DISTRIBUTED,
            title="🎁 Recompensa Especial Recibida",
            message=f"Has recibido {request.amount} PYUSD. Motivo: {request.reason}",
            data={
                "amount": request.amount,
                "reason": request.reason,
                "type": "manual_reward"
            }
        )
        await notification_service.send_notification(notification)
        
        return {
            "success": True,
            "transaction_hash": distribution.transaction_hash,
            "amount": float(distribution.amount),
            "recipient": request.company_id,
            "reason": request.reason,
            "sent_at": "2024-10-11T12:00:00Z"
        }
        
    except Exception as e:
        logger.error(f"❌ Error enviando recompensa manual: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/company/{company_id}/history")
async def get_company_reward_history(company_id: str, limit: int = 20):
    """
    📊 Obtiene historial de recompensas de una empresa
    
    - **company_id**: ID de la empresa
    - **limit**: Número de registros (default: 20)
    """
    try:
        logger.info(f"📊 Obteniendo historial de recompensas para {company_id}")
        
        history = await reward_service.get_company_rewards_history(company_id)
        
        return {
            "success": True,
            "company_id": company_id,
            "total_records": len(history),
            "history": history[:limit]
        }
        
    except Exception as e:
        logger.error(f"❌ Error obteniendo historial: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats")
async def get_rewards_stats():
    """
    📈 Obtiene estadísticas globales del sistema de recompensas
    """
    try:
        # En implementación real, consultar base de datos
        stats = {
            "total_distributed_ever": 147500.75,
            "current_month_distributed": 10000.0,
            "total_recipients": 156,
            "active_recipients_this_month": 42,
            "average_reward": 238.09,
            "highest_reward_this_month": 892.50,
            "lowest_reward_this_month": 125.25,
            "reward_pool_remaining": 50000.0,
            "next_distribution_date": "2024-11-01T00:00:00Z",
            "distribution_frequency": "monthly",
            "currency": "PYUSD",
            "minimum_eco_score": 50.0,
            "last_updated": "2024-10-11T12:00:00Z"
        }
        
        return {
            "success": True,
            "stats": stats
        }
        
    except Exception as e:
        logger.error(f"❌ Error obteniendo estadísticas de recompensas: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/eligibility/{company_id}")
async def check_reward_eligibility(company_id: str):
    """
    ✅ Verifica si una empresa es elegible para recompensas
    
    - **company_id**: ID de la empresa a verificar
    """
    try:
        logger.info(f"✅ Verificando elegibilidad de recompensas para {company_id}")
        
        # En implementación real, obtener datos reales de la empresa
        company_data = {
            "company_id": company_id,
            "eco_score": 78.5,
            "minimum_required": 50.0,
            "has_verified_datacoins": True,
            "last_reward_date": "2024-09-01T12:00:00Z",
            "account_status": "active"
        }
        
        is_eligible = (
            company_data["eco_score"] >= company_data["minimum_required"] and
            company_data["has_verified_datacoins"] and
            company_data["account_status"] == "active"
        )
        
        return {
            "success": True,
            "company_id": company_id,
            "eligible": is_eligible,
            "eligibility_details": company_data,
            "estimated_reward": 285.50 if is_eligible else 0.0,
            "checked_at": "2024-10-11T12:00:00Z"
        }
        
    except Exception as e:
        logger.error(f"❌ Error verificando elegibilidad: {e}")
        raise HTTPException(status_code=500, detail=str(e))