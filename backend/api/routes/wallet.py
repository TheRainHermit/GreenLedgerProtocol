from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict
import logging
import sys
import os
import time

logger = logging.getLogger(__name__)

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from services.wallet_service import WalletService

router = APIRouter()
wallet_service = WalletService()

class WalletConnectRequest(BaseModel):
    user_id: str
    address: str
    message: str
    signature: str

class WalletConnectResponse(BaseModel):
    address: str

@router.post("/connect")
async def connect_wallet(request: WalletConnectRequest):
    """Connect wallet extension to company account"""
    try:
        result = await wallet_service.connect_wallet(
            address=request.address,
            signature=request.signature,
            company_id=request.user_id
        )
        
        if result["success"]:
            return {
                "status": "success",
                "data": result,
                "message": "Wallet connected successfully"
            }
        else:
            raise HTTPException(status_code=400, detail=result["error"])
            
    except Exception as e:
        logger.error(f"Error connecting wallet: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/disconnect")
async def disconnect_wallet(request: WalletConnectRequest):
    """Disconnect wallet from system"""
    try:
        success = await wallet_service.disconnect_wallet(request.address)
        
        if success:
            return {
                "status": "success",
                "message": "Wallet disconnected successfully"
            }
        else:
            raise HTTPException(status_code=404, detail="Wallet not found")
            
    except Exception as e:
        logger.error(f"Error disconnecting wallet: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/getconnectedwallet/{company_id}")
async def get_wallet_status(company_id: str):
    """Get connected wallet address for a given company"""
    try:
        wallet_address = await wallet_service.get_connected_wallet(company_id)
        
        if wallet_address:
            balance = await wallet_service.get_wallet_balance(wallet_address)
            return {
                "status": "connected",
                "address": wallet_address,
                "balance": balance,
                "company_id": company_id
            }
        else:
            return {
                "status": "disconnected",
                "address": None,
                "company_id": company_id
            }
            
    except Exception as e:
        logger.error(f"Error getting wallet status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/balance/{address}")
async def get_wallet_balance_endpoint(address: str):
    """Get balance for a specific wallet address"""
    try:
        balance = await wallet_service.get_wallet_balance(address)
        return {
            "status": "success",
            "data": balance
        }
    except Exception as e:
        logger.error(f"Error getting balance: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/signature-message")
async def get_signature_message():
    """Get message to sign for wallet verification"""
    timestamp = int(time.time())
    message = f"Connect wallet to GreenLedger Protocol - {timestamp}"
    
    return {
        "message": message,
        "timestamp": timestamp,
        "instructions": "Sign this message with your wallet to verify ownership"
    }