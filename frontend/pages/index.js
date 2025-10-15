import { useState, useEffect } from 'react'
import WalletConnector from '../components/WalletConnector'
import ScoreDashboard from '../components/ScoreDashboard'
import LeaderBoard from '../components/LeaderBoard'
import RewardsCard from '../components/RewardsCard'
import Navigation from '../components/Navigation'

export default function Home() {
  const [apiStatus, setApiStatus] = useState('checking')
  const [companyData, setCompanyData] = useState(null)
  const [leaderboardData, setLeaderboardData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Verificar conexión con backend de forma silenciosa
  useEffect(() => {
    const checkAPI = async () => {
      try {
        const response = await fetch('http://localhost:8000/health')
        if (response.ok) {
          setApiStatus('connected')
          await loadData()
        } else {
          setApiStatus('error')
        }
      } catch (error) {
        setApiStatus('error')
        console.error('Backend connection error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const loadData = async () => {
      try {
        // Cargar datos de la empresa ejemplo silenciosamente
        const scoreResponse = await fetch('http://localhost:8000/api/v1/scores/empresa_verde_1')
        if (scoreResponse.ok) {
          const scoreData = await scoreResponse.json()
          setCompanyData(scoreData)
        }

        // Cargar leaderboard silenciosamente
        const leaderResponse = await fetch('http://localhost:8000/api/v1/rewards/leaderboard')
        if (leaderResponse.ok) {
          const leaderData = await leaderResponse.json()
          setLeaderboardData(leaderData.leaderboard || [])
        }
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }

    checkAPI()
  }, [])

  // Loading screen mejorado
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-8 relative">
            <div className="absolute inset-0 border-4 border-nature rounded-full"></div>
            <div className="absolute inset-0 border-4 border-leaf border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-4 flex items-center justify-center">
              <span className="text-3xl animate-pulse-green">🌱</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-forest mb-2 animate-pulse-green">
            Conectando con el Ecosistema Verde
          </h2>
          <p className="text-nature-light animate-wind-sway">
            Cargando datos ambientales...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="nature-container">
        {/* Header Ambiental Principal */}
        <div className="nature-header animate-leaf-grow">
          <div className="text-center">
            <h1 className="eco-title animate-wind-sway">
              🌿 GreenLedger Protocol
            </h1>
            <p className="eco-subtitle">
              Transformando la sostenibilidad en recompensas digitales
            </p>
            <div className="text-white/90 mb-4 text-lg">
              🌱 Midiendo el impacto ambiental • 🏆 Premiando la excelencia verde • 💚 Construyendo un futuro sostenible
            </div>
            
            {/* Indicador de conexión discreto */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
              <div className={`w-2 h-2 rounded-full ${
                apiStatus === 'connected' ? 'bg-green-400 animate-pulse-green' : 
                apiStatus === 'error' ? 'bg-red-400' : 'bg-yellow-400 animate-pulse'
              }`}></div>
              <span className="text-sm text-white/90">
                {apiStatus === 'connected' ? 'Ecosistema Activo' : 
                 apiStatus === 'error' ? 'Modo Demo' : 'Conectando...'}
              </span>
            </div>
          </div>
        </div>

        {/* Contenido principal con tema natural */}
        <>
          {/* Wallet Connector Ambiental */}
          <div className="eco-card text-center mb-8 animate-leaf-grow">
            <WalletConnector />
          </div>

          {/* Dashboard Grid Ambiental */}
          <div className="eco-grid eco-grid-2 mb-8">
            {/* Score Dashboard Ambiental */}
            <div className="animate-leaf-grow">
              <ScoreDashboard data={companyData} />
            </div>

            {/* Rewards Card Ambiental */}
            <div className="animate-leaf-grow">
              <RewardsCard />
            </div>
          </div>

          {/* Leaderboard Ambiental */}
          <div className="mb-8 animate-leaf-grow">
            <LeaderBoard data={leaderboardData} />
          </div>

          {/* Características del Ecosistema */}
          <div className="eco-card mb-8 animate-leaf-grow">
            <h3 className="text-2xl font-bold text-forest mb-6 text-center">
              🌍 Nuestro Impacto Ambiental
            </h3>
            <div className="eco-grid eco-grid-3">
              <div className="text-center p-6 bg-nature rounded-xl border border-spring-green hover:shadow-nature transition-all duration-300">
                <div className="text-5xl mb-4 animate-wind-sway">🌱</div>
                <h4 className="font-semibold text-leaf mb-3 text-lg">Carbon Tracking</h4>
                <p className="text-nature-light text-sm leading-relaxed">
                  Monitoreo preciso de emisiones de carbono en tiempo real con tecnología blockchain
                </p>
                <div className="mt-4 p-3 bg-gradient-forest rounded-lg text-white">
                  <div className="font-bold text-xl">-2,847 T</div>
                  <div className="text-xs opacity-90">CO₂ Reducido Este Mes</div>
                </div>
              </div>
              <div className="text-center p-6 bg-nature rounded-xl border border-spring-green hover:shadow-nature transition-all duration-300">
                <div className="text-5xl mb-4 animate-pulse-green">🏆</div>
                <h4 className="font-semibold text-leaf mb-3 text-lg">Green Rewards</h4>
                <p className="text-nature-light text-sm leading-relaxed">
                  Recompensas PYUSD automáticas por prácticas sostenibles verificadas
                </p>
                <div className="mt-4 p-3 bg-gradient-nature rounded-lg text-white">
                  <div className="font-bold text-xl">12,456 PYUSD</div>
                  <div className="text-xs opacity-90">Distribuidos Este Mes</div>
                </div>
              </div>
              <div className="text-center p-6 bg-nature rounded-xl border border-spring-green hover:shadow-nature transition-all duration-300">
                <div className="text-5xl mb-4 animate-wind-sway">📊</div>
                <h4 className="font-semibold text-leaf mb-3 text-lg">EcoScore</h4>
                <p className="text-nature-light text-sm leading-relaxed">
                  Puntuación transparente de sostenibilidad basada en métricas reales
                </p>
                <div className="mt-4 p-3 bg-gradient-earth rounded-lg text-white">
                  <div className="font-bold text-xl">87.3/100</div>
                  <div className="text-xs opacity-90">Promedio Global</div>
                </div>
              </div>
            </div>
          </div>

          {/* Métricas del Ecosistema en Tiempo Real */}
          <div className="eco-card mb-8 animate-leaf-grow">
            <h3 className="text-xl font-bold text-forest mb-6 text-center">
              📈 Métricas en Tiempo Real
            </h3>
            <div className="eco-grid eco-grid-4">
              <div className="text-center p-4 bg-gradient-forest rounded-lg text-white">
                <div className="text-3xl mb-2 animate-pulse-green">⚡</div>
                <div className="font-bold text-2xl">1,250 kWh</div>
                <div className="text-xs opacity-90">Energía Verde Generada</div>
              </div>
              <div className="text-center p-4 bg-gradient-nature rounded-lg text-white">
                <div className="text-3xl mb-2 animate-wind-sway">💧</div>
                <div className="font-bold text-2xl">3,890 L</div>
                <div className="text-xs opacity-90">Agua Conservada</div>
              </div>
              <div className="text-center p-4 bg-leaf rounded-lg text-white">
                <div className="text-3xl mb-2 animate-pulse-green">♻️</div>
                <div className="font-bold text-2xl">567 Kg</div>
                <div className="text-xs opacity-90">Residuos Reciclados</div>
              </div>
              <div className="text-center p-4 bg-spring-green rounded-lg text-white">
                <div className="text-3xl mb-2 animate-wind-sway">🌳</div>
                <div className="font-bold text-2xl">89</div>
                <div className="text-xs opacity-90">Árboles Plantados</div>
              </div>
            </div>
          </div>

          {/* Footer ambiental mejorado */}
          <div className="text-center mt-8 p-8 eco-card animate-leaf-grow">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-forest mb-3">
                💚 Únete al Movimiento Verde
              </h3>
              <p className="text-nature-light text-lg leading-relaxed max-w-2xl mx-auto">
                Cada acción cuenta. Juntos estamos construyendo un futuro más sostenible, 
                una transacción verde a la vez.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <button className="eco-btn">
                🌍 Explorar Documentación
              </button>
              <button className="eco-btn-secondary">
                📊 Analytics Ambientales
              </button>
              <button className="eco-btn-outline">
                🤝 Unirse a la Comunidad
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-nature-light">
              <div className="flex items-center gap-2">
                <span className="text-leaf">🔗</span>
                <span>Blockchain Verificado</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-leaf">🛡️</span>
                <span>Datos Seguros</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-leaf">🌿</span>
                <span>100% Carbon Neutral</span>
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  )
}