"use client"

import React, { forwardRef } from 'react'
import { motion, MotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/useAccessibility'

interface AccessibleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled'
  interactive?: boolean
  selected?: boolean
  disabled?: boolean
  motionProps?: MotionProps
  onSelect?: () => void
  onKeyDown?: (event: React.KeyboardEvent) => void
}

const AccessibleCard = forwardRef<HTMLDivElement, AccessibleCardProps>(
  ({
    className,
    variant = 'default',
    interactive = false,
    selected = false,
    disabled = false,
    motionProps,
    onSelect,
    onKeyDown,
    children,
    ...props
  }, ref) => {
    const prefersReducedMotion = useReducedMotion()

    const baseClasses = "rounded-lg border transition-colors"
    
    const variants = {
      default: "bg-white border-gray-200",
      elevated: "bg-white border-gray-200 shadow-lg",
      outlined: "bg-transparent border-gray-300",
      filled: "bg-gray-50 border-gray-200"
    }

    const interactiveClasses = interactive ? "cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" : ""
    const selectedClasses = selected ? "ring-2 ring-blue-500 bg-blue-50" : ""
    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : ""

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (interactive && !disabled) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect?.()
        }
      }
      onKeyDown?.(event)
    }

    const CardComponent = prefersReducedMotion ? 'div' : motion.div

    const cardProps = {
      ref,
      className: cn(
        baseClasses,
        variants[variant],
        interactiveClasses,
        selectedClasses,
        disabledClasses,
        className
      ),
      tabIndex: interactive ? 0 : undefined,
      role: interactive ? 'button' : undefined,
      'aria-selected': interactive ? selected : undefined,
      'aria-disabled': disabled,
      onKeyDown: handleKeyDown,
      ...props
    }

    if (prefersReducedMotion) {
      return (
        <div {...cardProps}>
          {children}
        </div>
      )
    }

    const { 
      onAnimationStart, 
      onAnimationEnd, 
      onDragStart, 
      onDrag, 
      onDragEnd, 
      onPointerDown, 
      onPointerUp, 
      onPointerMove, 
      onPointerCancel, 
      onPointerEnter, 
      onPointerLeave, 
      onPointerOver, 
      onPointerOut,
      ...motionCardProps 
    } = cardProps

    return (
      <motion.div
        {...motionCardProps}
        whileHover={interactive && !disabled ? { scale: 1.02 } : undefined}
        whileTap={interactive && !disabled ? { scale: 0.98 } : undefined}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...motionProps}
      >
        {children}
      </motion.div>
    )
  }
)

AccessibleCard.displayName = "AccessibleCard"

export { AccessibleCard }
