from web3 import Web3
import os
from typing import Dict, Optional
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