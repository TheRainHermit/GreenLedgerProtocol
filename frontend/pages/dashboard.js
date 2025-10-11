'use client'

import { useWeb3 } from '@/hooks/useWeb3'
import ScoreDashboard from '@/components/ScoreDashboard'
import RewardsCard from '@/components/RewardsCard'
import { useEnvio } from '@/hooks/useEnvio'

export default function DashboardPage() {
  const { account, connect } = useWeb3()
  const { leaderboard, realTimeScores } = useEnvio()

  if (!account) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button 
          onClick={connect}
          className="bg-green-600 text-white px-8 py-4 rounded-lg text-xl hover:bg-green-700"
        >
          Connect Wallet to Continue
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ScoreDashboard />
          </div>
          <div className="lg:col-span-1">
            <RewardsCard />
          </div>
        </div>
      </div>
    </div>
  )
}