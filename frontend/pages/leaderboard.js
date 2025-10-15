import LeaderBoard from '../components/LeaderBoard'
import WalletConnector from '../components/WalletConnector'
import Navigation from '../components/Navigation'

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fadeInUp">
          <h1 className="text-4xl font-bold hero-title mb-2">
            🏆 Ranking Global de Sostenibilidad
          </h1>
          <p className="text-gray-600">
            Las empresas más comprometidas con el medio ambiente
          </p>
        </div>

        <WalletConnector />

        <div className="mt-8">
          <LeaderBoard />
        </div>
      </div>
    </div>
  )
}
