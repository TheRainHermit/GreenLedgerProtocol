# 🌿 GreenLedger Protocol - Backend

Backend API en Python para el protocolo de sostenibilidad GreenLedger.

## 🚀 Instalación y Configuración

### Opción 1: Servidor Simplificado (Recomendado)

```bash
cd backend
python3 simple_server.py
```

### Opción 2: Servidor FastAPI (Avanzado)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # En Linux/Mac
pip install -r requirements.txt
python run.py
```

## 📊 Endpoints Principales

### DataCoins (Métricas Ambientales)
- `POST /api/v1/datacoins/upload` - Subir métricas ambientales
- `GET /api/v1/datacoins/company/{company_id}` - Obtener Data Coins de empresa
- `GET /api/v1/datacoins/metrics/types` - Tipos de métricas soportadas

### Recompensas PYUSD
- `GET /api/v1/rewards/leaderboard` - Ranking de empresas sostenibles
- `POST /api/v1/rewards/distribute` - Distribución automática mensual
- `GET /api/v1/rewards/stats` - Estadísticas de recompensas

### EcoScores
- `GET /api/v1/scores/{company_id}` - Obtener EcoScore de empresa
- `POST /api/v1/scores/calculate/{company_id}` - Calcular nuevo EcoScore

## 🔧 Comandos de Prueba

```bash
# Health check
curl http://localhost:8000/health

# Leaderboard
curl http://localhost:8000/api/v1/rewards/leaderboard

# EcoScore de empresa
curl http://localhost:8000/api/v1/scores/empresa_verde_1

# Upload de Data Coin
curl -X POST http://localhost:8000/api/v1/datacoins/upload \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": "empresa_verde_1", 
    "metric_type": "carbon_emissions", 
    "value": 1250.5, 
    "unit": "kg_co2", 
    "timestamp": "2024-10-11T12:00:00Z"
  }'
```

## 🌐 URLs Importantes

- **Interfaz Web**: http://localhost:8000
- **Health Check**: http://localhost:8000/health
- **API Base**: http://localhost:8000/api/v1/

## 🏗️ Arquitectura

```
backend/
├── simple_server.py          # Servidor HTTP nativo (funcional)
├── api/
│   ├── server.py             # Servidor FastAPI (avanzado)
│   └── routes/
│       ├── datacoins.py      # Endpoints para Data Coins
│       ├── rewards.py        # Endpoints para recompensas
│       └── scores.py         # Endpoints para EcoScores
├── services/
│   ├── lighthouse_service.py     # Almacenamiento distribuido
│   ├── reward_service.py         # Sistema de recompensas PYUSD
│   ├── notification_service.py   # Notificaciones Telegram/WhatsApp
│   └── evvm_relayer.py          # Automatización EVVM
├── requirements.txt          # Dependencias Python
├── .env.example             # Variables de entorno
└── run.py                   # Script de arranque FastAPI
```

## � Características Implementadas

✅ **Servidor HTTP funcional**  
✅ **Endpoints RESTful completos**  
✅ **Interfaz web interactiva**  
✅ **Mock data para desarrollo**  
✅ **CORS habilitado**  
✅ **Respuestas JSON estructuradas**  
✅ **Health checks**  

## 🔮 Próximos Pasos

- [ ] Integrar con smart contracts reales
- [ ] Conectar con Lighthouse storage
- [ ] Implementar base de datos persistente
- [ ] Configurar notificaciones Telegram/WhatsApp
- [ ] Integrar con EVVM Relayer
- [ ] Agregar autenticación JWT
- [ ] Implementar validaciones de datos

---

*Backend funcional para el protocolo GreenLedger* 🌿