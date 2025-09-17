'use client'

import React from 'react'
import Toast from './Toast'
import { useToast } from '../lib/ToastContext'

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <>
      {/* Fixed positioned container for top-right toasts */}
      <div className="fixed top-6 right-6 z-[9999] space-y-3 pointer-events-none max-w-md">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              id={toast.id}
              type={toast.type}
              message={toast.message}
              onClose={removeToast}
            />
          </div>
        ))}
      </div>
      
      {/* Backdrop overlay for better visibility on busy pages */}
      <div className="fixed inset-0 z-[9998] pointer-events-none bg-black/5 backdrop-blur-[1px] transition-opacity duration-300" />
    </>
  )
}

export default ToastContainer

