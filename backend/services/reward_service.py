"""
Reward Service - PYUSD rewards distribution system
Automated reward distribution based on environmental scores
"""

import os
import logging
from typing import Dict, Any, List, Optional
from decimal import Decimal
from datetime import datetime
import json

from web3 import Web3
from eth_account import Account

logger = logging.getLogger(__name__)

class Company:
    """Company model for reward system"""
    def __init__(self, id: str, name: str, wallet_address: str, eco_score: float, 
                 last_reward_date: Optional[str] = None, 
                 total_rewards_earned: Decimal = Decimal("0")):
        self.id = id
        self.name = name
        self.wallet_address = wallet_address
        self.eco_score = eco_score
        self.last_reward_date = last_reward_date
        self.total_rewards_earned = total_rewards_earned

class RewardDistribution:
    """Reward distribution model"""
    def __init__(self, company_id: str, amount: Decimal, eco_score: float, 
                 reward_date: str, transaction_hash: Optional[str] = None):
        self.company_id = company_id
        self.amount = amount
        self.eco_score = eco_score
        self.reward_date = reward_date
        self.transaction_hash = transaction_hash

class RewardService:
    """PYUSD reward distribution service"""
    
    def __init__(self):
        self.rpc_url = os.getenv("RPC_URL", "https://sepolia.infura.io/v3/YOUR_KEY")
        self.pyusd_contract_address = os.getenv("PYUSD_CONTRACT_ADDRESS", "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0")
        self.private_key = os.getenv("PRIVATE_KEY")
        self.pyusd_decimals = int(os.getenv("PYUSD_DECIMALS", "6"))
        
        self.w3 = Web3(Web3.HTTPProvider(self.rpc_url))
        self.monthly_reward_pool = Decimal("10000")
        
        self.pyusd_abi = [
            {
                "constant": False,
                "inputs": [
                    {"name": "_to", "type": "address"},
                    {"name": "_value", "type": "uint256"}
                ],
                "name": "transfer",
                "outputs": [{"name": "", "type": "bool"}],
                "type": "function"
            },
            {
                "constant": True,
                "inputs": [{"name": "_owner", "type": "address"}],
                "name": "balanceOf",
                "outputs": [{"name": "balance", "type": "uint256"}],
                "type": "function"
            }
        ]
        
        if self.w3.is_connected():
            self.pyusd_contract = self.w3.eth.contract(
                address=self.pyusd_contract_address,
                abi=self.pyusd_abi
            )
            logger.info("Connected to blockchain and PYUSD contract")
        else:
            self.pyusd_contract = None
            logger.warning("Could not connect to blockchain - using mock mode")
    
    def check_connection(self) -> bool:
        """Check blockchain connection status"""
        try:
            return self.w3.is_connected()
        except:
            return False
        
    async def calculate_rewards(self, companies: List[Company]) -> List[RewardDistribution]:
        """
        Calculate rewards based on company environmental scores
        Uses proportional distribution algorithm
        """
        try:
            logger.info(f"Calculating rewards for {len(companies)} companies")
            
            eligible_companies = [c for c in companies if c.eco_score >= 50.0]
            
            if not eligible_companies:
                logger.warning("No eligible companies for rewards")
                return []
            
            total_score = sum(c.eco_score for c in eligible_companies)
            
            distributions = []
            for company in eligible_companies:
                proportion = Decimal(str(company.eco_score)) / Decimal(str(total_score))
                reward_amount = self.monthly_reward_pool * proportion
                
                distribution = RewardDistribution(
                    company_id=company.id,
                    amount=reward_amount,
                    eco_score=company.eco_score,
                    reward_date="2024-10-11T12:00:00Z"
                )
                distributions.append(distribution)
                
                logger.info(f"{company.name}: {reward_amount:.2f} PYUSD (Score: {company.eco_score})")
            
            return distributions
            
        except Exception as e:
            logger.error(f"Error calculating rewards: {e}")
            return []
    
    async def distribute_rewards(self, distributions: List[RewardDistribution]) -> Dict[str, Any]:
        """
        Distribute PYUSD rewards to companies
        """
        try:
            logger.info(f"Distributing rewards to {len(distributions)} companies")
            
            successful_distributions = []
            failed_distributions = []
            
            for distribution in distributions:
                try:
                    tx_hash = await self._send_pyusd_reward(
                        distribution.company_id,
                        distribution.amount
                    )
                    
                    distribution.transaction_hash = tx_hash
                    successful_distributions.append(distribution)
                    
                    logger.info(f"Reward sent: {distribution.amount} PYUSD to {distribution.company_id}")
                    
                except Exception as e:
                    logger.error(f"Error sending reward to {distribution.company_id}: {e}")
                    failed_distributions.append({
                        "company_id": distribution.company_id,
                        "amount": float(distribution.amount),
                        "error": str(e)
                    })
            
            return {
                "status": "completed" if not failed_distributions else "partial",
                "successful_count": len(successful_distributions),
                "failed_count": len(failed_distributions),
                "successful_distributions": [
                    {
                        "company_id": d.company_id,
                        "amount": float(d.amount),
                        "tx_hash": d.transaction_hash
                    } for d in successful_distributions
                ],
                "failed_distributions": failed_distributions,
                "total_distributed": sum(float(d.amount) for d in successful_distributions)
            }
            
        except Exception as e:
            logger.error(f"Error in reward distribution: {e}")
            return {
                "status": "error",
                "error": str(e),
                "successful_count": 0,
                "failed_count": len(distributions)
            }
    
    async def _send_pyusd_reward(self, company_id: str, amount: Decimal) -> str:
        """
        Send PYUSD to a specific company
        """
        try:
            company_wallets = {
                "empresa_verde_1": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
                "empresa_verde_2": "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
                "empresa_verde_3": "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
                "empresa_verde_4": "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"
            }
            
            to_address = company_wallets.get(company_id)
            if not to_address:
                raise ValueError(f"Wallet not found for company {company_id}")
            
            if self.check_connection() and self.private_key and self.pyusd_contract:
                return await self._execute_blockchain_transfer(to_address, amount)
            else:
                mock_hash = f"0x{''.join([f'{ord(c):02x}' for c in f'{company_id}{amount}{datetime.now().isoformat()}'])[:64]}"
                logger.info(f"Mock transaction: {amount} PYUSD → {to_address}")
                return mock_hash
                
        except Exception as e:
            logger.error(f"Error sending PYUSD: {e}")
            raise
    
    async def _execute_blockchain_transfer(self, to_address: str, amount: Decimal) -> str:
        """
        Execute real blockchain transfer
        """
        try:
            if not self.private_key:
                raise ValueError("Private key not configured")
            
            account = Account.from_key(self.private_key)
            amount_wei = int(amount * (10 ** self.pyusd_decimals))
            nonce = self.w3.eth.get_transaction_count(account.address)
            
            transaction = self.pyusd_contract.functions.transfer(
                to_address,
                amount_wei
            ).build_transaction({
                'chainId': self.w3.eth.chain_id,
                'gas': 60000,
                'gasPrice': self.w3.eth.gas_price,
                'nonce': nonce,
            })
            
            signed_txn = self.w3.eth.account.sign_transaction(transaction, self.private_key)
            tx_hash = self.w3.eth.send_raw_transaction(signed_txn.raw_transaction)
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            logger.info(f"Transaction confirmed: {receipt.transactionHash.hex()}")
            return receipt.transactionHash.hex()
            
        except Exception as e:
            logger.error(f"Blockchain transaction error: {e}")
            raise
    
    def get_pyusd_balance(self, address: str) -> Decimal:
        """
        Get PYUSD balance for an address
        """
        try:
            if self.check_connection() and self.pyusd_contract:
                balance_wei = self.pyusd_contract.functions.balanceOf(address).call()
                balance = Decimal(balance_wei) / (10 ** self.pyusd_decimals)
                return balance
            else:
                return Decimal("1000.00")
        except Exception as e:
            logger.error(f"Error getting balance: {e}")
            return Decimal("0")
    
    async def get_leaderboard(self, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get company ranking by environmental score
        """
        try:
            logger.info(f"Generating leaderboard (top {limit})")
            
            companies = await self._get_all_companies()
            sorted_companies = sorted(companies, key=lambda x: x.eco_score, reverse=True)
            
            leaderboard = []
            for i, company in enumerate(sorted_companies[:limit], 1):
                leaderboard.append({
                    "rank": i,
                    "company_id": company.id,
                    "company_name": company.name,
                    "eco_score": company.eco_score,
                    "total_rewards": float(company.total_rewards_earned),
                    "last_reward_date": company.last_reward_date
                })
            
            return leaderboard
            
        except Exception as e:
            logger.error(f"Error generating leaderboard: {e}")
            return []
    
    async def get_company_rewards_history(self, company_id: str) -> List[Dict[str, Any]]:
        """
        Get reward history for a company
        """
        try:
            logger.info(f"Getting reward history for {company_id}")
            history = await self._get_rewards_history(company_id)
            return history
            
        except Exception as e:
            logger.error(f"Error getting history: {e}")
            return []
    
    async def check_health(self) -> str:
        """Verificar estado del servicio de recompensas"""
        try:
            # Verificar conexión RPC y contrato PYUSD
            if self.pyusd_contract and self.rpc_url:
                return "healthy"
            else:
                return "degraded"
        except:
            return "unhealthy"
    
    # Métodos mock para desarrollo (reemplazar con implementación real)
    async def _send_pyusd_reward(self, company_id: str, amount: Decimal) -> str:
        """Mock de envío de PYUSD"""
        import hashlib
        
        # Simular transacción
        tx_data = f"{company_id}{amount}{self.pyusd_contract}"
        tx_hash = hashlib.sha256(tx_data.encode()).hexdigest()
        
        return f"0x{tx_hash[:64]}"
    
    async def _get_all_companies(self) -> List[Company]:
        """Mock de obtención de empresas"""
        return [
            Company(
                id="empresa_verde_1",
                name="EcoTech Solutions",
                wallet_address="0x1234567890123456789012345678901234567890",
                eco_score=92.5,
                total_rewards_earned=Decimal("2500.50")
            ),
            Company(
                id="empresa_verde_2", 
                name="Sustainable Industries",
                wallet_address="0x0987654321098765432109876543210987654321",
                eco_score=87.3,
                total_rewards_earned=Decimal("1800.25")
            ),
            Company(
                id="empresa_verde_3",
                name="Green Manufacturing Co",
                wallet_address="0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
                eco_score=78.9,
                total_rewards_earned=Decimal("1200.75")
            ),
            Company(
                id="empresa_verde_4",
                name="Clean Energy Corp",
                wallet_address="0x1111222233334444555566667777888899990000",
                eco_score=65.2,
                total_rewards_earned=Decimal("850.00")
            )
        ]
    
    async def _get_rewards_history(self, company_id: str) -> List[Dict[str, Any]]:
        """Mock de historial de recompensas"""
        return [
            {
                "date": "2024-09-01T12:00:00Z",
                "amount": 425.50,
                "eco_score": 89.2,
                "transaction_hash": "0xabc123def456...",
                "status": "completed"
            },
            {
                "date": "2024-08-01T12:00:00Z", 
                "amount": 398.75,
                "eco_score": 87.8,
                "transaction_hash": "0xdef789abc012...",
                "status": "completed"
            }
        ]