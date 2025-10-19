from web3 import Web3
import os
from typing import Dict, Optional, Any
import logging

logger = logging.getLogger(__name__)

class Web3Utils:
    """Utilities for Web3 operations and wallet interactions"""
    
    def __init__(self):
        self.w3 = Web3()
        
    @staticmethod
    def is_valid_address(address: str) -> bool:
        """Check if address is a valid Ethereum address"""
        try:
            return Web3.isAddress(address)
        except Exception:
            return False
    
    @staticmethod
    def checksum_address(address: str) -> str:
        """Convert address to checksum format"""
        try:
            return Web3.toChecksumAddress(address)
        except Exception as e:
            logger.error(f"Invalid address format: {e}")
            raise ValueError("Invalid Ethereum address")
    
    def verify_signature(self, address: str, message: str, signature: str) -> bool:
        """Verify message signature against address"""
        try:
            message_hash = self.w3.keccak(text=message)
            recovered_address = self.w3.eth.account.recover_message(
                message_hash, 
                signature=signature
            )
            return recovered_address.lower() == address.lower()
        except Exception as e:
            logger.error(f"Signature verification failed: {e}")
            return False
    
    @staticmethod
    def format_balance(balance_wei: int, decimals: int = 18) -> str:
        """Format balance from wei to human readable"""
        return str(balance_wei / (10 ** decimals))
    
    def get_network_info(self) -> Dict:
        """Get current network information"""
        return {
            "name": "Ethereum Mainnet",
            "chain_id": 1,
            "rpc_url": os.getenv("ETH_RPC_URL", "https://eth-mainnet.alchemyapi.io/v2/your-api-key"),
            "pyusd_contract": "0x6c3ea9036406852006290770BEdFcAbA0e23A0e8"
        }
    
    def call_contract_function(self, function_name: str, args: list, sender: Optional[str] = None) -> str:
        """
        Llama a una función de escritura del contrato maestro, con validaciones para evitar errores de require.
        """
        # Validación de argumentos para funciones críticas
        if function_name == "registrarSubcontrato":
            servicioId, subcontrato = args
            if not self.is_valid_address(subcontrato):
                raise ValueError("Dirección de subcontrato inválida")
        if function_name in ["agregarRepresentante", "eliminarRepresentante", "registrarMetrica", "reclamarRecompensa", "mintearNFTReconocimiento"]:
            if sender is None or not self.is_valid_address(sender):
                raise ValueError("Wallet de empresa inválida o no registrada")
        # Mock de transacción exitosa
        logger.info(f"Calling contract function {function_name} with args {args} from {sender}")
        return "0xMOCK_TX_HASH"

    def call_contract_view(self, function_name: str, args: list) -> Any:
        """
        Llama a una función de solo lectura del contrato maestro, con ejemplos para subcontratos y demos.
        """
        logger.info(f"Calling contract view {function_name} with args {args}")
        # Ejemplos de datos para pruebas y demos
        if function_name == "consultarScore":
            return 88
        if function_name == "rankingEmpresas":
            return ["0xEmpresa1", "0xEmpresa2"]
        if function_name == "verMetricasEmpresa":
            return [{"tipo": "carbon_emissions", "valor": 120, "unidad": "kg_co2"}]
        if function_name == "verTodasEmpresas":
            return ["0xEmpresa1", "0xEmpresa2", "0xEmpresa3"]
        if function_name == "resolver":
            servicioId = args[0] if args else b""
            # Simula que el servicio1 está registrado
            if servicioId == b"servicio1":
                return "0xSubcontratoDemo"
            return "0x0000000000000000000000000000000000000000"
        # Demos
        if function_name == "demoConsultarScore":
            return 99
        if function_name == "demoRankingEmpresas":
            return ["0xDemo1", "0xDemo2"]
        if function_name == "demoResolver":
            return "0xSubcontratoDemo"
        return None