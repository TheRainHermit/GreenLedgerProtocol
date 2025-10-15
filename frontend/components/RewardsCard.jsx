'use client'

export default function RewardsCard() {
  return (
    <div className="eco-card ranking-card">
      <div className="flex items-center gap-4">
        <div className="w-6 h-6 bg-gradient-forest rounded-2xl flex items-center justify-center animate-pulse-green ranking-avatar">
          <span className="text-base">💎</span>
        </div>
        <div>
          <h2 className="text-lg font-bold text-forest mb-1">Tus Recompensas</h2>
          <p className="text-nature-light text-xs">PYUSD y logros ecológicos</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Balance disponible */}
        <div className="p-6 bg-nature rounded-xl border border-spring-green">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-nature-light mb-1">💰 Balance EcoVerde</div>
              <div className="text-3xl font-bold text-forest">125.50 PYUSD</div>
              <div className="text-xs text-leaf mt-1">≈ $125.50 USD</div>
            </div>
            <div className="w-6 h-6 bg-gradient-forest rounded-2xl flex items-center justify-center animate-pulse-green">
              <span className="text-base">💎</span>
            </div>
          </div>
        </div>

        {/* Pendiente por reclamar */}
        <div className="p-6 bg-gradient-forest rounded-xl border border-leaf">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-nature-light mb-1">🎁 Pendiente por Reclamar</div>
              <div className="text-3xl font-bold text-spring-green">45.25 PYUSD</div>
              <div className="eco-badge mt-2">¡Nuevo logro verde!</div>
            </div>
            <div className="w-6 h-6 bg-gradient-nature rounded-2xl flex items-center justify-center animate-wind-sway">
              <span className="text-base">💎</span>
            </div>
          </div>
        </div>

        {/* Métricas ambientales (compactas) */}
        <div className="p-3 bg-nature rounded-xl border border-spring-green">
          <h4 className="font-semibold text-forest mb-2 text-sm">🌱 Impacto Este Mes</h4>
          <div className="eco-grid eco-grid-2">
            <div className="text-center">
              <div className="text-base font-bold text-leaf">-2.4 T</div>
              <div className="text-xs text-nature-light">CO₂ Reducido</div>
            </div>
            <div className="text-center">
              <div className="text-base font-bold text-leaf">850 L</div>
              <div className="text-xs text-nature-light">Agua Ahorrada</div>
            </div>
          </div>
        </div>

        {/* Progreso mensual (barra compacta) */}
        <div className="p-3 bg-nature rounded-xl border border-spring-green">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-nature-light">🎯 Progreso Meta Verde</span>
            <span className="text-xs font-bold text-leaf">75%</span>
          </div>
          <div className="w-full bg-nature-light rounded-full h-1 overflow-hidden">
            <div 
              className="h-1 rounded-full bg-gradient-nature transition-all duration-1000 ease-out" 
              style={{width: '75%'}}
            ></div>
          </div>
          <p className="text-xs text-nature-light mt-1 flex items-center gap-1">
            <span>🌟</span>
            Meta mensual: 200 PYUSD
          </p>
        </div>

        {/* Próximas recompensas */}
        <div className="p-4 bg-gradient-forest rounded-xl border border-leaf">
          <h4 className="font-semibold text-forest mb-3">🚀 Próximas Recompensas</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-nature-light flex items-center gap-1">
                <span>📊</span>
                Reporte Mensual
              </span>
              <span className="text-leaf font-semibold">+15 PYUSD</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-nature-light flex items-center gap-1">
                <span>🌱</span>
                Carbon Offset
              </span>
              <span className="text-leaf font-semibold">+8 PYUSD</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-nature-light flex items-center gap-1">
                <span>♻️</span>
                Reciclaje NFT
              </span>
              <span className="text-leaf font-semibold">+12 PYUSD</span>
            </div>
          </div>
        </div>

        {/* Botón de acción */}
        <div className="space-y-3">
          <button className="eco-btn w-full">
            🎯 Reclamar Recompensas Verdes
          </button>
          <button className="eco-btn-secondary w-full">
            📊 Ver Historial Ecológico
          </button>
        </div>
      </div>
    </div>
  )
}
