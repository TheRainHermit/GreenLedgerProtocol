'use client'

import { useState, useEffect } from 'react'
import { MASTER_ECOLOGICAL_CONTRACT_ABI, MASTER_ECOLOGICAL_CONTRACT_ADDRESS } from '../hooks/useMasterEcologicalContract'

export default function WalletConnector() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [balances, setBalances] = useState({
    eth: '0.00',
    pyusd: '0.00'
  })
  const [isLoadingBalances, setIsLoadingBalances] = useState(false)
  const [loadingTimeout, setLoadingTimeout] = useState(false)
  const [balanceHistory, setBalanceHistory] = useState([])
  const [showComparison, setShowComparison] = useState(false)
  const [tokenBalances, setTokenBalances] = useState([])
  const [treasuryWallet, setTreasuryWallet] = useState('')
  const [txStatus, setTxStatus] = useState('')

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
            let balance = parseInt(balanceHex, 16) / Math.pow(10, token.decimals)
            if (isNaN(balance) || !isFinite(balance)) balance = 0
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

  // Obtener saldos reales de la wallet con timeout/fallback visual
  const fetchBalances = async (address) => {
    setIsLoadingBalances(true)
    setLoadingTimeout(false)
    let timeoutId = setTimeout(() => {
      setLoadingTimeout(true)
    }, 7000)
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const ethBalance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest']
        })
        const ethBalanceFormatted = (parseInt(ethBalance, 16) / Math.pow(10, 18)).toFixed(4)
        const tokens = await fetchTokenBalances(address)
        const pyusdToken = tokens.find(t => t.symbol === 'PYUSD')
        setBalances({
          eth: ethBalanceFormatted,
          pyusd: pyusdToken ? pyusdToken.balance : '0.00'
        })
        const newEntry = {
          timestamp: new Date().toISOString(),
          eth: ethBalanceFormatted,
          pyusd: pyusdToken ? pyusdToken.balance : '0.00'
        }
        setBalanceHistory(prev => [newEntry, ...prev.slice(0, 4)])
      } else {
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
        setBalanceHistory(prev => [newEntry, ...prev.slice(0, 4)])
      }
    } catch (error) {
      console.error('Error obteniendo saldos:', error)
      setBalances({ eth: '0.00', pyusd: '0.00' })
      setTokenBalances([])
    }
    clearTimeout(timeoutId)
    setIsLoadingBalances(false)
    setLoadingTimeout(false)
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

  // Acción demo para "Comprar Servicio Demo"
  const handleBuyService = async () => {
    if (!isConnected || !walletAddress) {
      alert('Por favor conecta la wallet primero.')
      return
    }
    setTxStatus('Iniciando transacción demo...')
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        // Enviamos una transacción demo de valor 0 al contrato maestro (no realiza cambios si el contrato lo evita)
        const params = [{
          from: walletAddress,
          to: MASTER_ECOLOGICAL_CONTRACT_ADDRESS,
          value: '0x0'
        }]
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params
        })
        setTxStatus(`Tx enviada: ${txHash}`)
      } else {
        alert('Proveedor Web3 no disponible.')
        setTxStatus('No hay proveedor Web3')
      }
    } catch (err) {
      console.error('Error enviando tx demo:', err)
      if (err && err.code === 4001) {
        setTxStatus('Transacción rechazada por el usuario')
      } else {
        setTxStatus('Error al enviar la transacción')
      }
    }
  }

  // Obtener la dirección de la wallet de comisiones del contrato
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const getTreasury = async () => {
        try {
          const provider = window.ethereum
          let ethers
          try { ethers = await import('ethers') } catch {}
          if (ethers) {
            const providerEthers = new ethers.BrowserProvider(provider)
            const contract = new ethers.Contract(
              MASTER_ECOLOGICAL_CONTRACT_ADDRESS,
              MASTER_ECOLOGICAL_CONTRACT_ABI,
              providerEthers
            )
            const treasury = await contract.treasury()
            setTreasuryWallet(treasury)
          } else {
            // fallback: usar eth_call
            const data = '0x8a8c523c' // selector de treasury()
            const result = await provider.request({
              method: 'eth_call',
              params: [
                { to: MASTER_ECOLOGICAL_CONTRACT_ADDRESS, data },
                'latest'
              ]
            })
            // Aquí podrías decodificar el resultado si lo necesitas
            setTreasuryWallet(result);
          }
        } catch (err) {
          setTreasuryWallet('');
        }
      };
      getTreasury();
    }
  }, []);
  // ...existing code...
  // Main render block
  return (
    <div className="eco-wallet-connector p-6 max-w-2xl mx-auto">
      {!isConnected ? (
        <div className="animate-leaf-grow">
          <p className="text-nature-light mb-6">
            <span className="text-4xl mr-2">🌱</span>
            Conecta tu wallet para acceder al ecosistema <span className="font-bold text-leaf">GreenLedger</span>
          </p>
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="eco-btn bg-gradient-to-r from-green-400 via-green-600 to-green-400 text-white shadow-lg hover:scale-105 transition-transform"
          >
            {isConnecting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-8 w-8 border-4 border-forest border-t-transparent rounded-full"></div>
                <span className="text-lg">🌱 Conectando...</span>
              </div>
            ) : (
              <><span className="text-2xl">🦊</span> <span className="ml-2">Conectar MetaMask</span></>
            )}
          </button>
          {isConnecting && (
            <div className="mt-4 text-leaf animate-pulse-green">
              <span>Esperando confirmación de MetaMask...</span>
            </div>
          )}
          <div className="mt-4 p-4 bg-nature rounded-lg border-2 border-spring-green shadow-md">
            <p className="text-sm text-nature-light">
              💡 <strong>Tip Ecológico:</strong> Con tu wallet conectada podrás recibir <span className="text-leaf font-bold">recompensas PYUSD</span> por tus acciones sostenibles
            </p>
          </div>
        </div>
      ) : (
        <div className="animate-fade-in">
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-4xl animate-bounce">🌱</span>
              <span className="font-semibold text-forest text-xl">¡EcoWallet Conectada!</span>
              <span className="text-2xl animate-pulse-green">🟢</span>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-200 via-green-100 to-green-200 rounded-lg border-2 border-leaf shadow-xl animate-slide-in">
              <div className="text-sm text-nature-light mb-1">Dirección Verde:</div>
              <div className="font-mono text-xs text-forest bg-nature p-2 rounded border-2 border-leaf">
                {walletAddress}
              </div>
            </div>
          </div>
          {/* Balances grid */}
          <div className="eco-grid eco-grid-3 mb-6">
            <div className="text-center p-3">
              <div className="text-3xl mb-2">⚡</div>
              <div className="font-semibold text-leaf">ETH</div>
              <div className="text-forest">
                {isLoadingBalances ? (
                  <div className="animate-spin h-8 w-8 border-4 border-forest border-t-transparent rounded-full mx-auto"></div>
                ) : loadingTimeout ? (
                  <div className="text-xs text-red-600 animate-pulse">⏳ La red está lenta, intenta recargar o cambiar de RPC.</div>
                ) : (
                  <span className="text-xl font-bold text-green-700">{balances.eth}</span>
                )}
              </div>
            </div>
            <div className="text-center p-3">
              <div className="text-3xl mb-2">💚</div>
              <div className="font-semibold text-leaf">PYUSD</div>
              <div className="text-forest">
                {isLoadingBalances ? (
                  <div className="animate-spin h-8 w-8 border-4 border-forest border-t-transparent rounded-full mx-auto"></div>
                ) : loadingTimeout ? (
                  <div className="text-xs text-red-600 animate-pulse">⏳ La red está lenta, intenta recargar o cambiar de RPC.</div>
                ) : (
                  <span className="text-xl font-bold text-green-700">{balances.pyusd}</span>
                )}
              </div>
            </div>
            <div className="text-center p-3">
              <div className="text-3xl mb-2">🪙</div>
              <div className="font-semibold text-leaf">Tokens</div>
              <div className="text-forest">
                {isLoadingBalances ? (
                  <div className="animate-spin h-8 w-8 border-4 border-forest border-t-transparent rounded-full mx-auto"></div>
                ) : loadingTimeout ? (
                  <div className="text-xs text-red-600 animate-pulse">⏳ La red está lenta, intenta recargar o cambiar de RPC.</div>
                ) : (
                  tokenBalances.map(t => (
                    <div key={t.symbol} className="text-green-800 font-bold">{t.symbol}: {t.balance}</div>
                  ))
                )}
              </div>
            </div>
          </div>
          {/* Historial de balances */}
          <div className="eco-panel bg-nature border-2 border-leaf rounded-lg p-4 animate-fade-in shadow-md mb-6">
            <div className="font-semibold text-forest mb-2">Historial de Balances</div>
            <ul className="text-xs text-nature-light">
              {balanceHistory.map((entry, idx) => (
                <li key={idx} className="mb-1">
                  <span className="font-mono">{entry.timestamp.slice(11,19)}</span> | ETH: <span className="font-bold text-leaf">{entry.eth}</span> | PYUSD: <span className="font-bold text-leaf">{entry.pyusd}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Acciones rápidas */}
          <div className="eco-panel bg-gradient-to-r from-green-300 via-green-100 to-green-300 border-2 border-leaf rounded-lg p-4 animate-slide-in shadow-lg mb-6">
            <div className="font-semibold text-forest mb-2">Acciones Rápidas</div>
            <button className="eco-btn mr-2 bg-green-600 text-white shadow-md hover:scale-105 transition-transform" onClick={handleBuyService}>Comprar Servicio Demo</button>
            <button className="eco-btn bg-red-500 text-white shadow-md hover:scale-105 transition-transform" onClick={disconnectWallet}>Desconectar</button>
            <div className="mt-2 text-xs text-nature-light">Wallet de comisiones: <span className="font-mono text-leaf">{treasuryWallet}</span></div>
            <div className="mt-2 text-xs text-nature-light">Estado Tx: <span className="font-mono text-leaf">{txStatus}</span></div>
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-green-200 via-green-100 to-green-200 rounded-lg border-2 border-spring-green animate-fade-in shadow-md">
            <p className="text-lg text-nature-light">
              🌱 <strong>¡Bienvenido al ecosistema GreenLedger!</strong> <span className="text-leaf">Explora tus recompensas, mintea NFTs y consulta tu score ambiental.</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

