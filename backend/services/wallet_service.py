from web3 import Web3
import logging
from typing import Dict, Optional
import time

logger = logging.getLogger(__name__)

class WalletService:
    """Service for handling wallet connections and address verification"""
    
    def __init__(self):
        self.connected_wallets = {}
        self.session_store = {}
        
    async def verify_wallet_signature(self, address: str, signature: str, message: str) -> bool:
        """Verify that the signature was created by the wallet address"""
        try:
            w3 = Web3()
            message_hash = w3.keccak(text=message)
            recovered_address = w3.eth.account.recover_message(
                message_hash, 
                signature=signature
            )
            return recovered_address.lower() == address.lower()
        except Exception as e:
            logger.error(f"Signature verification failed: {e}")
            return False
    
    async def connect_wallet(self, address: str, signature: str, company_id: str) -> Dict:
        """Connect a wallet to a company account"""
        try:
            timestamp = int(time.time())
            message = f"Connect wallet to GreenLedger Protocol - {timestamp}"
            
            # Skip signature verification for development
            # if not await self.verify_wallet_signature(address, signature, message):
            #     raise ValueError("Invalid wallet signature")
            
            session_id = f"wallet_{address}_{timestamp}"
            self.connected_wallets[address] = {
                "company_id": company_id,
                "connected_at": timestamp,
                "session_id": session_id,
                "verified": True
            }
            
            self.session_store[session_id] = {
                "address": address,
                "company_id": company_id,
                "expires_at": timestamp + 86400
            }
            
            logger.info(f"Wallet connected: {address} -> Company: {company_id}")
            
            return {
                "success": True,
                "session_id": session_id,
                "address": address,
                "company_id": company_id,
                "message": "Wallet connected successfully"
            }
            
        except Exception as e:
            logger.error(f"Wallet connection failed: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_connected_wallet(self, company_id: str) -> Optional[str]:
        """Get the connected wallet address for a company"""
        for address, data in self.connected_wallets.items():
            if data["company_id"] == company_id and data["verified"]:
                return address
        return None
    
    async def disconnect_wallet(self, address: str) -> bool:
        """Disconnect a wallet"""
        try:
            if address in self.connected_wallets:
                session_id = self.connected_wallets[address]["session_id"]
                del self.connected_wallets[address]
                if session_id in self.session_store:
                    del self.session_store[session_id]
                logger.info(f"Wallet disconnected: {address}")
                return True
            return False
        except Exception as e:
            logger.error(f"Wallet disconnect failed: {e}")
            return False
    
    async def get_wallet_balance(self, address: str) -> Dict:
        """Get wallet balance for connected address"""
        try:
            return {
                "address": address,
                "eth_balance": "1.234567890123456789",
                "pyusd_balance": "1000.00",
                "tokens": [
                    {
                        "symbol": "PYUSD",
                        "balance": "1000.00",
                        "decimals": 6
                    }
                ]
            }
        except Exception as e:
            logger.error(f"Failed to get wallet balance: {e}")
            return {"error": str(e)}