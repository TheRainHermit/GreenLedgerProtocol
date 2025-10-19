"""
Empresas Routes - Endpoints para gestión empresarial y métricas ambientales
"""

from fastapi import APIRouter, HTTPException, Depends, Security
from typing import List, Dict, Any
from pydantic import BaseModel
import logging
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from utils.web3_utils import Web3Utils

logger = logging.getLogger(__name__)
router = APIRouter()
web3_utils = Web3Utils()
security = HTTPBasic()

# Simulación de owner para endpoints administrativos
OWNER_WALLET = "0xOWNER_WALLET_AQUI"  # Cambia por el wallet real del owner

def is_owner(credentials: HTTPBasicCredentials = Depends(security)):
    # Aquí deberías validar el usuario/contraseña o el wallet
    # Simulación: acepta si el username es "owner"
    if credentials.username != "owner":
        raise HTTPException(status_code=403, detail="Solo el owner puede acceder a este endpoint")
    return True

class EmpresaRegisterRequest(BaseModel):
    nombre: str
    sector: str
    pais: str

class RepresentanteRequest(BaseModel):
    representante: str

class MetricaRequest(BaseModel):
    tipo: str
    valor: float
    unidad: str

@router.post("/registrar", summary="Registra una empresa", response_description="Hash de la transacción")
async def registrar_empresa(request: EmpresaRegisterRequest):
    """
    Registra una empresa en el contrato maestro
    """
    try:
        # Validación de datos
        if not request.nombre or not request.sector or not request.pais:
            raise ValueError("Todos los campos son obligatorios")
        tx_hash = web3_utils.call_contract_function(
            "registrarEmpresa",
            [request.nombre, request.sector, request.pais]
        )
        logger.info(f"Empresa registrada: {request.nombre}, tx: {tx_hash}")
        return {"success": True, "tx_hash": tx_hash}
    except Exception as e:
        logger.error(f"[registrar_empresa] Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{empresa}/representantes/agregar", summary="Agrega representante", response_description="Hash de la transacción")
async def agregar_representante(empresa: str, request: RepresentanteRequest):
    """
    Agrega un representante a la empresa
    """
    try:
        if not web3_utils.is_valid_address(empresa):
            raise ValueError("Wallet de empresa inválida")
        if not web3_utils.is_valid_address(request.representante):
            raise ValueError("Wallet de representante inválida")
        tx_hash = web3_utils.call_contract_function(
            "agregarRepresentante",
            [request.representante],
            sender=empresa
        )
        logger.info(f"Representante agregado: {request.representante} a {empresa}, tx: {tx_hash}")
        return {"success": True, "tx_hash": tx_hash}
    except Exception as e:
        logger.error(f"[agregar_representante] Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{empresa}/representantes/eliminar", summary="Elimina representante", response_description="Hash de la transacción")
async def eliminar_representante(empresa: str, request: RepresentanteRequest):
    """
    Elimina un representante de la empresa
    """
    try:
        if not web3_utils.is_valid_address(empresa):
            raise ValueError("Wallet de empresa inválida")
        if not web3_utils.is_valid_address(request.representante):
            raise ValueError("Wallet de representante inválida")
        tx_hash = web3_utils.call_contract_function(
            "eliminarRepresentante",
            [request.representante],
            sender=empresa
        )
        logger.info(f"Representante eliminado: {request.representante} de {empresa}, tx: {tx_hash}")
        return {"success": True, "tx_hash": tx_hash}
    except Exception as e:
        logger.error(f"[eliminar_representante] Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{empresa}/metricas/registrar", summary="Registra métrica ambiental", response_description="Hash de la transacción")
async def registrar_metrica(empresa: str, request: MetricaRequest):
    """
    Registra una métrica ambiental para la empresa
    """
    try:
        if not web3_utils.is_valid_address(empresa):
            raise ValueError("Wallet de empresa inválida")
        if not request.tipo or not request.unidad:
            raise ValueError("Tipo y unidad son obligatorios")
        tx_hash = web3_utils.call_contract_function(
            "registrarMetrica",
            [request.tipo, int(request.valor), request.unidad],
            sender=empresa
        )
        logger.info(f"Métrica registrada: {request.tipo} para {empresa}, tx: {tx_hash}")
        return {"success": True, "tx_hash": tx_hash}
    except Exception as e:
        logger.error(f"[registrar_metrica] Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{empresa}/score")
async def consultar_score(empresa: str):
    """
    Consulta el score ambiental de la empresa
    """
    try:
        score = web3_utils.call_contract_view("consultarScore", [empresa])
        return {"success": True, "score": score}
    except Exception as e:
        logger.error(f"Error consultando score: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/ranking")
