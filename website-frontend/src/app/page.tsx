"use client"

import { ArrowRight, Menu, X, CheckCircle, Star, Users, Zap } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"

// Add CSS animations for the button and random brain effects
const buttonStyles = `
  @keyframes colorShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes morph {
    0% { border-radius: 1.5rem; transform: scale(1.1) rotate(2deg); }
    25% { border-radius: 2rem; transform: scale(1.15) rotate(-1deg); }
    50% { border-radius: 1rem; transform: scale(1.2) rotate(3deg); }
    75% { border-radius: 2.5rem; transform: scale(1.1) rotate(-2deg); }
    100% { border-radius: 1.5rem; transform: scale(1.1) rotate(2deg); }
  }

  @keyframes morphBrain {
    0% { border-radius: 50% 40% 60% 30%; transform: scale(1) rotate(0deg); }
    25% { border-radius: 40% 60% 30% 50%; transform: scale(1.1) rotate(90deg); }
    50% { border-radius: 60% 30% 50% 40%; transform: scale(0.9) rotate(180deg); }
    75% { border-radius: 30% 50% 40% 60%; transform: scale(1.05) rotate(270deg); }
    100% { border-radius: 50% 40% 60% 30%; transform: scale(1) rotate(360deg); }
  }

  @keyframes pulseCore {
    0% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(1); opacity: 0.8; }
  }

  @keyframes floatParticle1 {
    0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
    33% { transform: translateY(-20px) translateX(10px) rotate(120deg); }
    66% { transform: translateY(10px) translateX(-15px) rotate(240deg); }
    100% { transform: translateY(0px) translateX(0px) rotate(360deg); }
  }

  @keyframes floatParticle2 {
    0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
    25% { transform: translateY(-15px) translateX(-10px) rotate(90deg); }
    50% { transform: translateY(20px) translateX(15px) rotate(180deg); }
    75% { transform: translateY(-5px) translateX(-20px) rotate(270deg); }
    100% { transform: translateY(0px) translateX(0px) rotate(360deg); }
  }

  @keyframes floatParticle3 {
    0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
    40% { transform: translateY(-25px) translateX(20px) rotate(144deg); }
    80% { transform: translateY(15px) translateX(-25px) rotate(288deg); }
    100% { transform: translateY(0px) translateX(0px) rotate(360deg); }
  }

  @keyframes randomChaos {
    0% { filter: hue-rotate(0deg) saturate(1.1) brightness(1); }
    16% { filter: hue-rotate(60deg) saturate(1.3) brightness(1.1); }
    33% { filter: hue-rotate(120deg) saturate(0.9) brightness(0.9); }
    50% { filter: hue-rotate(180deg) saturate(1.2) brightness(1.05); }
    66% { filter: hue-rotate(240deg) saturate(0.8) brightness(1.1); }
    83% { filter: hue-rotate(300deg) saturate(1.4) brightness(0.95); }
    100% { filter: hue-rotate(360deg) saturate(1.1) brightness(1); }
  }
`

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const brainRef = useRef<HTMLDivElement>(null)
  const buttonAnimationRef = useRef<number | null>(null)

  // Mouse tracking for interactive brain
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (brainRef.current) {
        try {
        const rect = brainRef.current.getBoundingClientRect()
          
          // Prevent division by zero
          if (rect.width === 0 || rect.height === 0) {
            return
          }
          
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        
        const x = (e.clientX - centerX) / (rect.width / 2)
        const y = (e.clientY - centerY) / (rect.height / 2)
        
          // Clamp values to prevent extreme values
          const clampedX = Math.max(-1, Math.min(1, x))
          const clampedY = Math.max(-1, Math.min(1, y))
          
          setMousePosition({ x: clampedX, y: clampedY })
        } catch (error) {
          console.warn('Mouse position calculation error:', error)
        }
        // Force refresh to clear cache
      }
    }

    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 })
    }

    const brainElement = brainRef.current
    if (brainElement) {
      brainElement.addEventListener('mousemove', handleMouseMove, { passive: true })
      brainElement.addEventListener('mouseleave', handleMouseLeave, { passive: true })
    }

    return () => {
      if (brainElement) {
        brainElement.removeEventListener('mousemove', handleMouseMove)
        brainElement.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  // Remove random effects completely - keep it smooth and predictable
  // The CSS animations will provide the organic movement without jarring cuts

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: buttonStyles }} />
    <div style={{minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#ffffff', fontFamily: 'Inter, system-ui, sans-serif'}}>
      {/* Clean Navigation */}
      <nav style={{position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(10, 10, 10, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #1a1a1a'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem'}}>
            {/* Logo */}
            <Link href="/" style={{textDecoration: 'none'}}>
              <span style={{
                fontSize: '1.5rem', 
                fontWeight: '500', 
                color: '#ffffff',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                letterSpacing: '0.01em',
                textShadow: '0 0 12px rgba(255, 255, 255, 0.4), 0 0 24px rgba(255, 255, 255, 0.2)',
                filter: 'blur(0.2px)'
              }}>
                elysium
              </span>
            </Link>
            
            {/* Navigation Links */}
            <div style={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
              <Link href="/products" style={{color: '#e5e7eb', fontSize: '0.9rem', fontWeight: '500', textDecoration: 'none', transition: 'color 0.2s'}}>Products</Link>
              <Link href="/solutions" style={{color: '#e5e7eb', fontSize: '0.9rem', fontWeight: '500', textDecoration: 'none', transition: 'color 0.2s'}}>Solutions</Link>
              <Link href="/enterprise" style={{color: '#e5e7eb', fontSize: '0.9rem', fontWeight: '500', textDecoration: 'none', transition: 'color 0.2s'}}>Enterprise</Link>
            </div>
            
            {/* CTA Buttons */}
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <Link href="/contact" style={{
                backgroundColor: '#1a1a1a',
                color: '#ffffff',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                border: '1px solid #374151',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                textDecoration: 'none'
              }}>
                Get Started
                <ArrowRight size={16} className="ml-2" />
              </Link>
              <a 
                href="https://cfe80a043ef6.ngrok-free.app?logout=true"
                style={{color: '#e5e7eb', fontSize: '0.9rem', fontWeight: '500', textDecoration: 'none'}}
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{padding: '6rem 0', minHeight: '80vh', display: 'flex', alignItems: 'center'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', width: '100%'}}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center'}}>
            
            {/* Left Content */}
            <div>
              <h1 style={{fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.1', color: '#ffffff', marginBottom: '1.5rem', letterSpacing: '-0.02em'}}>
                <span style={{display: 'block', color: '#3b82f6'}}>Predictive Maintenance</span>
                <span style={{display: 'block'}}>for Mining Operations</span>
              </h1>
              
              <p style={{fontSize: '1.25rem', color: '#d1d5db', lineHeight: '1.6', marginBottom: '2rem', fontWeight: '400'}}>
                Transform your mining operations with advanced AI, machine learning, and real-time data analytics. 
                Our intelligent platform delivers actionable insights that drive efficiency, safety, and profitability.
              </p>
              
              <div style={{display: 'flex', gap: '2rem', marginBottom: '2rem', alignItems: 'center'}}>
                <div style={{textAlign: 'center'}}>
                  <div style={{fontSize: '2rem', fontWeight: '700', color: '#10b981'}}>24/7</div>
                  <div style={{fontSize: '0.875rem', color: '#9ca3af'}}>Real-time Monitoring</div>
                </div>
                <div style={{textAlign: 'center'}}>
                  <div style={{fontSize: '2rem', fontWeight: '700', color: '#3b82f6'}}>1000+</div>
                  <div style={{fontSize: '0.875rem', color: '#9ca3af'}}>Data Points</div>
                </div>
                <div style={{textAlign: 'center'}}>
                  <div style={{fontSize: '2rem', fontWeight: '700', color: '#f59e0b'}}>AI-Powered</div>
                  <div style={{fontSize: '0.875rem', color: '#9ca3af'}}>Insights</div>
                </div>
              </div>
              
              <div style={{display: 'flex', justifyContent: 'center', marginTop: '1.5rem', maxWidth: '425px'}}>
                <button style={{
                  backgroundColor: '#1a1a1a',
                  color: '#ffffff',
                  padding: '1rem 2.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  border: '1px solid #374151',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                  minWidth: '180px'
                }}
                onMouseEnter={(e) => {
                  const button = e.target as HTMLElement;
                  
                  // Keep button size but remove visual constraints
                  button.style.background = 'transparent';
                  button.style.border = 'none';
                  button.style.boxShadow = 'none';
                  button.style.position = 'relative';
                  button.style.overflow = 'hidden';
                  button.style.zIndex = '1000';
                  
                  // Create a single blob that fills the button shape
                  const blob = document.createElement('div');
                  blob.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4, #10b981, #f59e0b, #ef4444);
                    background-size: 400% 400%;
                    border-radius: 0.5rem;
                    z-index: -1;
                    pointer-events: none;
                  `;
                  button.appendChild(blob);
                  
                  // Start color shifting animation
                  let startTime = Date.now();
                  const animate = () => {
                    const elapsed = Date.now() - startTime;
                    
                    // Color shift animation
                    const colorProgress = (elapsed % 3000) / 3000;
                    const colorPosition = colorProgress * 100;
                    blob.style.backgroundPosition = `${colorPosition}% ${colorPosition}%`;
                    
                    if (button.style.background === 'transparent') {
                      buttonAnimationRef.current = requestAnimationFrame(animate);
                    }
                  };
                  buttonAnimationRef.current = requestAnimationFrame(animate);
                }}
                onMouseLeave={(e) => {
                  // Stop the animation
                  if (buttonAnimationRef.current) {
                    cancelAnimationFrame(buttonAnimationRef.current);
                    buttonAnimationRef.current = null;
                  }
                  
                  // Clean up all created elements
                  const button = e.target as HTMLElement;
                  const allElements = button.querySelectorAll('div');
                  allElements.forEach(element => element.remove());
                  
                  // Reset button to original state
                  button.style.background = '#1a1a1a';
                  button.style.border = '1px solid #374151';
                  button.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
                  button.style.transform = 'scale(1)';
                  button.style.borderRadius = '0.5rem';
                  button.style.overflow = 'hidden';
                  button.style.zIndex = 'auto';
                }}
                onMouseDown={(e) => {
                  e.target.style.border = 'none';
                  e.target.style.borderRadius = '2rem';
                  e.target.style.transform = 'scale(0.95)';
                  e.target.style.background = 'linear-gradient(135deg, #3b82f6, #8b5cf6)';
                  e.target.style.boxShadow = '0 8px 32px rgba(59, 130, 246, 0.4)';
                }}
                onMouseUp={(e) => {
                  e.target.style.border = '1px solid #374151';
                  e.target.style.borderRadius = '0.5rem';
                  e.target.style.transform = 'scale(1)';
                  e.target.style.background = '#1a1a1a';
                  e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
                  e.target.style.animation = 'none';
                }}
                onClick={() => window.location.href = '/contact'}>
                  Get Started
                  <ArrowRight size={20} className="ml-2" />
                </button>
              </div>
            </div>

            {/* Right Content - Interactive Morphing AI Brain */}
            <div style={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '550px', transform: 'translateX(125px)'}}>
              <div 
                ref={brainRef}
                style={{
                  width: '450px',
                  height: '450px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'default',
                  animation: 'randomChaos 15s ease-in-out infinite',
                  filter: 'hue-rotate(0deg) saturate(1.1) brightness(1)'
                }}
              >
                {/* Main morphing blob - Pure Mouse Interactive */}
                <div style={{
                  width: '430px',
                  height: '430px',
                  background: `
                    radial-gradient(circle at ${20 + mousePosition.x * 40}% ${20 + mousePosition.y * 40}%, rgba(59, 130, 246, 0.9) 0%, transparent 40%),
                    radial-gradient(circle at ${50 + mousePosition.x * 30}% ${50 + mousePosition.y * 30}%, rgba(139, 92, 246, 1) 0%, transparent 60%),
                    radial-gradient(circle at ${80 - mousePosition.x * 40}% ${80 - mousePosition.y * 40}%, rgba(6, 182, 212, 0.9) 0%, transparent 40%),
                    radial-gradient(circle at ${30 + mousePosition.x * 25}% ${70 + mousePosition.y * 25}%, rgba(236, 72, 153, 0.8) 0%, transparent 50%),
                    radial-gradient(circle at 60% 40%, rgba(16, 185, 129, 0.7) 0%, transparent 45%),
                    radial-gradient(circle at 40% 80%, rgba(245, 158, 11, 0.6) 0%, transparent 50%)
                  `,
                  borderRadius: `${50 + mousePosition.x * 40}% ${40 - mousePosition.y * 30}% ${60 - mousePosition.x * 25}% ${30 + mousePosition.y * 50}%`,
                  filter: 'blur(2px)',
                  animation: 'morphBrain 8s ease-in-out infinite',
                  position: 'absolute',
                  transform: `translate(${mousePosition.x * 25}px, ${mousePosition.y * 25}px) scale(${Math.max(0.5, Math.min(2, 1 + Math.abs(mousePosition.x) * 0.3 + Math.abs(mousePosition.y) * 0.3))})`,
                  transition: 'all 0.3s ease-out'
                }} />
                
                {/* Secondary morphing layer - Pure Mouse Interactive */}
                <div style={{
                  width: '340px',
                  height: '340px',
                  background: `
                    radial-gradient(circle at ${40 - mousePosition.x * 30}% ${30 + mousePosition.y * 30}%, rgba(139, 92, 246, 0.8) 0%, transparent 50%),
                    radial-gradient(circle at ${60 + mousePosition.x * 35}% ${70 - mousePosition.y * 35}%, rgba(6, 182, 212, 0.7) 0%, transparent 50%),
                    radial-gradient(circle at ${20 + mousePosition.x * 20}% ${80 + mousePosition.y * 20}%, rgba(59, 130, 246, 0.6) 0%, transparent 40%),
                    radial-gradient(circle at 70% 20%, rgba(245, 158, 11, 0.6) 0%, transparent 45%),
                    radial-gradient(circle at 30% 60%, rgba(236, 72, 153, 0.5) 0%, transparent 40%)
                  `,
                  borderRadius: `${40 + mousePosition.y * 30}% ${60 - mousePosition.x * 35}% ${30 - mousePosition.y * 20}% ${50 + mousePosition.x * 25}%`,
                  filter: 'blur(3px)',
                  animation: 'morphBrain 10s ease-in-out infinite reverse',
                  position: 'absolute',
                  transform: `translate(${-mousePosition.x * 15}px, ${-mousePosition.y * 15}px) scale(${Math.max(0.5, Math.min(2, 1 - Math.abs(mousePosition.x) * 0.15 + Math.abs(mousePosition.y) * 0.15))})`,
                  transition: 'all 0.3s ease-out'
                }} />
                
                {/* Inner pulsing core - Pure Mouse Interactive */}
                <div style={{
                  width: '250px',
                  height: '250px',
                  background: `
                    radial-gradient(circle at ${50 + mousePosition.x * 50}% ${50 + mousePosition.y * 50}%, rgba(255, 255, 255, 0.6) 0%, transparent 70%),
                    radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.4) 0%, transparent 60%),
                    radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)
                  `,
                  borderRadius: '50%',
                  filter: 'blur(4px)',
                  animation: 'pulseCore 5s ease-in-out infinite',
                  position: 'absolute',
                  transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px) scale(${Math.max(0.5, Math.min(2, 1 + Math.abs(mousePosition.x) * 0.4 + Math.abs(mousePosition.y) * 0.4))})`,
                  transition: 'all 0.3s ease-out'
                }} />
                
                {/* Interactive floating particles - Pure Mouse Interactive */}
                <div style={{
                  width: '25px',
                  height: '25px',
                  background: 'rgba(59, 130, 246, 0.9)',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: `${20 + mousePosition.y * 20}%`,
                  left: `${30 + mousePosition.x * 25}%`,
                  animation: 'floatParticle1 6s ease-in-out infinite',
                  transform: `translate(${mousePosition.x * 40}px, ${mousePosition.y * 40}px) scale(${Math.max(0.5, Math.min(3, 1 + Math.abs(mousePosition.x) * 1.0))})`,
                  transition: 'all 0.3s ease-out'
                }} />
                <div style={{
                  width: '20px',
                  height: '20px',
                  background: 'rgba(139, 92, 246, 0.9)',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: `${60 - mousePosition.y * 15}%`,
                  right: `${25 - mousePosition.x * 20}%`,
                  animation: 'floatParticle2 8s ease-in-out infinite',
                  transform: `translate(${-mousePosition.x * 30}px, ${-mousePosition.y * 30}px) scale(${Math.max(0.5, Math.min(3, 1 + Math.abs(mousePosition.y) * 0.8))})`,
                  transition: 'all 0.3s ease-out'
                }} />
                <div style={{
                  width: '16px',
                  height: '16px',
                  background: 'rgba(6, 182, 212, 0.9)',
                  borderRadius: '50%',
                  position: 'absolute',
                  bottom: `${30 + mousePosition.x * 15}%`,
                  left: `${20 + mousePosition.y * 20}%`,
                  animation: 'floatParticle3 7s ease-in-out infinite',
                  transform: `translate(${mousePosition.y * 50}px, ${-mousePosition.x * 50}px) scale(${Math.max(0.5, Math.min(3, 1 + Math.abs(mousePosition.x + mousePosition.y) * 0.6))})`,
                  transition: 'all 0.3s ease-out'
                }} />
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{padding: '6rem 0', backgroundColor: '#111111'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
          <div style={{textAlign: 'center', marginBottom: '4rem'}}>
            <h2 style={{fontSize: '2.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '1rem'}}>
              Built for Mining Operations
            </h2>
            <p style={{fontSize: '1.125rem', color: '#9ca3af', maxWidth: '600px', margin: '0 auto'}}>
              Specialized AI solutions designed specifically for mining equipment and operations
            </p>
          </div>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
            <div 
              style={{
                backgroundColor: 'rgba(26, 26, 26, 0.6)', 
                padding: '2rem', 
                borderRadius: '1.5rem', 
                border: '1px solid rgba(59, 130, 246, 0.2)', 
                backdropFilter: 'blur(10px)', 
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                const box = e.target as HTMLElement;
                box.style.backgroundColor = 'rgba(26, 26, 26, 0.8)';
                box.style.border = '1px solid rgba(59, 130, 246, 0.6)';
                box.style.boxShadow = '0 16px 48px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.1)';
                box.style.transform = 'translateY(-4px)';
                
                // Add glowing effect to icon
                const icon = box.querySelector('div') as HTMLElement;
                if (icon) {
                  icon.style.boxShadow = '0 8px 32px rgba(59, 130, 246, 0.6), 0 0 20px rgba(59, 130, 246, 0.4)';
                  icon.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                const box = e.target as HTMLElement;
                box.style.backgroundColor = 'rgba(26, 26, 26, 0.6)';
                box.style.border = '1px solid rgba(59, 130, 246, 0.2)';
                box.style.boxShadow = '0 8px 32px rgba(59, 130, 246, 0.1)';
                box.style.transform = 'translateY(0)';
                
                // Reset icon
                const icon = box.querySelector('div') as HTMLElement;
                if (icon) {
                  icon.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.3)';
                  icon.style.transform = 'scale(1)';
                }
              }}
            >
              <div style={{width: '3rem', height: '3rem', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)', transition: 'all 0.3s ease'}}>
                <Zap size={24} color="#ffffff" />
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem'}}>
                Equipment Health Monitoring
              </h3>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                Real-time monitoring of excavators, haul trucks, and processing equipment with 95%+ accuracy in failure prediction.
              </p>
            </div>
            
            <div 
              style={{
                backgroundColor: 'rgba(26, 26, 26, 0.6)', 
                padding: '2rem', 
                borderRadius: '1.5rem', 
                border: '1px solid rgba(139, 92, 246, 0.2)', 
                backdropFilter: 'blur(10px)', 
                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                const box = e.target as HTMLElement;
                box.style.backgroundColor = 'rgba(26, 26, 26, 0.8)';
                box.style.border = '1px solid rgba(139, 92, 246, 0.6)';
                box.style.boxShadow = '0 16px 48px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(139, 92, 246, 0.1)';
                box.style.transform = 'translateY(-4px)';
                
                // Add glowing effect to icon
                const icon = box.querySelector('div') as HTMLElement;
                if (icon) {
                  icon.style.boxShadow = '0 8px 32px rgba(139, 92, 246, 0.6), 0 0 20px rgba(139, 92, 246, 0.4)';
                  icon.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                const box = e.target as HTMLElement;
                box.style.backgroundColor = 'rgba(26, 26, 26, 0.6)';
                box.style.border = '1px solid rgba(139, 92, 246, 0.2)';
                box.style.boxShadow = '0 8px 32px rgba(139, 92, 246, 0.1)';
                box.style.transform = 'translateY(0)';
                
                // Reset icon
                const icon = box.querySelector('div') as HTMLElement;
                if (icon) {
                  icon.style.boxShadow = '0 4px 16px rgba(139, 92, 246, 0.3)';
                  icon.style.transform = 'scale(1)';
                }
              }}
            >
              <div style={{width: '3rem', height: '3rem', background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)', transition: 'all 0.3s ease'}}>
                <Users size={24} color="#ffffff" />
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem'}}>
                Cost Optimization
              </h3>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                Reduce maintenance costs by 30% and prevent unplanned downtime that costs mining operations millions annually.
              </p>
            </div>
            
            <div 
              style={{
                backgroundColor: 'rgba(26, 26, 26, 0.6)', 
                padding: '2rem', 
                borderRadius: '1.5rem', 
                border: '1px solid rgba(6, 182, 212, 0.2)', 
                backdropFilter: 'blur(10px)', 
                boxShadow: '0 8px 32px rgba(6, 182, 212, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                const box = e.target as HTMLElement;
                box.style.backgroundColor = 'rgba(26, 26, 26, 0.8)';
                box.style.border = '1px solid rgba(6, 182, 212, 0.6)';
                box.style.boxShadow = '0 16px 48px rgba(6, 182, 212, 0.3), 0 0 0 1px rgba(6, 182, 212, 0.1)';
                box.style.transform = 'translateY(-4px)';
                
                // Add glowing effect to icon
                const icon = box.querySelector('div') as HTMLElement;
                if (icon) {
                  icon.style.boxShadow = '0 8px 32px rgba(6, 182, 212, 0.6), 0 0 20px rgba(6, 182, 212, 0.4)';
                  icon.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                const box = e.target as HTMLElement;
                box.style.backgroundColor = 'rgba(26, 26, 26, 0.6)';
                box.style.border = '1px solid rgba(6, 182, 212, 0.2)';
                box.style.boxShadow = '0 8px 32px rgba(6, 182, 212, 0.1)';
                box.style.transform = 'translateY(0)';
                
                // Reset icon
                const icon = box.querySelector('div') as HTMLElement;
                if (icon) {
                  icon.style.boxShadow = '0 4px 16px rgba(6, 182, 212, 0.3)';
                  icon.style.transform = 'scale(1)';
                }
              }}
            >
              <div style={{width: '3rem', height: '3rem', background: 'linear-gradient(135deg, #06b6d4, #0891b2)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 4px 16px rgba(6, 182, 212, 0.3)', transition: 'all 0.3s ease'}}>
                <CheckCircle size={24} color="#ffffff" />
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem'}}>
                Safety & Compliance
              </h3>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                Improve safety outcomes and ensure compliance with mining regulations through proactive equipment monitoring.
              </p>
            </div>
            
            <div 
              style={{
                backgroundColor: 'rgba(26, 26, 26, 0.6)', 
                padding: '2rem', 
                borderRadius: '1.5rem', 
                border: '1px solid rgba(236, 72, 153, 0.2)', 
                backdropFilter: 'blur(10px)', 
                boxShadow: '0 8px 32px rgba(236, 72, 153, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                const box = e.target as HTMLElement;
                box.style.backgroundColor = 'rgba(26, 26, 26, 0.8)';
                box.style.border = '1px solid rgba(236, 72, 153, 0.6)';
                box.style.boxShadow = '0 16px 48px rgba(236, 72, 153, 0.3), 0 0 0 1px rgba(236, 72, 153, 0.1)';
                box.style.transform = 'translateY(-4px)';
                
                // Add glowing effect to icon
                const icon = box.querySelector('div') as HTMLElement;
                if (icon) {
                  icon.style.boxShadow = '0 8px 32px rgba(236, 72, 153, 0.6), 0 0 20px rgba(236, 72, 153, 0.4)';
                  icon.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                const box = e.target as HTMLElement;
                box.style.backgroundColor = 'rgba(26, 26, 26, 0.6)';
                box.style.border = '1px solid rgba(236, 72, 153, 0.2)';
                box.style.boxShadow = '0 8px 32px rgba(236, 72, 153, 0.1)';
                box.style.transform = 'translateY(0)';
                
                // Reset icon
                const icon = box.querySelector('div') as HTMLElement;
                if (icon) {
                  icon.style.boxShadow = '0 4px 16px rgba(236, 72, 153, 0.3)';
                  icon.style.transform = 'scale(1)';
                }
              }}
            >
              <div style={{width: '3rem', height: '3rem', background: 'linear-gradient(135deg, #ec4899, #be185d)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 4px 16px rgba(236, 72, 153, 0.3)', transition: 'all 0.3s ease'}}>
                <Zap size={24} color="#ffffff" />
          </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem'}}>
                Predictive Analytics
              </h3>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                Advanced machine learning models predict equipment failures 2-4 weeks in advance, enabling proactive maintenance scheduling.
              </p>
        </div>
            
            <div 
              style={{
                backgroundColor: 'rgba(26, 26, 26, 0.6)', 
                padding: '2rem', 
                borderRadius: '1.5rem', 
                border: '1px solid rgba(34, 197, 94, 0.2)', 
                backdropFilter: 'blur(10px)', 
                boxShadow: '0 8px 32px rgba(34, 197, 94, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                const box = e.target as HTMLElement;
                box.style.backgroundColor = 'rgba(26, 26, 26, 0.8)';
                box.style.border = '1px solid rgba(34, 197, 94, 0.6)';
                box.style.boxShadow = '0 16px 48px rgba(34, 197, 94, 0.3), 0 0 0 1px rgba(34, 197, 94, 0.1)';
                box.style.transform = 'translateY(-4px)';
                
                // Add glowing effect to icon
                const icon = box.querySelector('div') as HTMLElement;
                if (icon) {
                  icon.style.boxShadow = '0 8px 32px rgba(34, 197, 94, 0.6), 0 0 20px rgba(34, 197, 94, 0.4)';
                  icon.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                const box = e.target as HTMLElement;
                box.style.backgroundColor = 'rgba(26, 26, 26, 0.6)';
                box.style.border = '1px solid rgba(34, 197, 94, 0.2)';
                box.style.boxShadow = '0 8px 32px rgba(34, 197, 94, 0.1)';
                box.style.transform = 'translateY(0)';
                
                // Reset icon
                const icon = box.querySelector('div') as HTMLElement;
                if (icon) {
                  icon.style.boxShadow = '0 4px 16px rgba(34, 197, 94, 0.3)';
                  icon.style.transform = 'scale(1)';
                }
              }}
            >
              <div style={{width: '3rem', height: '3rem', background: 'linear-gradient(135deg, #22c55e, #16a34a)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3)', transition: 'all 0.3s ease'}}>
                <Users size={24} color="#ffffff" />
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem'}}>
                Fleet Management
              </h3>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                Optimize your entire mining fleet with real-time tracking, performance analytics, and automated maintenance workflows.
            </p>
          </div>
          
            <div 
              style={{
                backgroundColor: 'rgba(26, 26, 26, 0.6)', 
                padding: '2rem', 
                borderRadius: '1.5rem', 
                border: '1px solid rgba(245, 158, 11, 0.2)', 
                backdropFilter: 'blur(10px)', 
                boxShadow: '0 8px 32px rgba(245, 158, 11, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                const box = e.target as HTMLElement;
                box.style.backgroundColor = 'rgba(26, 26, 26, 0.8)';
                box.style.border = '1px solid rgba(245, 158, 11, 0.6)';
                box.style.boxShadow = '0 16px 48px rgba(245, 158, 11, 0.3), 0 0 0 1px rgba(245, 158, 11, 0.1)';
                box.style.transform = 'translateY(-4px)';
                
                // Add glowing effect to icon
                const icon = box.querySelector('div') as HTMLElement;
                if (icon) {
                  icon.style.boxShadow = '0 8px 32px rgba(245, 158, 11, 0.6), 0 0 20px rgba(245, 158, 11, 0.4)';
                  icon.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                const box = e.target as HTMLElement;
                box.style.backgroundColor = 'rgba(26, 26, 26, 0.6)';
                box.style.border = '1px solid rgba(245, 158, 11, 0.2)';
                box.style.boxShadow = '0 8px 32px rgba(245, 158, 11, 0.1)';
                box.style.transform = 'translateY(0)';
                
                // Reset icon
                const icon = box.querySelector('div') as HTMLElement;
                if (icon) {
                  icon.style.boxShadow = '0 4px 16px rgba(245, 158, 11, 0.3)';
                  icon.style.transform = 'scale(1)';
                }
              }}
            >
              <div style={{width: '3rem', height: '3rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)', transition: 'all 0.3s ease'}}>
                <CheckCircle size={24} color="#ffffff" />
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem'}}>
                Data Integration
              </h3>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                Seamlessly integrate with existing mining systems, sensors, and databases for comprehensive operational insights.
              </p>
            </div>
          </div>
          
        </div>
      </section>


      {/* Footer */}
      <footer style={{backgroundColor: '#111111', padding: '3rem 0', borderTop: '1px solid #2a2a2a'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
          <div style={{display: 'flex', justifyContent: 'flex-start', marginBottom: '2rem'}}>
            <div style={{marginRight: '6rem'}}>
              <h4 style={{fontSize: '0.875rem', fontWeight: '700', color: '#ffffff', marginBottom: '1rem', letterSpacing: '0.05em'}}>COMPANY</h4>
              <ul style={{listStyle: 'none', padding: 0}}>
                <li style={{marginBottom: '0.75rem'}}><Link href="/about" style={{color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem'}}>About</Link></li>
                <li style={{marginBottom: '0.75rem'}}><Link href="/terms" style={{color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem'}}>Terms</Link></li>
                <li style={{marginBottom: '0.75rem'}}><Link href="/privacy" style={{color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem'}}>Privacy</Link></li>
              </ul>
            </div>
            <div style={{marginRight: '6rem'}}>
              <h4 style={{fontSize: '0.875rem', fontWeight: '700', color: '#ffffff', marginBottom: '1rem', letterSpacing: '0.05em'}}>GUIDES</h4>
              <ul style={{listStyle: 'none', padding: 0}}>
                <li style={{marginBottom: '0.75rem'}}><Link href="/predictive-maintenance" style={{color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem'}}>Predictive Maintenance</Link></li>
                <li style={{marginBottom: '0.75rem'}}><Link href="/ml-model-training" style={{color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem'}}>ML Model Training</Link></li>
                <li style={{marginBottom: '0.75rem'}}><Link href="/equipment-monitoring" style={{color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem'}}>Equipment Monitoring</Link></li>
                <li style={{marginBottom: '0.75rem'}}><Link href="/failure-analysis" style={{color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem'}}>Failure Analysis</Link></li>
                <li style={{marginBottom: '0.75rem'}}><Link href="/guide-to-ai-for-mining" style={{color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem'}}>Guide to AI for Mining</Link></li>
                <li style={{marginBottom: '0.75rem'}}><Link href="/fleet-management" style={{color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem'}}>Fleet Management</Link></li>
                <li style={{marginBottom: '0.75rem'}}><Link href="/safety-analytics" style={{color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem'}}>Safety Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{fontSize: '0.875rem', fontWeight: '700', color: '#ffffff', marginBottom: '1rem', letterSpacing: '0.05em'}}>RESOURCES</h4>
              <ul style={{listStyle: 'none', padding: 0}}>
                <li style={{marginBottom: '0.75rem'}}><Link href="/contact" style={{color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem'}}>Contact Us</Link></li>
              </ul>
            </div>
          </div>
          <div style={{borderTop: '1px solid #2a2a2a', paddingTop: '2rem', textAlign: 'center'}}>
            <p style={{color: '#6b7280', fontSize: '0.875rem'}}>
              © 2025 Elysium. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
    </>
  )
}
