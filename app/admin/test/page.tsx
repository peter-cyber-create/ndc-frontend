'use client'

import { useEffect, useState } from 'react'

export default function TestPage() {
  const [authStatus, setAuthStatus] = useState('checking...')
  const [localStorageData, setLocalStorageData] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token')
      const session = localStorage.getItem('admin_session')
      
      setLocalStorageData({
        token: token ? 'exists' : 'missing',
        session: session ? 'exists' : 'missing',
        sessionData: session ? JSON.parse(session) : null
      })
      
      if (token && session) {
        try {
          const sessionData = JSON.parse(session)
          const now = new Date().getTime()
          
          if (sessionData.expires && now < sessionData.expires) {
            setAuthStatus('authenticated')
          } else {
            setAuthStatus('session expired')
          }
        } catch (error) {
          setAuthStatus('invalid session')
        }
      } else {
        setAuthStatus('not authenticated')
      }
    }
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Authentication Test</h1>
      <div className="space-y-4">
        <div>
          <strong>Authentication Status:</strong> {authStatus}
        </div>
        <div>
          <strong>LocalStorage Data:</strong>
          <pre className="bg-gray-100 p-4 rounded mt-2">
            {JSON.stringify(localStorageData, null, 2)}
          </pre>
        </div>
        <div>
          <strong>Current Time:</strong> {new Date().toISOString()}
        </div>
      </div>
    </div>
  )
}
