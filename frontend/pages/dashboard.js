import Navigation from '../components/Navigation'
import WalletConnector from '../components/WalletConnector'
import ScoreDashboard from '../components/ScoreDashboard'
import RewardsCard from '../components/RewardsCard'
import LeaderBoard from '../components/LeaderBoard'
import { useWeb3 } from '../hooks/useWeb3'
import AdminRegisterSubcontract from '../components/AdminRegisterSubcontract'

export default function DashboardPage() {
  const { isConnected, connectWallet } = useWeb3()

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">
        <div className="glass-card p-8 max-w-md w-full mx-4 animate-fadeInUp">
          <h2 className="text-2xl font-bold text-center mb-6 text-gradient">
            Acceso al Dashboard
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Conecta tu wallet para acceder al panel de sostenibilidad
          </p>
          <button 
            onClick={connectWallet}
            className="wallet-btn btn-primary w-full py-4 rounded-xl text-lg font-semibold"
          >
            🦊 Conectar MetaMask
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 flex flex-col justify-between">
      <div className="container mx-auto px-4 py-8 flex-1">
        <Navigation />
        {/* Header ambiental mejorado */}
        <header className="nature-header mb-10 animate-fadeInUp">
          <div className="flex flex-col items-center gap-2">
            <span className="text-5xl md:text-6xl animate-wind-sway">🌱</span>
            <h1 className="eco-title mb-1">Dashboard Sostenible</h1>
            <p className="eco-subtitle text-center max-w-xl mx-auto">
              Panel de control para tu empresa sostenible. Visualiza tu puntuación, recompensas y posición en el ecosistema verde.
            </p>
          </div>
        </header>

        <div className="mb-8">
          <WalletConnector />
        </div>

        {/* Interfaz admin para registrar subcontratos */}
        <AdminRegisterSubcontract />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ScoreDashboard />
          <RewardsCard />
        </div>

        <section className="mb-12 animate-leaf-grow">
          <LeaderBoard />
        </section>
      </div>
      {/* Footer ambiental */}
      <footer className="w-full py-6 bg-gradient-to-r from-emerald-100 via-teal-100 to-blue-100 text-center text-xs text-forest opacity-80 border-t border-spring-green">
        GreenLedger Protocol © {new Date().getFullYear()} — Por un futuro más verde 🌿
      </footer>
    </div>
  )
}
