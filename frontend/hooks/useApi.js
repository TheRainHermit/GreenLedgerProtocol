// Hook para conectar con la API del backend
import { useState, useEffect } from 'react'

const API_BASE_URL = 'http://localhost:8000'

export function useApi() {
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`)
      setIsConnected(response.ok)
    } catch (error) {
      setIsConnected(false)
    }
    setLoading(false)
  }

  const get = async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`)
      if (response.ok) {
        return await response.json()
      }
      throw new Error(`API Error: ${response.status}`)
    } catch (error) {
      console.error('API GET Error:', error)
      throw error
    }
  }

  const post = async (endpoint, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        return await response.json()
      }
      throw new Error(`API Error: ${response.status}`)
    } catch (error) {
      console.error('API POST Error:', error)
      throw error
    }
  }

  return {
    isConnected,
    loading,
    get,
    post,
    checkConnection
  }
}

export function useCompanyScore(companyId) {
  const [score, setScore] = useState(null)
  const [loading, setLoading] = useState(true)
  const { get, isConnected } = useApi()

  useEffect(() => {
    if (isConnected && companyId) {
      loadScore()
    }
  }, [isConnected, companyId])

  const loadScore = async () => {
    try {
      setLoading(true)
      const data = await get(`/api/v1/scores/${companyId}`)
      setScore(data)
    } catch (error) {
      console.error('Error loading score:', error)
    }
    setLoading(false)
  }

  return { score, loading, loadScore }
}

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const { get, isConnected } = useApi()

  useEffect(() => {
    if (isConnected) {
      loadLeaderboard()
    }
  }, [isConnected])

  const loadLeaderboard = async () => {
    try {
      setLoading(true)
      const data = await get('/api/v1/rewards/leaderboard')
      setLeaderboard(data.leaderboard || [])
    } catch (error) {
      console.error('Error loading leaderboard:', error)
    }
    setLoading(false)
  }

  return { leaderboard, loading, loadLeaderboard }
}