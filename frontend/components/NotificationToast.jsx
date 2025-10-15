'use client'

import { useState, useEffect } from 'react'

export default function NotificationToast({ message, type = 'success', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      if (onClose) onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
      case 'warning':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
      case 'info':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      default:
        return '📢'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideInRight">
      <div className={`${getTypeStyles()} px-6 py-4 rounded-2xl shadow-large max-w-sm`}>
        <div className="flex items-center gap-3">
          <span className="text-xl">{getIcon()}</span>
          <span className="font-medium">{message}</span>
          <button 
            onClick={() => {
              setIsVisible(false)
              if (onClose) onClose()
            }}
            className="ml-auto text-white/80 hover:text-white text-xl"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}