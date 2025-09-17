'use client'

import React from 'react'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/button'

export default function ToastTestPage() {
  const { success, error, warning, info } = useToast()

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Toast Test Page</h1>
        
        <div className="space-y-4">
          <Button 
            onClick={() => success('Success message! This is a test success notification.')}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Test Success Toast
          </Button>
          
          <Button 
            onClick={() => error('Error message! This is a test error notification.')}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            Test Error Toast
          </Button>
          
          <Button 
            onClick={() => warning('Warning message! This is a test warning notification.')}
            className="w-full bg-yellow-600 hover:bg-yellow-700"
          >
            Test Warning Toast
          </Button>
          
          <Button 
            onClick={() => info('Info message! This is a test info notification.')}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Test Info Toast
          </Button>
        </div>
        
        <div className="mt-8 text-center">
          <a href="/" className="text-blue-600 hover:text-blue-800 underline">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
