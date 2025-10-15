import { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'

export default function ScoreDashboard() {
  const [currentScore, setCurrentScore] = useState(0)
  const [targetScore] = useState(850)
  const [animatedScore, setAnimatedScore] = useState(0)
  const { scores } = useApi()

  useEffect(() => {
    // Obtener puntaje actual desde la API
    if (scores && scores.length > 0) {
      setCurrentScore(scores[0].score || 750)
    } else {
      setCurrentScore(750) // Valor por defecto
    }
  }, [scores])

  useEffect(() => {
    // Animación del contador de puntaje
    let startValue = 0
    const duration = 2000
    const increment = currentScore / (duration / 16)

    const timer = setInterval(() => {
      startValue += increment
      if (startValue >= currentScore) {
        setAnimatedScore(currentScore)
        clearInterval(timer)
      } else {
        setAnimatedScore(Math.floor(startValue))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [currentScore])

  const scorePercentage = (currentScore / 1000) * 100
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (scorePercentage / 100) * circumference

  const getScoreColor = (score) => {
    if (score >= 800) return '#22c55e' // Verde
    if (score >= 600) return '#eab308' // Amarillo  
    if (score >= 400) return '#f97316' // Naranja
    return '#ef4444' // Rojo
  }

  const getScoreLevel = (score) => {
    if (score >= 900) return { level: 'Excelente', icon: '🌟', color: 'text-green-400' }
    if (score >= 750) return { level: 'Muy Bueno', icon: '🌿', color: 'text-green-300' }
    if (score >= 600) return { level: 'Bueno', icon: '🌱', color: 'text-yellow-400' }
    if (score >= 400) return { level: 'Regular', icon: '⚠️', color: 'text-orange-400' }
    return { level: 'Necesita Mejora', icon: '🔄', color: 'text-red-400' }
  }

  const scoreLevel = getScoreLevel(currentScore)

  return (
    <div className="space-y-6">
      <div className="eco-card ranking-card">
        <div className="w-6 h-6 bg-gradient-forest rounded-2xl flex items-center justify-center animate-pulse-green ranking-avatar">
          <span className="text-lg">📊</span>
        </div>
        <div className="ml-4">
          <h2 className="text-2xl font-bold text-forest mb-2">Dashboard Ambiental</h2>
          <p className="text-nature-light">Tu puntuación de sostenibilidad</p>
        </div>
      </div>
      {/* Score Principal Circular */}
      <div className="text-center mb-8 relative ranking-card">
        <div className="relative w-10 h-10 mx-auto mb-1">
          {/* SVG Chart */}
          <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 100 100">
            {/* Círculo de fondo */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="rgba(34, 197, 94, 0.1)"
              strokeWidth="8"
              fill="none"
            />
            {/* Círculo de progreso */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke={getScoreColor(currentScore)}
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-base font-bold text-white">
                {animatedScore}
              </div>
              <div className="text-xs text-nature-light">de 1000</div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-lg">{scoreLevel.icon}</span>
          <span className={`font-semibold ${scoreLevel.color}`}>{scoreLevel.level}</span>
        </div>
        <div className="bg-earth/20 rounded-full h-0.5 mb-1">
          <div 
            className="bg-gradient-nature h-0.5 rounded-full transition-all duration-1000"
            style={{ width: `${(currentScore / targetScore) * 100}%` }}
          />
        </div>
        <p className="text-sm text-nature-light">Siguiente objetivo: {targetScore} puntos</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
        <div className="eco-card metric-mini-card">
          <div className="text-base mb-1">🌱</div>
          <div className="text-sm font-bold text-spring-green">-15.2 kg</div>
          <div className="text-xs text-nature-light">CO₂ evitado esta semana</div>
        </div>
        <div className="eco-card metric-mini-card">
          <div className="text-base mb-1">⚡</div>
          <div className="text-sm font-bold text-spring-green">89%</div>
          <div className="text-xs text-nature-light">Energía renovable</div>
        </div>
        <div className="eco-card metric-mini-card">
          <div className="text-base mb-1">♻️</div>
          <div className="text-sm font-bold text-spring-green">12.5 kg</div>
          <div className="text-xs text-nature-light">Material reciclado</div>
        </div>
      </div>

  {/* Tendencia semanal */}
  <div className="eco-card ranking-card">
        <h3 className="text-sm font-semibold text-white mb-1">📈 Tendencia Semanal</h3>
        <div className="grid grid-cols-7 gap-0.5">
          {[750, 760, 755, 770, 765, 775, currentScore].map((score, index) => (
            <div key={index} className="text-center">
              <div 
                className="bg-gradient-nature rounded mb-0.5 animate-leaf-grow"
                style={{ 
                  height: `${(score / 1000) * 18}px`,
                  animationDelay: `${index * 100}ms`,
                  minWidth: '6px',
                  maxWidth: '12px',
                  margin: '0 auto'
                }}
              />
              <div className="text-xs text-nature-light">
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'][index]}
              </div>
            </div>
          ))}
        </div>
      </div>

  {/* Consejos ecológicos */}
  <div className="eco-card ranking-card">
        <h3 className="text-lg font-semibold text-white mb-4">💡 Recomendaciones</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-forest/20 rounded-lg">
            <span className="text-xl">🌿</span>
            <div>
              <div className="font-medium text-white">Reduce tu huella digital</div>
              <div className="text-sm text-nature-light">Configura modo oscuro en dispositivos (+5 pts)</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-forest/20 rounded-lg">
            <span className="text-xl">🚲</span>
            <div>
              <div className="font-medium text-white">Transporte sostenible</div>
              <div className="text-sm text-nature-light">Usa bicicleta o transporte público (+10 pts)</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-forest/20 rounded-lg">
            <span className="text-xl">💧</span>
            <div>
              <div className="font-medium text-white">Conserva agua</div>
              <div className="text-sm text-nature-light">Implementa sistemas de recolección (+8 pts)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
