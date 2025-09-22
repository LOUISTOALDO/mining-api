"use client"

import React, { forwardRef } from 'react'
import { motion, MotionProps } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAccessibility, useReducedMotion } from '@/hooks/useAccessibility'

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  announceOnClick?: boolean
  announceText?: string
  motionProps?: MotionProps
}

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    announceOnClick = false,
    announceText,
    motionProps,
    children,
    disabled,
    ...props
  }, ref) => {
    const { announce } = useAccessibility()
    const prefersReducedMotion = useReducedMotion()
    const { onClick: onClickProp, ...restProps } = props

    const baseClasses = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
    
    const variants = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
      outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
      ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
      destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
    }

    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base"
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (announceOnClick && announceText) {
        announce(announceText)
      }
      onClickProp?.(event)
    }

    const ButtonComponent = prefersReducedMotion ? 'button' : motion.button

    const buttonProps = {
      ref,
      className: cn(
        baseClasses,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      ),
      disabled: disabled || loading,
      onClick: handleClick,
      'aria-disabled': disabled || loading,
      'aria-busy': loading,
      ...restProps
    }

    const content = (
      <>
        {loading && (
          <Loader2 className={cn(
            "animate-spin",
            size === 'sm' ? "h-4 w-4" : size === 'lg' ? "h-5 w-5" : "h-4 w-4",
            iconPosition === 'left' && "mr-2",
            iconPosition === 'right' && "ml-2"
          )} />
        )}
        {!loading && icon && iconPosition === 'left' && (
          <span className="mr-2" aria-hidden="true">
            {icon}
          </span>
        )}
        {children && (
          <span className={loading ? "opacity-0" : "opacity-100"}>
            {children}
          </span>
        )}
        {!loading && icon && iconPosition === 'right' && (
          <span className="ml-2" aria-hidden="true">
            {icon}
          </span>
        )}
      </>
    )

    if (prefersReducedMotion) {
      return (
        <button {...buttonProps}>
          {content}
        </button>
      )
    }

    const { 
      onClick, 
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
      ...motionButtonProps 
    } = buttonProps

    return (
      <motion.button
        {...motionButtonProps}
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...motionProps}
      >
        {content}
      </motion.button>
    )
  }
)

AccessibleButton.displayName = "AccessibleButton"

export { AccessibleButton }
