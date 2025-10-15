'use client'

import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Navigation() {
  const router = useRouter()

  const navItems = [
    { href: '/', label: 'EcoInicio', icon: '🌱' },
    { href: '/dashboard', label: 'EcoDashboard', icon: '📊' },
    { href: '/leaderboard', label: 'EcoRanking', icon: '🏆' }
  ]

  return (
    <nav className="eco-card mb-8 animate-leaf-grow">
      <div className="flex justify-center space-x-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-spring-green focus:ring-offset-2
              ${router.pathname === item.href
                ? 'bg-gradient-forest text-white shadow-nature eco-btn-active'
                : 'text-nature-light hover:text-forest hover:bg-nature eco-nav-item'}
            `}
          >
            <span className="text-xl animate-wind-sway" aria-hidden="true">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
      
      {/* Indicador de estado del ecosistema */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-nature rounded-full border border-spring-green">
          <div className="w-2 h-2 bg-leaf rounded-full animate-pulse-green"></div>
          <span className="text-xs text-nature-light">Ecosistema Activo</span>
        </div>
      </div>
    </nav>
  )
}
