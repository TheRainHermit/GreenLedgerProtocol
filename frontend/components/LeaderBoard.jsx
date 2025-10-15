'use client'

import { useState, useEffect } from 'react'

export default function LeaderBoard({ data = [] }) {
  const [animatedCompanies, setAnimatedCompanies] = useState([])
  const [selectedCompany, setSelectedCompany] = useState(null)

  const companies = data.length > 0 ? data.map(company => ({
    ...company,
    change: company.change || '0',
    category: company.category || 'General',
    carbonReduction: company.carbonReduction || 0,
    employees: company.employees || 0,
    certifications: company.certifications || []
  })) : [
    { 
      id: 1, 
      name: 'EcoTech Solutions', 
      score: 95, 
      rewards: 2450.50, 
      rank: 1, 
      change: '+5',
      category: 'Tecnología Verde',
      carbonReduction: 15.2,
      employees: 450,
      certifications: ['ISO 14001', 'Carbon Neutral']
    },
    { 
      id: 2, 
      name: 'Green Energy Corp', 
      score: 92, 
      rewards: 2180.25, 
      rank: 2, 
      change: '+2',
      category: 'Energía Renovable',
      carbonReduction: 12.8,
      employees: 320,
      certifications: ['LEED Gold', 'B Corp']
    },
    { 
      id: 3, 
      name: 'Sustainable Industries', 
      score: 88, 
      rewards: 1950.75, 
      rank: 3, 
      change: '-1',
      category: 'Manufactura',
      carbonReduction: 10.5,
      employees: 280,
      certifications: ['ISO 14001']
    },
    { 
      id: 4, 
      name: 'CleanTech Innovations', 
      score: 85, 
      rewards: 1750.00, 
      rank: 4, 
      change: '+3',
      category: 'Innovación',
      carbonReduction: 9.2,
      employees: 150,
      certifications: ['Green Seal', 'Energy Star']
    },
    { 
      id: 5, 
      name: 'BioGreen Systems', 
      score: 82, 
      rewards: 1650.50, 
      rank: 5, 
      change: '0',
      category: 'Biotecnología',
      carbonReduction: 7.8,
      employees: 190,
      certifications: ['Organic Certified']
    },
    { 
      id: 6, 
      name: 'Natural Tech Labs', 
      score: 79, 
      rewards: 1450.25, 
      rank: 6, 
      change: '+1',
      category: 'Investigación',
      carbonReduction: 6.5,
      employees: 120,
      certifications: ['Carbon Footprint']
    }
  ]

  // Animación de entrada de las empresas
  useEffect(() => {
    setAnimatedCompanies([])
    companies.forEach((company, index) => {
      setTimeout(() => {
        setAnimatedCompanies(prev => [...prev, company])
      }, index * 200)
    })
  }, [])

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return { icon: '🥇', color: 'text-yellow-500', bg: 'bg-yellow-100' }
      case 2: return { icon: '🥈', color: 'text-gray-500', bg: 'bg-gray-100' }
      case 3: return { icon: '🥉', color: 'text-orange-500', bg: 'bg-orange-100' }
      default: return { icon: '🌱', color: 'text-leaf', bg: 'bg-nature' }
    }
  }

  const getChangeColor = (change) => {
    if (!change || typeof change !== 'string') return 'bg-nature text-earth'
    if (change.startsWith('+')) return 'bg-leaf text-white'
    if (change.startsWith('-')) return 'bg-red-500 text-white'
    return 'bg-nature text-earth'
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'Tecnología Verde': '💻',
      'Energía Renovable': '⚡',
      'Manufactura': '🏭',
      'Innovación': '💡',
      'Biotecnología': '🧬',
      'Investigación': '🔬'
    }
    return icons[category] || '🏢'
  }

  return (
    <div className="eco-card animate-leaf-grow">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-forest rounded-2xl flex items-center justify-center animate-pulse-green">
          <span className="text-2xl">🏆</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-forest">
            🌍 Ranking EcoLíder
          </h2>
          <p className="text-nature-light">Las empresas más sostenibles del ecosistema</p>
        </div>
      </div>

      {/* Podio Visual para Top 3 */}
      <div className="mb-8 p-6 bg-gradient-forest rounded-xl">
        <h3 className="text-white font-bold text-center mb-6">🏆 Podio Verde</h3>
        <div className="flex justify-center items-end gap-4">
          {/* Segundo lugar */}
          {animatedCompanies[1] && (
            <div className="text-center animate-leaf-grow">
              <div className="w-6 h-4 bg-gray-300 rounded-t-lg flex items-end justify-center mb-0.5">
                <span className="text-lg mb-0.5">🥈</span>
              </div>
              <div className="text-white text-sm font-semibold">{animatedCompanies[1]?.name?.split(' ')[0] || 'N/A'}</div>
              <div className="text-nature text-xs">{animatedCompanies[1]?.score || 0}pts</div>
            </div>
          )}
          
          {/* Primer lugar */}
          {animatedCompanies[0] && (
            <div className="text-center animate-leaf-grow">
              <div className="w-6 h-4 bg-yellow-400 rounded-t-lg flex items-end justify-center mb-0.5">
                <span className="text-xl mb-0.5">🥇</span>
              </div>
              <div className="text-white text-sm font-bold">{animatedCompanies[0]?.name?.split(' ')[0] || 'N/A'}</div>
              <div className="text-nature text-xs">{animatedCompanies[0]?.score || 0}pts</div>
            </div>
          )}
          
          {/* Tercer lugar */}
          {animatedCompanies[2] && (
            <div className="text-center animate-leaf-grow">
              <div className="w-6 h-4 bg-orange-400 rounded-t-lg flex items-end justify-center mb-0.5">
                <span className="text-lg mb-0.5">🥉</span>
              </div>
              <div className="text-white text-sm font-semibold">{animatedCompanies[2]?.name?.split(' ')[0] || 'N/A'}</div>
              <div className="text-nature text-xs">{animatedCompanies[2]?.score || 0}pts</div>
            </div>
          )}
        </div>
      </div>

      {/* Lista Detallada de Empresas */}
      <div className="space-y-6">
        {animatedCompanies.map((company, index) => {
          const rankInfo = getRankIcon(company.rank)
          return (
            <div 
              key={company.id} 
              className="p-5 bg-white rounded-2xl border-2 border-spring-green/40 shadow-lg hover:shadow-2xl hover:border-spring-green transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
              onClick={() => setSelectedCompany(selectedCompany === company.id ? null : company.id)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 ${rankInfo.bg} rounded-xl flex items-center justify-center shadow-md`}>
                    <span className="text-2xl animate-wind-sway">
                      {rankInfo.icon}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-forest text-lg flex items-center gap-2">
                      <span>{company.name}</span>
                      <span className="text-xl">{getCategoryIcon(company.category)}</span>
                    </div>
                    <div className="text-sm text-nature-light flex items-center gap-2">
                      <span className="font-semibold">#{company.rank}</span>
                      <span>•</span>
                      <span>{company.category}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  {/* Score Visual */}
                  <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 px-3 py-2 rounded-lg">
                    <div className="relative w-8 h-8 mx-auto">
                      <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="28" fill="none" stroke="#e8f5e8" strokeWidth="5"/>
                        <circle 
                          cx="50" cy="50" r="28"
                          fill="none"
                          stroke={rankInfo.color}
                          strokeWidth="5"
                          strokeDasharray={2 * Math.PI * 28}
                          strokeDashoffset={2 * Math.PI * 28 * (1 - (company.score / 1000))}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-leaf">{company.score}</span>
                      </div>
                    </div>
                    <div className="text-xs text-nature-light mt-1">EcoScore</div>
                  </div>
                  
                  {/* Recompensas */}
                  <div className="text-center bg-gradient-to-br from-emerald-50 to-teal-50 px-3 py-2 rounded-lg">
                    <div className="text-lg font-bold text-forest flex items-center gap-1 justify-center">
                      <span>💚</span>
                      <span>{company.rewards}</span>
                    </div>
                    <div className="text-xs text-nature-light">PYUSD</div>
                  </div>
                  
                  {/* Cambio de posición */}
                  <div className="text-center">
                    <span
                      className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold shadow-md border-2 transition-all duration-200 ${getChangeColor(company.change)}`}
                      style={{ minWidth: 48, letterSpacing: '0.02em' }}
                    >
                      {company.change || '0'}
                    </span>
                    <div className="text-xs text-nature-light mt-1">Cambio</div>
                  </div>
                </div>
              </div>

              {/* Detalles expandibles */}
              {selectedCompany === company.id && (
                <div className="mt-6 pt-6 border-t border-spring-green animate-leaf-grow">
                  <div className="eco-grid eco-grid-3 mb-4">
                    <div className="text-center p-3 bg-gradient-forest rounded-lg text-white">
                      <div className="text-xl mb-1">��</div>
                      <div className="font-bold">{company.carbonReduction}T</div>
                      <div className="text-xs opacity-90">CO₂ Reducido</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-nature rounded-lg text-white">
                      <div className="text-xl mb-1">👥</div>
                      <div className="font-bold">{company.employees}</div>
                      <div className="text-xs opacity-90">Empleados</div>
                    </div>
                    <div className="text-center p-3 bg-leaf rounded-lg text-white">
                      <div className="text-xl mb-1">🏅</div>
                      <div className="font-bold">{company.certifications?.length || 0}</div>
                      <div className="text-xs opacity-90">Certificaciones</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-forest">🏅 Certificaciones:</h4>
                    <div className="flex flex-wrap gap-2">
                      {(company.certifications || []).map((cert, idx) => (
                        <span key={idx} className="px-3 py-1 bg-nature border border-spring-green rounded-full text-xs text-forest">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Estadísticas del ecosistema */}
      <div className="mt-8 p-6 bg-gradient-forest rounded-xl text-white">
        <h4 className="font-semibold text-center mb-4">
          📊 Estadísticas del Ecosistema Verde
        </h4>
        <div className="eco-grid eco-grid-4 text-center">
          <div>
            <div className="text-2xl font-bold">{companies.length}</div>
            <div className="text-xs opacity-90">Empresas Activas</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {(companies.reduce((sum, c) => sum + c.score, 0) / companies.length).toFixed(1)}
            </div>
            <div className="text-xs opacity-90">Score Promedio</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {companies.reduce((sum, c) => sum + c.rewards, 0).toFixed(0)}
            </div>
            <div className="text-xs opacity-90">PYUSD Total</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {companies.reduce((sum, c) => sum + c.carbonReduction, 0).toFixed(1)}T
            </div>
            <div className="text-xs opacity-90">CO₂ Total</div>
          </div>
        </div>
      </div>
    </div>
  )
}
