'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

interface AnimatedCounterProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
  delay?: number
}

export default function AnimatedCounter({ 
  end, 
  duration = 2000, 
  suffix = '', 
  prefix = '', 
  className = '',
  delay = 0
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [ref, isVisible] = useScrollReveal({ threshold: 0.3 })
  const startTimeRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    if (isVisible && !isAnimating) {
      setIsAnimating(true)
      startTimeRef.current = null
      
      const animate = (currentTime: number) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = currentTime + delay
        }

        const elapsed = currentTime - startTimeRef.current
        const progress = Math.min(elapsed / duration, 1)
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3)
        const currentCount = Math.floor(easeOutCubic * end)
        
        setCount(currentCount)

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate)
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isVisible, end, duration, delay, isAnimating])

  return (
    <span 
      ref={ref} 
      className={`inline-block ${className}`}
    >
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}
