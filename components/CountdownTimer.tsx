'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Clock, Sparkles, Zap } from 'lucide-react'

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const targetDate = new Date('2025-11-03T09:00:00+03:00').getTime()

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setIsExpired(true)
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (isExpired) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 text-white rounded-2xl p-8 text-center shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 animate-pulse"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-white/20 rounded-full mr-3 animate-bounce">
              <Calendar className="h-8 w-8" />
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
              Conference Started!
            </h3>
          </div>
          <p className="text-green-100 text-lg mb-2">The National Digital Health Conference 2025 is now live!</p>
          <div className="flex items-center justify-center text-green-200">
            <Sparkles className="h-5 w-5 mr-2 animate-spin" />
            <span className="text-sm font-medium">Join us now for an amazing experience!</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white rounded-3xl p-8 shadow-2xl border border-white/10">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 animate-pulse"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-white/10 rounded-full mr-4 backdrop-blur-sm border border-white/20">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Conference Countdown
              </h3>
              <div className="flex items-center justify-center mt-2">
                <Zap className="h-4 w-4 mr-2 text-yellow-300 animate-pulse" />
                <span className="text-yellow-300 text-sm font-medium">Live Countdown</span>
              </div>
            </div>
          </div>
          <p className="text-blue-100 text-xl font-semibold mb-2">National Digital Health Conference 2025</p>
          <p className="text-blue-200 text-lg">November 3, 2025 • 9:00 AM EAT</p>
        </div>
        
        {/* Countdown Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="text-center group">
            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl"></div>
              <div className="relative z-10">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  {timeLeft.days.toString().padStart(2, '0')}
                </div>
                <div className="text-sm md:text-base text-blue-100 font-medium uppercase tracking-wider">
                  Days
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center group">
            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl"></div>
              <div className="relative z-10">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  {timeLeft.hours.toString().padStart(2, '0')}
                </div>
                <div className="text-sm md:text-base text-blue-100 font-medium uppercase tracking-wider">
                  Hours
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center group">
            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl"></div>
              <div className="relative z-10">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </div>
                <div className="text-sm md:text-base text-blue-100 font-medium uppercase tracking-wider">
                  Minutes
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center group">
            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-2xl"></div>
              <div className="relative z-10">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300 animate-pulse">
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </div>
                <div className="text-sm md:text-base text-blue-100 font-medium uppercase tracking-wider">
                  Seconds
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center">
          <div className="flex items-center justify-center text-blue-100 mb-4">
            <Clock className="h-5 w-5 mr-2 animate-pulse" />
            <span className="text-lg font-medium">Time remaining until conference starts</span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-white/10 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-1000"
              style={{ 
                width: `${Math.max(0, Math.min(100, ((365 - timeLeft.days) / 365) * 100))}%` 
              }}
            ></div>
          </div>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-blue-200">
            <div className="flex items-center">
              <Sparkles className="h-4 w-4 mr-1" />
              <span>Digital Health Innovation</span>
            </div>
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-1" />
              <span>Networking & Learning</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CountdownTimer