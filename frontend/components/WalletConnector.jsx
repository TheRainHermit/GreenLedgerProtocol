'use client'

import { useState, useEffect } from 'react'

export default function WalletConnector() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [balances, setBalances] = useState({
    eth: '0.00',
    pyusd: '0.00'
  })
  const [isLoadingBalances, setIsLoadingBalances] = useState(false)
  const [balanceHistory, setBalanceHistory] = useState([])
  const [showComparison, setShowComparison] = useState(false)
  const [tokenBalances, setTokenBalances] = useState([])

  // Lista de tokens ERC-20 populares (puedes agregar más)
  const ERC20_TOKENS = [
    {
      symbol: 'PYUSD',
      address: '0x6c3ea9036406852006290770bedfcaba0e23a0e8', // ejemplo, reemplaza por el real si es necesario
      decimals: 18
    },
    {
      symbol: 'USDT',
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      decimals: 6
    },
    {
      symbol: 'USDC',
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      decimals: 6
    },
    {
      symbol: 'DAI',
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      decimals: 18
    }
  ]

  // ABI mínima para balanceOf
  const ERC20_ABI = [
    {
      constant: true,
      inputs: [ { name: '_owner', type: 'address' } ],
      name: 'balanceOf',
      outputs: [ { name: 'balance', type: 'uint256' } ],
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'decimals',
      outputs: [ { name: '', type: 'uint8' } ],
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'symbol',
      outputs: [ { name: '', type: 'string' } ],
      type: 'function'
    }
  ]

  // Verificar conexión existente al cargar el componente
  useEffect(() => {
    checkExistingConnection()
    
    // Listener para cambios de cuenta
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else {
          setWalletAddress(accounts[0])
          setIsConnected(true)
          fetchBalances(accounts[0])
        }
      }

      const handleChainChanged = () => {
        // Recargar balances cuando cambie la red
        if (isConnected && walletAddress) {
          fetchBalances(walletAddress)
        }
      }

      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [])

  // Verificar si ya hay una conexión de wallet
  const checkExistingConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setWalletAddress(accounts[0])
          setIsConnected(true)
          await fetchBalances(accounts[0])
        }
      } catch (error) {
        console.error('Error verificando conexión existente:', error)
      }
    }
  }

  // Consulta balances de tokens ERC-20
  const fetchTokenBalances = async (address) => {
    if (typeof window === 'undefined' || !window.ethereum) return []
    try {
      const provider = window.ethereum
      const results = await Promise.all(
        ERC20_TOKENS.map(async (token) => {
          try {
            // Usar eth_call para balanceOf
            const data =
              '0x70a08231000000000000000000000000' +
              address.replace('0x', '').toLowerCase().padStart(40, '0')
            const balanceHex = await provider.request({
              method: 'eth_call',
              params: [
                {
                  to: token.address,
                  data
                },
                'latest'
              ]
            })
            const balance = parseInt(balanceHex, 16) / Math.pow(10, token.decimals)
            return { symbol: token.symbol, balance: balance.toFixed(4) }
          } catch (err) {
            return { symbol: token.symbol, balance: '0.0000' }
          }
        })
      )
      setTokenBalances(results)
      return results
    } catch (err) {
      setTokenBalances([])
      return []
    }
  }

  // Obtener saldos reales de la wallet
  const fetchBalances = async (address) => {
    setIsLoadingBalances(true)
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        // Obtener balance de ETH
        const ethBalance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest']
        })
        const ethBalanceFormatted = (parseInt(ethBalance, 16) / Math.pow(10, 18)).toFixed(4)
        // Obtener balances de tokens
        await fetchTokenBalances(address)
        // PYUSD (si está en la lista de tokens)
        const pyusdToken = tokenBalances.find(t => t.symbol === 'PYUSD')
        setBalances({
          eth: ethBalanceFormatted,
          pyusd: pyusdToken ? pyusdToken.balance : '0.00'
        })

        // Guardar en historial para comparación
        const newEntry = {
          timestamp: new Date().toISOString(),
          eth: ethBalanceFormatted,
          pyusd: pyusdToken ? pyusdToken.balance : '0.00'
        }
        setBalanceHistory(prev => [newEntry, ...prev.slice(0, 4)]) // Mantener últimas 5 entradas
      } else {
        // Demo
        setBalances({ eth: '0.1234', pyusd: '156.80' })
        setTokenBalances([
          { symbol: 'PYUSD', balance: '156.80' },
          { symbol: 'USDT', balance: '0.00' },
          { symbol: 'USDC', balance: '0.00' },
          { symbol: 'DAI', balance: '0.00' }
        ])
        const newEntry = {
          timestamp: new Date().toISOString(),
          eth: '0.1234',
          pyusd: '156.80'
        }
        setBalanceHistory(prev => [newEntry, ...prev.slice(0, 4)]) // Mantener últimas 5 entradas
      }
    } catch (error) {
      console.error('Error obteniendo saldos:', error)
      // Usar valores por defecto en caso de error
      setBalances({
        eth: '0.00',
        pyusd: '0.00'
      })
      setTokenBalances([])
    }
    setIsLoadingBalances(false)
  }

  const connectWallet = async () => {
    setIsConnecting(true)
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        })
        if (accounts.length > 0) {
          setWalletAddress(accounts[0])
          setIsConnected(true)
          await fetchBalances(accounts[0])
        }
      } else {
        // Mostrar mensaje de que necesita MetaMask
        alert('Por favor instala MetaMask para conectar tu wallet')
        setIsConnecting(false)
        return
      }
    } catch (error) {
      console.error('Error conectando wallet:', error)
      if (error.code === 4001) {
        alert('Conexión rechazada por el usuario')
      } else {
        alert('Error conectando la wallet. Por favor intenta de nuevo.')
      }
    }
    setIsConnecting(false)
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setWalletAddress('')
    setBalances({
      eth: '0.00',
      pyusd: '0.00'
    })
  }

  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold text-forest mb-6 animate-wind-sway">
        🌿 EcoWallet Connector
      </h3>
      
      {!isConnected ? (
        <div className="animate-leaf-grow">
          <p className="text-nature-light mb-6">
            Conecta tu wallet para acceder al ecosistema GreenLedger
          </p>
          
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="eco-btn"
          >
            {isConnecting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-forest border-t-transparent rounded-full"></div>
                <span>🌱 Conectando...</span>
              </div>
            ) : (
              <>🦊 Conectar MetaMask</>
            )}
          </button>
          
          <div className="mt-4 p-4 bg-nature rounded-lg border border-spring-green">
            <p className="text-sm text-nature-light">
              💡 <strong>Tip Ecológico:</strong> Con tu wallet conectada podrás recibir recompensas PYUSD por tus acciones sostenibles
            </p>
          </div>
        </div>
      ) : (
        <div className="animate-leaf-grow">
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl animate-pulse-green">🌟</span>
              <span className="font-semibold text-forest">EcoWallet Conectada</span>
            </div>
            
            <div className="p-4 bg-gradient-forest rounded-lg border border-leaf">
              <div className="text-sm text-nature-light mb-1">Dirección Verde:</div>
              <div className="font-mono text-xs text-forest bg-nature p-2 rounded border">
                {walletAddress}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="eco-grid eco-grid-3">
              <div className="text-center p-3">
                <div className="text-2xl mb-2">⚡</div>
                <div className="font-semibold text-leaf">ETH</div>
                <div className="text-forest">
                  {isLoadingBalances ? (
                    <div className="animate-spin h-4 w-4 border-2 border-forest border-t-transparent rounded-full mx-auto"></div>
                  ) : (
                    balances.eth
                  )}
                </div>
              </div>
              <div className="text-center p-3">
                <div className="text-2xl mb-2">💚</div>
                <div className="font-semibold text-leaf">PYUSD</div>
                <div className="text-forest">
                  {isLoadingBalances ? (
                    <div className="animate-spin h-4 w-4 border-2 border-forest border-t-transparent rounded-full mx-auto"></div>
                  ) : (
                    balances.pyusd
                  )}
                </div>
              </div>
              <div className="text-center p-3">
                <div className="text-2xl mb-2">🏆</div>
                <div className="font-semibold text-leaf">Ranking</div>
                <div className="text-forest">#12</div>
              </div>
            </div>
            {/* Lista de tokens */}
            <div className="mt-4 bg-nature/30 rounded-lg p-4">
              <div className="font-semibold text-nature-light mb-2">Tus Criptomonedas:</div>
              <ul className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <li className="text-forest font-bold">ETH: {balances.eth}</li>
                {tokenBalances.map(token => (
                  <li key={token.symbol} className="text-forest">
                    {token.symbol}: <span className="font-bold">{token.balance}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex gap-3 justify-center mt-4">
            <button 
              onClick={() => fetchBalances(walletAddress)}
              disabled={isLoadingBalances}
              className="eco-btn eco-btn-secondary"
            >
              {isLoadingBalances ? '🔄 Actualizando...' : '💰 Actualizar Saldos'}
            </button>
            <button 
              onClick={() => setShowComparison(!showComparison)}
              className="eco-btn eco-btn-secondary"
            >
              📊 {showComparison ? 'Ocultar' : 'Ver'} Historial
            </button>
            <button className="eco-btn eco-btn-secondary">
              🌍 Ver Transacciones
            </button>
            <button 
              onClick={() => alert('Funcionalidad de compra simulada. Integra contrato para compra real.')}
              className="eco-btn bg-gradient-to-r from-green-500 to-green-700 text-white font-bold border-2 border-green-600 shadow hover:scale-105 transition-all"
              style={{ minWidth: 160 }}
            >
              🛒 Comprar PYUSD
            </button>
            <button 
              onClick={disconnectWallet}
              className="eco-btn bg-gradient-to-r from-red-500 to-orange-400 text-white font-bold border-2 border-red-600 shadow-lg hover:scale-105 transition-all"
              style={{ minWidth: 160 }}
            >
              🔌 Desconectar
            </button>
          </div>

          {/* Sección de comparación de saldos */}
          {showComparison && balanceHistory.length > 0 && (
            <div className="mt-6 eco-card">
              <h4 className="text-lg font-semibold text-white mb-4">📈 Historial de Saldos</h4>
              <div className="space-y-2">
                {balanceHistory.slice(0, 3).map((entry, index) => {
                  const isLatest = index === 0
                  const previous = balanceHistory[index + 1]
                  const ethChange = previous ? (parseFloat(entry.eth) - parseFloat(previous.eth)).toFixed(4) : 0
                  const pyusdChange = previous ? (parseFloat(entry.pyusd) - parseFloat(previous.pyusd)).toFixed(2) : 0
                  
                  return (
                    <div key={entry.timestamp} className={`p-3 rounded-lg ${isLatest ? 'bg-spring-green/10 border border-spring-green' : 'bg-forest/20'}`}>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-nature-light">
                          {new Date(entry.timestamp).toLocaleString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          {isLatest && <span className="ml-2 text-spring-green font-semibold">• ACTUAL</span>}
                        </div>
                        <div className="flex gap-4 text-sm">
                          <div className="text-center">
                            <div className="text-white font-medium">{entry.eth} ETH</div>
                            {previous && (
                              <div className={`text-xs ${ethChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {ethChange >= 0 ? '+' : ''}{ethChange}
                              </div>
                            )}
                          </div>
                          <div className="text-center">
                            <div className="text-white font-medium">{entry.pyusd} PYUSD</div>
                            {previous && (
                              <div className={`text-xs ${pyusdChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {pyusdChange >= 0 ? '+' : ''}{pyusdChange}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {balanceHistory.length > 1 && (
                <div className="mt-4 p-3 bg-nature/10 rounded-lg">
                  <div className="text-sm text-nature-light text-center">
                    💡 Comparación con la transacción anterior:
                    <div className="flex justify-center gap-6 mt-2">
                      <span className="text-white">
                        ETH: {((parseFloat(balanceHistory[0]?.eth || 0) - parseFloat(balanceHistory[1]?.eth || 0)) >= 0 ? '+' : '')}
                        {(parseFloat(balanceHistory[0]?.eth || 0) - parseFloat(balanceHistory[1]?.eth || 0)).toFixed(4)}
                      </span>
                      <span className="text-white">
                        PYUSD: {((parseFloat(balanceHistory[0]?.pyusd || 0) - parseFloat(balanceHistory[1]?.pyusd || 0)) >= 0 ? '+' : '')}
                        {(parseFloat(balanceHistory[0]?.pyusd || 0) - parseFloat(balanceHistory[1]?.pyusd || 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
