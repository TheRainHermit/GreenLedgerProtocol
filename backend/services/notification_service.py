"""
📱 Notification Service - Servicio de notificaciones
Alertas vía Telegram y WhatsApp para eventos del protocolo
"""

import os
import logging
import httpx
from typing import Dict, Any, List, Optional
from pydantic import BaseModel
from enum import Enum

logger = logging.getLogger(__name__)

class NotificationType(str, Enum):
    REWARD_DISTRIBUTED = "reward_distributed"
    SCORE_UPDATED = "score_updated"
    DATACOIN_UPLOADED = "datacoin_uploaded"
    LEADERBOARD_CHANGE = "leaderboard_change"
    SYSTEM_ALERT = "system_alert"

class NotificationChannel(str, Enum):
    TELEGRAM = "telegram"
    WHATSAPP = "whatsapp"
    EMAIL = "email"

class Notification(BaseModel):
    """Modelo para notificaciones"""
    recipient_id: str
    channel: NotificationChannel
    type: NotificationType
    title: str
    message: str
    data: Optional[Dict[str, Any]] = None

class NotificationService:
    """Servicio para envío de notificaciones"""
    
    def __init__(self):
        self.telegram_token = os.getenv("TELEGRAM_BOT_TOKEN")
        self.whatsapp_api_key = os.getenv("WHATSAPP_API_KEY")
        self.telegram_api_url = f"https://api.telegram.org/bot{self.telegram_token}"
        
    async def send_notification(self, notification: Notification) -> Dict[str, Any]:
        """
        Envía una notificación a través del canal especificado
        """
        try:
            logger.info(f"📤 Enviando notificación {notification.type} vía {notification.channel}")
            
            if notification.channel == NotificationChannel.TELEGRAM:
                result = await self._send_telegram(notification)
            elif notification.channel == NotificationChannel.WHATSAPP:
                result = await self._send_whatsapp(notification)
            elif notification.channel == NotificationChannel.EMAIL:
                result = await self._send_email(notification)
            else:
                raise ValueError(f"Canal no soportado: {notification.channel}")
            
            return {
                "success": True,
                "channel": notification.channel,
                "message_id": result.get("message_id"),
                "timestamp": "2024-10-11T12:00:00Z"
            }
            
        except Exception as e:
            logger.error(f"❌ Error enviando notificación: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def send_reward_notification(self, company_id: str, amount: float, eco_score: float) -> Dict[str, Any]:
        """
        Envía notificación de recompensa distribuida
        """
        notification = Notification(
            recipient_id=company_id,
            channel=NotificationChannel.TELEGRAM,
            type=NotificationType.REWARD_DISTRIBUTED,
            title="🎉 ¡Nueva Recompensa Recibida!",
            message=f"Felicidades! Has recibido {amount:.2f} PYUSD por tu EcoScore de {eco_score}. ¡Sigue con las buenas prácticas sostenibles! 🌿",
            data={
                "amount": amount,
                "eco_score": eco_score,
                "currency": "PYUSD"
            }
        )
        
        return await self.send_notification(notification)
    
    async def send_score_update_notification(self, company_id: str, new_score: float, previous_score: float) -> Dict[str, Any]:
        """
        Envía notificación de actualización de EcoScore
        """
        change = new_score - previous_score
        emoji = "📈" if change > 0 else "📉" if change < 0 else "📊"
        
        notification = Notification(
            recipient_id=company_id,
            channel=NotificationChannel.TELEGRAM,
            type=NotificationType.SCORE_UPDATED,
            title=f"{emoji} EcoScore Actualizado",
            message=f"Tu EcoScore se ha actualizado a {new_score:.1f} (cambio: {change:+.1f}). Mantén el buen trabajo hacia la sostenibilidad! 🌱",
            data={
                "new_score": new_score,
                "previous_score": previous_score,
                "change": change
            }
        )
        
        return await self.send_notification(notification)
    
    async def send_datacoin_confirmation(self, company_id: str, metric_type: str, lighthouse_hash: str) -> Dict[str, Any]:
        """
        Envía confirmación de Data Coin subido
        """
        notification = Notification(
            recipient_id=company_id,
            channel=NotificationChannel.TELEGRAM,
            type=NotificationType.DATACOIN_UPLOADED,
            title="✅ Data Coin Verificado",
            message=f"Tu métrica de {metric_type} ha sido verificada y almacenada de forma segura. Hash: {lighthouse_hash[:10]}...",
            data={
                "metric_type": metric_type,
                "lighthouse_hash": lighthouse_hash
            }
        )
        
        return await self.send_notification(notification)
    
    async def send_leaderboard_notification(self, company_id: str, new_rank: int, previous_rank: int) -> Dict[str, Any]:
        """
        Envía notificación de cambio en el ranking
        """
        if new_rank < previous_rank:
            emoji = "🏆"
            message = f"¡Felicidades! Has subido al puesto #{new_rank} en el ranking de sostenibilidad!"
        else:
            emoji = "📊"
            message = f"Tu posición en el ranking ha cambiado al puesto #{new_rank}. ¡Sigue mejorando!"
        
        notification = Notification(
            recipient_id=company_id,
            channel=NotificationChannel.TELEGRAM,
            type=NotificationType.LEADERBOARD_CHANGE,
            title=f"{emoji} Cambio en Ranking",
            message=message,
            data={
                "new_rank": new_rank,
                "previous_rank": previous_rank
            }
        )
        
        return await self.send_notification(notification)
    
    async def broadcast_system_alert(self, message: str, recipients: List[str]) -> List[Dict[str, Any]]:
        """
        Envía alerta del sistema a múltiples recipients
        """
        results = []
        
        for recipient_id in recipients:
            notification = Notification(
                recipient_id=recipient_id,
                channel=NotificationChannel.TELEGRAM,
                type=NotificationType.SYSTEM_ALERT,
                title="🚨 Alerta del Sistema",
                message=message
            )
            
            result = await self.send_notification(notification)
            results.append({
                "recipient_id": recipient_id,
                "result": result
            })
        
        return results
    
    async def get_notification_history(self, company_id: str, limit: int = 20) -> List[Dict[str, Any]]:
        """
        Obtiene historial de notificaciones enviadas
        """
        try:
            logger.info(f"📋 Obteniendo historial de notificaciones para {company_id}")
            
            # En implementación real, consultar base de datos
            history = await self._get_mock_notification_history(company_id, limit)
            
            return history
            
        except Exception as e:
            logger.error(f"❌ Error obteniendo historial de notificaciones: {e}")
            return []
    
    # Métodos de envío por canal
    async def _send_telegram(self, notification: Notification) -> Dict[str, Any]:
        """Envía mensaje vía Telegram"""
        try:
            if not self.telegram_token:
                raise ValueError("Token de Telegram no configurado")
            
            # En implementación real, usar la API de Telegram
            logger.info(f"📱 Enviando mensaje Telegram a {notification.recipient_id}")
            
            # Mock de respuesta de Telegram
            return {
                "message_id": "12345",
                "chat_id": notification.recipient_id,
                "status": "sent"
            }
            
        except Exception as e:
            logger.error(f"❌ Error enviando Telegram: {e}")
            raise
    
    async def _send_whatsapp(self, notification: Notification) -> Dict[str, Any]:
        """Envía mensaje vía WhatsApp"""
        try:
            if not self.whatsapp_api_key:
                raise ValueError("API key de WhatsApp no configurada")
            
            logger.info(f"💬 Enviando mensaje WhatsApp a {notification.recipient_id}")
            
            # Mock de respuesta de WhatsApp
            return {
                "message_id": "wa_67890",
                "phone": notification.recipient_id,
                "status": "sent"
            }
            
        except Exception as e:
            logger.error(f"❌ Error enviando WhatsApp: {e}")
            raise
    
    async def _send_email(self, notification: Notification) -> Dict[str, Any]:
        """Envía mensaje vía email"""
        try:
            logger.info(f"📧 Enviando email a {notification.recipient_id}")
            
            # Mock de respuesta de email
            return {
                "message_id": "email_54321",
                "email": notification.recipient_id,
                "status": "sent"
            }
            
        except Exception as e:
            logger.error(f"❌ Error enviando email: {e}")
            raise
    
    async def _get_mock_notification_history(self, company_id: str, limit: int) -> List[Dict[str, Any]]:
        """Mock de historial de notificaciones"""
        return [
            {
                "id": "notif_001",
                "type": "reward_distributed",
                "title": "🎉 ¡Nueva Recompensa Recibida!",
                "message": "Has recibido 425.50 PYUSD por tu EcoScore de 89.2",
                "channel": "telegram",
                "timestamp": "2024-10-10T15:30:00Z",
                "status": "delivered"
            },
            {
                "id": "notif_002",
                "type": "score_updated",
                "title": "📈 EcoScore Actualizado",
                "message": "Tu EcoScore se ha actualizado a 89.2 (cambio: +2.1)",
                "channel": "telegram",
                "timestamp": "2024-10-09T09:15:00Z",
                "status": "delivered"
            },
            {
                "id": "notif_003",
                "type": "datacoin_uploaded",
                "title": "✅ Data Coin Verificado",
                "message": "Tu métrica de carbon_emissions ha sido verificada",
                "channel": "telegram",
                "timestamp": "2024-10-08T14:20:00Z",
                "status": "delivered"
            }
        ]