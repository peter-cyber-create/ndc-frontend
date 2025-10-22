'use client'

import React, { useEffect, useRef } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  threshold?: number
}

export default function ScrollReveal({ 
  children, 
  className = '', 
  delay = 0,
  direction = 'up',
  threshold = 0.1
}: ScrollRevealProps) {
  const [ref, isVisible] = useScrollReveal({ threshold })
  const [hasAnimated, setHasAnimated] = React.useState(false)

  useEffect(() => {
    if (isVisible && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [isVisible, delay, hasAnimated])

  const getAnimationClass = () => {
    if (!hasAnimated) {
      switch (direction) {
        case 'up':
          return 'opacity-0 translate-y-8'
        case 'down':
          return 'opacity-0 -translate-y-8'
        case 'left':
          return 'opacity-0 translate-x-8'
        case 'right':
          return 'opacity-0 -translate-x-8'
        default:
          return 'opacity-0 translate-y-8'
      }
    }
    return 'opacity-100 translate-y-0 translate-x-0'
  }

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${getAnimationClass()} ${className}`}
    >
      {children}
    </div>
  )
}

