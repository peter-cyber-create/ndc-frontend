import { useState, useCallback } from 'react'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }
    setToasts(prev => [...prev, newToast])
    
    // Auto remove after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, toast.duration || 5000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const success = useCallback((title: string, message: string, duration?: number) => {
    addToast({ type: 'success', title, message, duration })
  }, [addToast])

  const error = useCallback((title: string, message: string, duration?: number) => {
    addToast({ type: 'error', title, message, duration })
  }, [addToast])

  const warning = useCallback((title: string, message: string, duration?: number) => {
    addToast({ type: 'warning', title, message, duration })
  }, [addToast])

  const info = useCallback((title: string, message: string, duration?: number) => {
    addToast({ type: 'info', title, message, duration })
  }, [addToast])

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}
