"""
🤖 EVVM Relayer - Automatización de transacciones
Manejo de ejecución automática y programada de operaciones
"""

import os
import logging
import httpx
from typing import Dict, Any, List, Optional
from pydantic import BaseModel
from enum import Enum
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class TaskType(str, Enum):
    MONTHLY_REWARDS = "monthly_rewards"
    SCORE_CALCULATION = "score_calculation"
    DATA_VERIFICATION = "data_verification"
    NOTIFICATION_BATCH = "notification_batch"

class TaskStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class AutomationTask(BaseModel):
    """Modelo para tareas de automatización"""
    id: str
    type: TaskType
    title: str
    description: str
    schedule: str  # cron expression
    next_execution: str
    status: TaskStatus = TaskStatus.PENDING
    last_execution: Optional[str] = None
    parameters: Optional[Dict[str, Any]] = None

class EVVMRelayer:
    """Servicio de automatización con EVVM Relayer"""
    
    def __init__(self):
        self.relayer_url = os.getenv("EVVM_RELAYER_URL", "https://relayer.evvm.org")
        self.api_key = os.getenv("EVVM_API_KEY")
        self.client = httpx.AsyncClient()
        
        # Tareas programadas del sistema
        self.scheduled_tasks = [
            AutomationTask(
                id="monthly_rewards_dist",
                type=TaskType.MONTHLY_REWARDS,
                title="Distribución Mensual de Recompensas",
                description="Distribución automática de PYUSD basada en EcoScores",
                schedule="0 0 1 * *",  # Primer día de cada mes
                next_execution="2024-11-01T00:00:00Z"
            ),
            AutomationTask(
                id="daily_score_update",
                type=TaskType.SCORE_CALCULATION,
                title="Actualización Diaria de EcoScores",
                description="Recálculo de puntuaciones basado en nuevos Data Coins",
                schedule="0 2 * * *",  # Todos los días a las 2 AM
                next_execution="2024-10-12T02:00:00Z"
            ),
            AutomationTask(
                id="datacoin_verification",
                type=TaskType.DATA_VERIFICATION,
                title="Verificación de Data Coins",
                description="Verificación automática de integridad de datos",
                schedule="0 */6 * * *",  # Cada 6 horas
                next_execution="2024-10-11T18:00:00Z"
            )
        ]
    
    async def register_automation_task(self, task: AutomationTask) -> Dict[str, Any]:
        """
        Registra una nueva tarea de automatización en EVVM
        """
        try:
            logger.info(f"📝 Registrando tarea de automatización: {task.title}")
            
            # En implementación real, usar la API de EVVM Relayer
            result = await self._mock_register_evvm_task(task)
            
            return {
                "success": True,
                "task_id": result["task_id"],
                "evvm_job_id": result["evvm_job_id"],
                "next_execution": task.next_execution,
                "status": "registered"
            }
            
        except Exception as e:
            logger.error(f"❌ Error registrando tarea: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def execute_monthly_rewards(self) -> Dict[str, Any]:
        """
        Ejecuta la distribución mensual de recompensas
        """
        try:
            logger.info("💰 Ejecutando distribución mensual de recompensas")
            
            # Importar servicios necesarios
            from .reward_service import RewardService
            from .notification_service import NotificationService
            
            reward_service = RewardService()
            notification_service = NotificationService()
            
            # 1. Obtener empresas elegibles
            companies = await reward_service._get_all_companies()
            
            # 2. Calcular recompensas
            distributions = await reward_service.calculate_rewards(companies)
            
            if not distributions:
                return {
                    "success": True,
                    "message": "No hay empresas elegibles para recompensas este mes",
                    "distributions": []
                }
            
            # 3. Distribuir recompensas
            distribution_result = await reward_service.distribute_rewards(distributions)
            
            # 4. Enviar notificaciones
            for distribution in distributions:
                if distribution.transaction_hash:
                    await notification_service.send_reward_notification(
                        distribution.company_id,
                        float(distribution.amount),
                        distribution.eco_score
                    )
            
            return {
                "success": True,
                "execution_time": "2024-10-11T12:00:00Z",
                "total_companies": len(companies),
                "eligible_companies": len(distributions),
                "total_distributed": float(sum(d.amount for d in distributions)),
                "distributions": [d.dict() for d in distributions]
            }
            
        except Exception as e:
            logger.error(f"❌ Error en distribución mensual: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def execute_score_calculation(self) -> Dict[str, Any]:
        """
        Ejecuta recálculo diario de EcoScores
        """
        try:
            logger.info("📊 Ejecutando cálculo de EcoScores")
            
            # En implementación real, integrar con ScoreCalculator contract
            companies_updated = await self._mock_calculate_scores()
            
            # Enviar notificaciones de cambios significativos
            from services.notification_service import NotificationService
            notification_service = NotificationService()
            
            notifications_sent = 0
            for company in companies_updated:
                if abs(company["score_change"]) >= 5.0:  # Cambio significativo
                    await notification_service.send_score_update_notification(
                        company["company_id"],
                        company["new_score"],
                        company["previous_score"]
                    )
                    notifications_sent += 1
            
            return {
                "success": True,
                "execution_time": "2024-10-11T02:00:00Z",
                "companies_processed": len(companies_updated),
                "notifications_sent": notifications_sent,
                "score_updates": companies_updated
            }
            
        except Exception as e:
            logger.error(f"❌ Error en cálculo de scores: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def execute_data_verification(self) -> Dict[str, Any]:
        """
        Ejecuta verificación automática de Data Coins
        """
        try:
            logger.info("🔍 Ejecutando verificación de Data Coins")
            
            from services.lighthouse_service import LighthouseService
            lighthouse_service = LighthouseService()
            
            # Obtener Data Coins pendientes de verificación
            pending_datacoins = await self._get_pending_datacoins()
            
            verified_count = 0
            failed_count = 0
            
            for datacoin in pending_datacoins:
                verification_result = await lighthouse_service.verify_datacoin(
                    datacoin["lighthouse_hash"]
                )
                
                if verification_result["success"] and verification_result["verified"]:
                    verified_count += 1
                    
                    # Enviar confirmación
                    from services.notification_service import NotificationService
                    notification_service = NotificationService()
                    await notification_service.send_datacoin_confirmation(
                        datacoin["company_id"],
                        datacoin["metric_type"],
                        datacoin["lighthouse_hash"]
                    )
                else:
                    failed_count += 1
            
            return {
                "success": True,
                "execution_time": "2024-10-11T18:00:00Z",
                "datacoins_processed": len(pending_datacoins),
                "verified": verified_count,
                "failed": failed_count
            }
            
        except Exception as e:
            logger.error(f"❌ Error en verificación de datos: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_scheduled_tasks(self) -> List[Dict[str, Any]]:
        """
        Obtiene lista de tareas programadas
        """
        return [task.dict() for task in self.scheduled_tasks]
    
    async def get_task_status(self, task_id: str) -> Dict[str, Any]:
        """
        Obtiene estado de una tarea específica
        """
        try:
            task = next((t for t in self.scheduled_tasks if t.id == task_id), None)
            
            if not task:
                raise ValueError(f"Tarea no encontrada: {task_id}")
            
            # En implementación real, consultar estado en EVVM
            execution_history = await self._get_task_execution_history(task_id)
            
            return {
                "task": task.dict(),
                "execution_history": execution_history
            }
            
        except Exception as e:
            logger.error(f"❌ Error obteniendo estado de tarea: {e}")
            return {
                "error": str(e)
            }
    
    async def cancel_task(self, task_id: str) -> Dict[str, Any]:
        """
        Cancela una tarea programada
        """
        try:
            logger.info(f"🚫 Cancelando tarea: {task_id}")
            
            # En implementación real, cancelar en EVVM Relayer
            result = await self._mock_cancel_evvm_task(task_id)
            
            # Actualizar estado local
            for task in self.scheduled_tasks:
                if task.id == task_id:
                    task.status = TaskStatus.CANCELLED
                    break
            
            return {
                "success": True,
                "task_id": task_id,
                "status": "cancelled"
            }
            
        except Exception as e:
            logger.error(f"❌ Error cancelando tarea: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    # Métodos mock para desarrollo
    async def _mock_register_evvm_task(self, task: AutomationTask) -> Dict[str, Any]:
        """Mock de registro en EVVM"""
        import hashlib
        
        task_data = f"{task.id}{task.type}{task.schedule}"
        evvm_job_id = hashlib.md5(task_data.encode()).hexdigest()
        
        return {
            "task_id": task.id,
            "evvm_job_id": f"evvm_{evvm_job_id[:16]}"
        }
    
    async def _mock_calculate_scores(self) -> List[Dict[str, Any]]:
        """Mock de cálculo de scores"""
        return [
            {
                "company_id": "empresa_verde_1",
                "previous_score": 90.0,
                "new_score": 92.5,
                "score_change": +2.5
            },
            {
                "company_id": "empresa_verde_2",
                "previous_score": 85.0,
                "new_score": 87.3,
                "score_change": +2.3
            }
        ]
    
    async def _get_pending_datacoins(self) -> List[Dict[str, Any]]:
        """Mock de Data Coins pendientes"""
        return [
            {
                "company_id": "empresa_verde_1",
                "metric_type": "carbon_emissions",
                "lighthouse_hash": "QmExample1234567890",
                "uploaded_at": "2024-10-11T10:00:00Z"
            }
        ]
    
    async def _get_task_execution_history(self, task_id: str) -> List[Dict[str, Any]]:
        """Mock de historial de ejecuciones"""
        return [
            {
                "execution_id": "exec_001",
                "started_at": "2024-10-01T00:00:00Z",
                "completed_at": "2024-10-01T00:05:30Z",
                "status": "completed",
                "result": {
                    "companies_processed": 25,
                    "total_distributed": 10000.0
                }
            }
        ]
    
    async def _mock_cancel_evvm_task(self, task_id: str) -> Dict[str, Any]:
        """Mock de cancelación en EVVM"""
        return {
            "task_id": task_id,
            "evvm_response": "Task cancelled successfully"
        }