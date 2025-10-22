'use client'

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const animatedButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90 active:scale-95",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:scale-95",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground active:scale-95",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 active:scale-95",
        ghost: "hover:bg-accent hover:text-accent-foreground active:scale-95",
        link: "text-primary underline-offset-4 hover:underline active:scale-95",
        energy:
          "bg-gradient-to-r from-primary-600 to-primary-800 text-white shadow-lg hover:shadow-xl active:scale-95",
        cyber:
          "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg hover:shadow-xl active:scale-95 border border-cyan-400/30",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof animatedButtonVariants> {
  asChild?: boolean
  energyCharge?: boolean
  explosionEffect?: boolean
  loading?: boolean
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    energyCharge = false,
    explosionEffect = false,
    loading = false,
    children,
    ...props 
  }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false)
    const [isPressed, setIsPressed] = React.useState(false)
    const [isExploding, setIsExploding] = React.useState(false)
    const [energyLevel, setEnergyLevel] = React.useState(0)

    // Energy charge animation
    React.useEffect(() => {
      if (isHovered && energyCharge) {
        const interval = setInterval(() => {
          setEnergyLevel(prev => Math.min(prev + 2, 100))
        }, 20)
        return () => clearInterval(interval)
      } else {
        setEnergyLevel(0)
      }
    }, [isHovered, energyCharge])

    // Explosion effect
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (explosionEffect) {
        setIsExploding(true)
        setTimeout(() => setIsExploding(false), 300)
      }
      if (props.onClick) {
        props.onClick(e)
      }
    }

    const handleMouseEnter = () => {
      setIsHovered(true)
      if (props.onMouseEnter) {
        props.onMouseEnter({} as React.MouseEvent<HTMLButtonElement>)
      }
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
      if (props.onMouseLeave) {
        props.onMouseLeave({} as React.MouseEvent<HTMLButtonElement>)
      }
    }

    const handleMouseDown = () => {
      setIsPressed(true)
      if (props.onMouseDown) {
        props.onMouseDown({} as React.MouseEvent<HTMLButtonElement>)
      }
    }

    const handleMouseUp = () => {
      setIsPressed(false)
      if (props.onMouseUp) {
        props.onMouseUp({} as React.MouseEvent<HTMLButtonElement>)
      }
    }

    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(
          animatedButtonVariants({ variant, size, className }),
          // Energy charge effects
          energyCharge && isHovered && "shadow-[0_0_20px_rgba(59,130,246,0.4)]",
          // Explosion effects
          explosionEffect && isExploding && "animate-pulse scale-110",
          // Loading state
          loading && "opacity-70 cursor-not-allowed"
        )}
        ref={ref}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        disabled={loading || props.disabled}
        {...props}
      >
        {/* Energy Charge Background */}
        {energyCharge && (
          <div 
            className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-primary-600/20 transition-all duration-200 ease-out"
            style={{
              width: `${energyLevel}%`,
              transition: 'width 0.1s ease-out'
            }}
          />
        )}

        {/* Pulsing Energy Effect */}
        {energyCharge && isHovered && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary-400/10 to-primary-600/10 animate-pulse" />
        )}

        {/* Explosion Particles */}
        {explosionEffect && isExploding && (
          <>
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary-400 rounded-full animate-ping" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary-400 rounded-full animate-ping animation-delay-75" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary-400 rounded-full animate-ping animation-delay-150" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary-400 rounded-full animate-ping animation-delay-200" />
          </>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}

        {/* Button Content */}
        <span className="relative z-10">
          {children}
        </span>

        {/* HUD Overlay Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-300">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-white/50 to-transparent" />
          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-white/50 to-transparent" />
        </div>

        {/* Speed Lines on Click */}
        {isPressed && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-0 w-1 h-0.5 bg-white/60 transform -translate-y-1/2 rotate-12 animate-pulse" />
            <div className="absolute top-1/2 left-1 w-1 h-0.5 bg-white/60 transform -translate-y-1/2 rotate-12 animate-pulse animation-delay-75" />
            <div className="absolute top-1/2 right-0 w-1 h-0.5 bg-white/60 transform -translate-y-1/2 -rotate-12 animate-pulse" />
            <div className="absolute top-1/2 right-1 w-1 h-0.5 bg-white/60 transform -translate-y-1/2 -rotate-12 animate-pulse animation-delay-75" />
          </div>
        )}
      </Comp>
    )
  }
)

AnimatedButton.displayName = "AnimatedButton"

export { AnimatedButton, animatedButtonVariants }

