import { useState, useEffect } from 'react'

export function useEnvio() {
  const [leaderboard, setLeaderboard] = useState([])
  const [realTimeScores, setRealTimeScores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMockData = async () => {
      try {
        setLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setLeaderboard([
          {
            id: 1,
            company: "EcoTech Solutions",
            score: 95,
            rewards: 2450.50,
            change: +5,
            location: "San Francisco, CA"
          },
          {
            id: 2,
            company: "Green Energy Corp", 
            score: 92,
            rewards: 2180.25,
            change: +2,
            location: "Austin, TX"
          },
          {
            id: 3,
            company: "Sustainable Industries", 
            score: 88,
            rewards: 1950.75,
            change: -1,
            location: "Portland, OR"
          },
          {
            id: 4,
            company: "CleanTech Innovations", 
            score: 85,
            rewards: 1750.00,
            change: +3,
            location: "Denver, CO"
          },
          {
            id: 5,
            company: "BioGreen Systems", 
            score: 82,
            rewards: 1650.50,
            change: 0,
            location: "Seattle, WA"
          }
        ])

        setRealTimeScores([
          { timestamp: Date.now(), score: 85 },
          { timestamp: Date.now() - 60000, score: 83 },
          { timestamp: Date.now() - 120000, score: 81 },
          { timestamp: Date.now() - 180000, score: 84 },
          { timestamp: Date.now() - 240000, score: 82 }
        ])
      } catch (error) {
        console.error('Error fetching Envio data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMockData()
  }, [])

  return {
    leaderboard,
    realTimeScores,
    loading,
    refreshData: () => {
      console.log('Refreshing Envio data...')
      setLoading(true)
      setTimeout(() => setLoading(false), 1000)
    }
  }
}
