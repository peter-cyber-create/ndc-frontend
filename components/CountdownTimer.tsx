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
          <p className="text-green-100 text-lg mb-2">The NACNDC & JASHConference 2025 is now live!</p>

          <div className="flex items-center justify-center text-green-200">
            <Sparkles className="h-5 w-5 mr-2 animate-spin" />
            <span className="text-sm font-medium">Join us now for an amazing experience!</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white rounded-2xl p-6 shadow-2xl border border-white/10">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-400/10 to-primary-500/10 animate-pulse"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="h-6 w-6 text-white mr-2" />
            <h3 className="text-xl font-bold text-white">
              Conference Countdown
            </h3>
          </div>
          <p className="text-primary-100 text-sm">November 3, 2025 • 9:00 AM EAT</p>
        </div>
        
        {/* Countdown Grid - Compact Design */}
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center group">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">
                {timeLeft.days.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-primary-100 font-medium uppercase tracking-wider">
                Days
              </div>
            </div>
          </div>
          
          <div className="text-center group">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-primary-100 font-medium uppercase tracking-wider">
                Hours
              </div>
            </div>
          </div>
          
          <div className="text-center group">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-primary-100 font-medium uppercase tracking-wider">
                Minutes
              </div>
            </div>
          </div>
          
          <div className="text-center group">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1 animate-pulse group-hover:scale-110 transition-transform duration-300">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-primary-100 font-medium uppercase tracking-wider">
                Seconds
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CountdownTimer
