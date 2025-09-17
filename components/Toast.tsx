import React, { useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

interface ToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  onClose: (id: string) => void
}

const Toast: React.FC<ToastProps> = ({ id, type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, 6000) // Auto close after 6 seconds

    return () => clearTimeout(timer)
  }, [id, onClose])

  const getIcon = () => {
    const iconClasses = "h-6 w-6"
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClasses} text-white`} />
      case 'error':
        return <XCircle className={`${iconClasses} text-white`} />
      case 'warning':
        return <AlertCircle className={`${iconClasses} text-white`} />
      case 'info':
        return <Info className={`${iconClasses} text-white`} />
      default:
        return <Info className={`${iconClasses} text-white`} />
    }
  }

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          background: 'bg-gradient-to-r from-green-500 to-emerald-600',
          iconBg: 'bg-green-600',
          shadow: 'shadow-green-200'
        }
      case 'error':
        return {
          background: 'bg-gradient-to-r from-red-500 to-rose-600',
          iconBg: 'bg-red-600',
          shadow: 'shadow-red-200'
        }
      case 'warning':
        return {
          background: 'bg-gradient-to-r from-yellow-500 to-orange-500',
          iconBg: 'bg-yellow-600',
          shadow: 'shadow-yellow-200'
        }
      case 'info':
        return {
          background: 'bg-gradient-to-r from-blue-500 to-indigo-600',
          iconBg: 'bg-blue-600',
          shadow: 'shadow-blue-200'
        }
      default:
        return {
          background: 'bg-gradient-to-r from-blue-500 to-indigo-600',
          iconBg: 'bg-blue-600',
          shadow: 'shadow-blue-200'
        }
    }
  }

  const styles = getStyles()

  return (
    <div className={`
      relative max-w-md w-full ${styles.background} rounded-xl shadow-2xl ${styles.shadow} 
      transform transition-all duration-500 ease-out 
      animate-in slide-in-from-right-full
      border border-white/20 backdrop-blur-sm
    `}>
      <div className="p-4">
        <div className="flex items-start">
          <div className={`
            flex-shrink-0 p-2 rounded-lg ${styles.iconBg} 
            shadow-lg transform transition-transform duration-200 hover:scale-110
          `}>
            {getIcon()}
          </div>
          <div className="ml-4 flex-1 min-w-0">
            <p className="text-white font-medium text-sm leading-relaxed break-words">
              {message}
            </p>
          </div>
          <div className="ml-2 flex-shrink-0">
            <button
              className="
                inline-flex items-center justify-center w-8 h-8 
                text-white/80 hover:text-white hover:bg-white/20 
                rounded-full transition-all duration-200 
                focus:outline-none focus:ring-2 focus:ring-white/50
              "
              onClick={() => onClose(id)}
            >
              <span className="sr-only">Close</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-xl overflow-hidden">
        <div className="h-full bg-white/40 animate-progress origin-left"></div>
      </div>
    </div>
  )
}

export default Toast