async def ranking_empresas():
    """
    Consulta el ranking de empresas
    """
    try:
        ranking = web3_utils.call_contract_view("rankingEmpresas", [])
        return {"success": True, "ranking": ranking}
    except Exception as e:
        logger.error(f"Error consultando ranking: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{empresa}/metricas")
async def ver_metricas_empresa(empresa: str):
    """
    Consulta las métricas ambientales de la empresa
    """
    try:
        metricas = web3_utils.call_contract_view("verMetricasEmpresa", [empresa])
        return {"success": True, "metricas": metricas}
    except Exception as e:
        logger.error(f"Error consultando métricas: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{empresa}/recompensa/reclamar", summary="Reclama recompensa", response_description="Hash de la transacción")
async def reclamar_recompensa(empresa: str, amount: int):
    """
    Reclama una recompensa para la empresa
    """
    try:
        if not web3_utils.is_valid_address(empresa):
            raise ValueError("Wallet de empresa inválida")
        if amount <= 0:
            raise ValueError("La cantidad debe ser mayor a cero")
        tx_hash = web3_utils.call_contract_function(
            "reclamarRecompensa",
            [amount],
            sender=empresa
        )
        logger.info(f"Recompensa reclamada: {amount} por {empresa}, tx: {tx_hash}")
        return {"success": True, "tx_hash": tx_hash}
    except Exception as e:
        logger.error(f"[reclamar_recompensa] Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{empresa}/nft/mintear", summary="Mintea NFT de reconocimiento", response_description="Hash de la transacción")
async def mintear_nft_reconocimiento(empresa: str, uri: str):
    """
    Mintea un NFT de reconocimiento para la empresa
    """
    try:
        if not web3_utils.is_valid_address(empresa):
            raise ValueError("Wallet de empresa inválida")
        if not uri:
            raise ValueError("URI es obligatorio")
        tx_hash = web3_utils.call_contract_function(
            "mintearNFTReconocimiento",
            [uri],
            sender=empresa
        )
        logger.info(f"NFT minteado: {uri} para {empresa}, tx: {tx_hash}")
        return {"success": True, "tx_hash": tx_hash}
    except Exception as e:
        logger.error(f"[mintear_nft_reconocimiento] Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
# Endpoints administrativos protegidos
@router.post("/admin/setEcoNFT", summary="Configura dirección EcoNFT", response_description="Hash de la transacción")
async def set_eco_nft(address: str, owner: bool = Depends(is_owner)):
    try:
        if not web3_utils.is_valid_address(address):
            raise ValueError("Dirección EcoNFT inválida")
        tx_hash = web3_utils.call_contract_function("setEcoNFT", [address])
        logger.info(f"EcoNFT configurado: {address}, tx: {tx_hash}")
        return {"success": True, "tx_hash": tx_hash}
    except Exception as e:
        logger.error(f"[set_eco_nft] Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/admin/setRewardDistributor", summary="Configura dirección RewardDistributor", response_description="Hash de la transacción")
async def set_reward_distributor(address: str, owner: bool = Depends(is_owner)):
    try:
        if not web3_utils.is_valid_address(address):
            raise ValueError("Dirección RewardDistributor inválida")
        tx_hash = web3_utils.call_contract_function("setRewardDistributor", [address])
        logger.info(f"RewardDistributor configurado: {address}, tx: {tx_hash}")
        return {"success": True, "tx_hash": tx_hash}
    except Exception as e:
        logger.error(f"[set_reward_distributor] Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/admin/registrarSubcontrato", summary="Registra subcontrato", response_description="Hash de la transacción")
async def registrar_subcontrato(servicioId: str, subcontrato: str, owner: bool = Depends(is_owner)):
    try:
        if not web3_utils.is_valid_address(subcontrato):
            raise ValueError("Dirección de subcontrato inválida")
        tx_hash = web3_utils.call_contract_function("registrarSubcontrato", [servicioId, subcontrato])
        logger.info(f"Subcontrato registrado: {servicioId} -> {subcontrato}, tx: {tx_hash}")
        return {"success": True, "tx_hash": tx_hash}
    except Exception as e:
        logger.error(f"[registrar_subcontrato] Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/todas")
async def ver_todas_empresas():
    """
    Consulta todas las empresas registradas
    """
    try:
        empresas = web3_utils.call_contract_view("verTodasEmpresas", [])
        return {"success": True, "empresas": empresas}
    except Exception as e:
        logger.error(f"Error consultando empresas: {e}")
        raise HTTPException(status_code=500, detail=str(e))
