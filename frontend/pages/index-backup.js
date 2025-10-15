import Navigation from '../components/Navigation'
import WalletConnector from '../components/WalletConnector'
import ScoreDashboard from '../components/ScoreDashboard'
import RewardsCard from '../components/RewardsCard'
import { useWeb3 } from '../hooks/useWeb3'

export default function Home() {
  const { isConnected } = useWeb3()

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <Navigation />
        
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            🌿 GreenLedger Protocol
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Plataforma de sostenibilidad con recompensas automatizadas en PYUSD
          </p>
        </div>

        <WalletConnector />

        {isConnected && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <ScoreDashboard />
            <RewardsCard />
          </div>
        )}

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="feature-card rounded-2xl p-8 shadow-medium">
            <div className="text-4xl mb-4 animate-pulse-slow">📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Score de Sostenibilidad</h3>
            <p className="text-gray-600 leading-relaxed">Mide y mejora tu impacto ambiental con métricas precisas y en tiempo real</p>
            <div className="mt-4 text-sm text-green-600 font-medium">Ver métricas →</div>
          </div>
          
          <div className="feature-card rounded-2xl p-8 shadow-medium">
            <div className="text-4xl mb-4 animate-pulse-slow">💰</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Recompensas PYUSD</h3>
            <p className="text-gray-600 leading-relaxed">Gana tokens automáticamente por alcanzar objetivos de sostenibilidad</p>
            <div className="mt-4 text-sm text-yellow-600 font-medium">Ganar tokens →</div>
          </div>
          
          <div className="feature-card rounded-2xl p-8 shadow-medium">
            <div className="text-4xl mb-4 animate-pulse-slow">🏆</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Ranking Global</h3>
            <p className="text-gray-600 leading-relaxed">Compite con otras empresas y lidera la transformación sostenible</p>
            <div className="mt-4 text-sm text-blue-600 font-medium">Ver ranking →</div>
          </div>
        </div>

        {/* Call to Action */}
        {!isConnected && (
          <div className="text-center mt-16 animate-fadeInUp">
            <div className="glass-card max-w-lg mx-auto p-8 rounded-2xl">
              <div className="text-5xl mb-4">�</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                ¡Únete a la Revolución Verde!
              </h3>
              <p className="text-gray-600 mb-6">
                Conecta tu wallet y comienza a ganar recompensas por hacer del mundo un lugar más sostenible
              </p>
              <div className="flex justify-center">
                <div className="animate-pulse">
                  <div className="text-sm text-green-600 font-medium">👆 Haz clic en "Conectar MetaMask" arriba</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
