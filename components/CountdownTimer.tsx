'use client'

import React, { useState, useEffect } from "react"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isExpired, setIsExpired] = useState(false)

  // Conference start date: November 3rd, 2025 at 9:00 AM EAT
  const targetDate = new Date("2025-11-03T09:00:00+03:00").getTime()

  useEffect(() => {
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
      <div className="text-center py-8">
        <div className="text-4xl font-bold text-green-600 mb-2">�� Conference Started!</div>
        <p className="text-gray-600">The conference is now live!</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
      <h2 className="text-2xl font-bold mb-6">Conference Starts In</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/20 rounded-lg p-4">
          <div className="text-3xl font-bold">{timeLeft.days}</div>
          <div className="text-sm opacity-90">Days</div>
        </div>
        <div className="bg-white/20 rounded-lg p-4">
          <div className="text-3xl font-bold">{timeLeft.hours}</div>
          <div className="text-sm opacity-90">Hours</div>
        </div>
        <div className="bg-white/20 rounded-lg p-4">
          <div className="text-3xl font-bold">{timeLeft.minutes}</div>
          <div className="text-sm opacity-90">Minutes</div>
        </div>
        <div className="bg-white/20 rounded-lg p-4">
          <div className="text-3xl font-bold">{timeLeft.seconds}</div>
          <div className="text-sm opacity-90">Seconds</div>
        </div>
      </div>
      <p className="mt-4 text-sm opacity-90">3rd - 7th November, 2025 • Speke Resort Munyonyo</p>
    </div>
  )
}
