import { useState, useEffect } from 'react'

export function useWeb3() {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState('0')
  const [isLoading, setIsLoading] = useState(false)

  // Verificar conexión existente al cargar
  useEffect(() => {
    checkConnection()
    
    // Escuchar cambios de cuenta
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [])

  const checkConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setAccount(accounts[0])
          setIsConnected(true)
          await getBalance(accounts[0])
        }
      } catch (error) {
        console.error('Error verificando conexión:', error)
      }
    }
  }

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask no está instalado')
    }

    setIsLoading(true)
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      
      if (accounts.length > 0) {
        setAccount(accounts[0])
        setIsConnected(true)
        await getBalance(accounts[0])
        return accounts[0]
      }
    } catch (error) {
      console.error('Error conectando wallet:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAccount(null)
    setBalance('0')
  }

  const getBalance = async (address) => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest']
        })
        
        // Convertir de Wei a ETH
        const ethBalance = (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4)
        setBalance(ethBalance)
        return ethBalance
      } catch (error) {
        console.error('Error obteniendo balance:', error)
        return '0'
      }
    }
  }

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet()
    } else {
      setAccount(accounts[0])
      getBalance(accounts[0])
    }
  }

  const handleChainChanged = () => {
    // Recargar la página cuando cambie la red
    window.location.reload()
  }

  return {
    isConnected,
    account,
    balance,
    isLoading,
    connectWallet,
    disconnectWallet,
    getBalance
  }
}
