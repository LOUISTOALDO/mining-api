"use client"

import { useEffect, useRef, useState } from 'react'

interface AccessibilityOptions {
  announceChanges?: boolean
  focusManagement?: boolean
  keyboardNavigation?: boolean
}

export function useAccessibility(options: AccessibilityOptions = {}) {
  const {
    announceChanges = true,
    focusManagement = true,
    keyboardNavigation = true
  } = options

  const [announcements, setAnnouncements] = useState<string[]>([])
  const announcementRef = useRef<HTMLDivElement>(null)

  // Screen reader announcements
  const announce = (message: string) => {
    if (!announceChanges) return
    
    setAnnouncements(prev => [...prev, message])
    
    // Clear announcement after a delay
    setTimeout(() => {
      setAnnouncements(prev => prev.slice(1))
    }, 1000)
  }

  // Focus management
  const focusElement = (selector: string) => {
    if (!focusManagement) return
    
    const element = document.querySelector(selector) as HTMLElement
    if (element) {
      element.focus()
    }
  }

  // Keyboard navigation helpers
  const handleKeyDown = (event: KeyboardEvent, handlers: Record<string, () => void>) => {
    if (!keyboardNavigation) return
    
    const handler = handlers[event.key]
    if (handler) {
      event.preventDefault()
      handler()
    }
  }

  // ARIA live region for announcements
  useEffect(() => {
    if (announcementRef.current && announcements.length > 0) {
      announcementRef.current.textContent = announcements[0]
    }
  }, [announcements])

  return {
    announce,
    focusElement,
    handleKeyDown,
    announcementRef,
    announcements
  }
}

// Keyboard navigation hook
export function useKeyboardNavigation() {
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [isNavigating, setIsNavigating] = useState(false)

  const navigate = (direction: 'up' | 'down' | 'left' | 'right', items: HTMLElement[]) => {
    if (items.length === 0) return

    let newIndex = focusedIndex

    switch (direction) {
      case 'up':
      case 'left':
        newIndex = focusedIndex > 0 ? focusedIndex - 1 : items.length - 1
        break
      case 'down':
      case 'right':
        newIndex = focusedIndex < items.length - 1 ? focusedIndex + 1 : 0
        break
    }

    setFocusedIndex(newIndex)
    items[newIndex]?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent, items: HTMLElement[]) => {
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault()
        navigate('up', items)
        break
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault()
        navigate('down', items)
        break
      case 'Home':
        event.preventDefault()
        setFocusedIndex(0)
        items[0]?.focus()
        break
      case 'End':
        event.preventDefault()
        setFocusedIndex(items.length - 1)
        items[items.length - 1]?.focus()
        break
    }
  }

  return {
    focusedIndex,
    setFocusedIndex,
    navigate,
    handleKeyDown,
    isNavigating,
    setIsNavigating
  }
}

// Focus trap hook
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleTabKey)
    firstElement.focus()

    return () => {
      document.removeEventListener('keydown', handleTabKey)
    }
  }, [isActive])

  return containerRef
}

// Reduced motion hook
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

// High contrast mode hook
export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)')
    setIsHighContrast(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setIsHighContrast(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return isHighContrast
}

// Screen reader detection
export function useScreenReader() {
  const [isScreenReader, setIsScreenReader] = useState(false)

  useEffect(() => {
    // Check for common screen reader indicators
    const hasScreenReader = 
      window.navigator.userAgent.includes('NVDA') ||
      window.navigator.userAgent.includes('JAWS') ||
      window.navigator.userAgent.includes('VoiceOver') ||
      document.querySelector('[aria-live]') !== null

    setIsScreenReader(hasScreenReader)
  }, [])

  return isScreenReader
}
