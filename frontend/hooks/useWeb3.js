import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

export function useWeb3() {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)

  const connect = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        })
        setAccount(accounts[0])
        const web3Provider = new ethers.BrowserProvider(window.ethereum)
        setProvider(web3Provider)
      } catch (error) {
        console.error('Error connecting wallet:', error)
      }
    }
  }

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || null)
      })
    }
  }, [])

  return { account, provider, connect }
}