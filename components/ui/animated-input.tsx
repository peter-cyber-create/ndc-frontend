'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

interface AnimatedInputProps extends React.ComponentProps<"input"> {
  label?: string
  error?: string
  glitchEffect?: boolean
  typingEffect?: boolean
}

const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ className, type, label, error, glitchEffect = false, typingEffect = false, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(false)
    const [isGlitching, setIsGlitching] = React.useState(false)
    const [isTyping, setIsTyping] = React.useState(false)
    const [placeholderText, setPlaceholderText] = React.useState(props.placeholder || '')
    const inputRef = React.useRef<HTMLInputElement>(null)

    // Glitch effect on mount
    React.useEffect(() => {
      if (glitchEffect) {
        setIsGlitching(true)
        const timer = setTimeout(() => setIsGlitching(false), 200)
        return () => clearTimeout(timer)
      }
    }, [glitchEffect])

    // Typing effect for placeholder
    React.useEffect(() => {
      if (typingEffect && props.placeholder) {
        setIsTyping(true)
        let currentText = ''
        let index = 0
        const typeInterval = setInterval(() => {
          if (index < props.placeholder!.length) {
            currentText += props.placeholder![index]
            setPlaceholderText(currentText)
            index++
          } else {
            setIsTyping(false)
            clearInterval(typeInterval)
          }
        }, 50)
        return () => clearInterval(typeInterval)
      }
    }, [typingEffect, props.placeholder])

    const handleFocus = () => {
      setIsFocused(true)
    }

    const handleBlur = () => {
      setIsFocused(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0)
      if (props.onChange) {
        props.onChange(e)
      }
    }

    const isLabelFloating = isFocused || hasValue

    return (
      <div className="relative w-full group">
        {/* Input Container */}
        <div className="relative">
          <input
            ref={ref}
            type={type}
            className={cn(
              "peer w-full h-12 px-3 pt-6 pb-2 text-base bg-transparent border-0 border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:ring-0 transition-all duration-200 ease-out",
              // Glitch effect
              isGlitching && "animate-pulse",
              // Error state
              error && "border-red-500 focus:border-red-500",
              // Focus state
              !error && isFocused && "border-primary-500",
              // Typing effect
              isTyping && "placeholder-gray-400",
              className
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder={isTyping ? placeholderText : props.placeholder}
            {...props}
          />
          
          {/* Floating Label */}
          {label && (
            <label
              className={cn(
                "absolute left-3 transition-all duration-200 ease-out pointer-events-none",
                // Label position and size
                isLabelFloating 
                  ? "top-1 text-xs text-primary-600 font-medium" 
                  : "top-4 text-base text-gray-500",
                // Error state
                error && "text-red-500",
                // Focus state
                !error && isFocused && "text-primary-600"
              )}
            >
              {label}
            </label>
          )}

          {/* Underline Glow Effect */}
          <div 
            className={cn(
              "absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 transition-all duration-300 ease-out transform scale-x-0 origin-center",
              isFocused && "scale-x-100 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
            )}
          />
          
          {/* Focus Lines Effect */}
          {isFocused && (
            <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-primary-500 opacity-60 animate-pulse" />
          )}
          {isFocused && (
            <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-primary-500 opacity-60 animate-pulse" />
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-1 text-sm text-red-500 animate-shake">
            {error}
          </p>
        )}

        {/* HUD Overlay Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-300">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-400 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-400 to-transparent" />
        </div>
      </div>
    )
  }
)

AnimatedInput.displayName = "AnimatedInput"

export { AnimatedInput }

