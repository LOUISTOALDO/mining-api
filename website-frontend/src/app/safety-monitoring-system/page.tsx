'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SafetyMonitoringSystem() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.body.getBoundingClientRect();
      setMousePosition({
        x: (e.clientX - rect.width / 2) / rect.width,
        y: (e.clientY - rect.height / 2) / rect.height
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Navigation */}
      <nav style={{
        padding: '1rem 2rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Link href="/" style={{textDecoration: 'none'}}>
              <span style={{
                fontSize: '1.5rem', 
                fontWeight: '500', 
                color: '#ffffff',
                textTransform: 'lowercase',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                letterSpacing: '0.01em',
                textShadow: '0 0 12px rgba(255, 255, 255, 0.4), 0 0 24px rgba(255, 255, 255, 0.2)',
                filter: 'blur(0.2px)'
              }}>
                elysium
              </span>
            </Link>
          <div style={{display: 'flex', gap: '2rem'}}>
            <Link href="/products" style={{color: '#9ca3af', textDecoration: 'none'}}>Products</Link>
            <Link href="/solutions" style={{color: '#9ca3af', textDecoration: 'none'}}>Solutions</Link>
            <Link href="/enterprise" style={{color: '#9ca3af', textDecoration: 'none'}}>Enterprise</Link>
            <Link href="/about" style={{color: '#9ca3af', textDecoration: 'none'}}>About</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10}}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #10b981, #059669, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: '1.1'
          }}>
            Safety Monitoring System
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#d1d5db',
            marginBottom: '3rem',
            maxWidth: '800px',
            margin: '0 auto 3rem auto',
            lineHeight: '1.6'
          }}>
            Comprehensive safety monitoring and compliance management for mining operations. 
            Protect your workforce and ensure regulatory compliance with AI-powered safety insights.
          </p>
          
          {/* Key Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem'
          }}>
            <div style={{
              background: 'rgba(26, 26, 26, 0.6)',
              padding: '2rem',
              borderRadius: '1rem',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{fontSize: '2.5rem', fontWeight: '700', color: '#10b981', marginBottom: '0.5rem'}}>99.8%</div>
              <div style={{color: '#9ca3af'}}>Safety Compliance</div>
            </div>
            <div style={{
              background: 'rgba(26, 26, 26, 0.6)',
              padding: '2rem',
              borderRadius: '1rem',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{fontSize: '2.5rem', fontWeight: '700', color: '#06b6d4', marginBottom: '0.5rem'}}>75%</div>
              <div style={{color: '#9ca3af'}}>Risk Reduction</div>
            </div>
            <div style={{
              background: 'rgba(26, 26, 26, 0.6)',
              padding: '2rem',
              borderRadius: '1rem',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{fontSize: '2.5rem', fontWeight: '700', color: '#8b5cf6', marginBottom: '0.5rem'}}>24/7</div>
              <div style={{color: '#9ca3af'}}>Safety Monitoring</div>
            </div>
          </div>
        </div>

        {/* Interactive Background Elements */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '400px',
          height: '400px',
          background: `
            radial-gradient(circle at ${50 + mousePosition.x * 50}% ${50 + mousePosition.y * 50}%, rgba(16, 185, 129, 0.3) 0%, transparent 70%)
          `,
          borderRadius: '50%',
          filter: 'blur(4px)',
          transform: `translate(-50%, -50%) translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`,
          transition: 'all 0.1s ease-out'
        }} />
      </section>

      {/* Safety Features */}
      <section style={{padding: '4rem 2rem', background: 'rgba(0, 0, 0, 0.2)'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#ffffff'
          }}>
            Comprehensive Safety Solutions
          </h2>
          
          {/* Safety Dashboard Preview */}
          <div style={{
            background: 'rgba(26, 26, 26, 0.8)',
            borderRadius: '1rem',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            marginBottom: '3rem'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '2rem',
              color: '#ffffff',
              textAlign: 'center'
            }}>
              Real-Time Safety Dashboard
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem'
            }}>
              {/* Safety Status Cards */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    background: '#10b981',
                    borderRadius: '50%',
                    marginRight: '0.75rem'
                  }} />
                  <h4 style={{fontSize: '1rem', fontWeight: '600', color: '#ffffff'}}>Site A - North Pit</h4>
                </div>
                <div style={{fontSize: '1.5rem', fontWeight: '700', color: '#10b981', marginBottom: '0.5rem'}}>SAFE</div>
                <div style={{color: '#9ca3af', fontSize: '0.875rem'}}>All systems operational</div>
              </div>

              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(245, 158, 11, 0.3)'
              }}>
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    background: '#f59e0b',
                    borderRadius: '50%',
                    marginRight: '0.75rem'
                  }} />
                  <h4 style={{fontSize: '1rem', fontWeight: '600', color: '#ffffff'}}>Site B - Processing</h4>
                </div>
                <div style={{fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b', marginBottom: '0.5rem'}}>CAUTION</div>
                <div style={{color: '#9ca3af', fontSize: '0.875rem'}}>High noise levels detected</div>
              </div>

              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}>
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    background: '#ef4444',
                    borderRadius: '50%',
                    marginRight: '0.75rem'
                  }} />
                  <h4 style={{fontSize: '1rem', fontWeight: '600', color: '#ffffff'}}>Site C - Underground</h4>
                </div>
                <div style={{fontSize: '1.5rem', fontWeight: '700', color: '#ef4444', marginBottom: '0.5rem'}}>ALERT</div>
                <div style={{color: '#9ca3af', fontSize: '0.875rem'}}>Gas levels elevated</div>
              </div>
            </div>
          </div>

          {/* Key Safety Features */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{
              background: 'rgba(26, 26, 26, 0.6)',
              padding: '2rem',
              borderRadius: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                fontSize: '1.5rem'
              }}>
                🚨
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#ffffff'}}>
                Real-Time Alerts
              </h3>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                Instant notifications for safety violations, environmental hazards, 
                and equipment malfunctions with automated emergency protocols.
              </p>
            </div>

            <div style={{
              background: 'rgba(26, 26, 26, 0.6)',
              padding: '2rem',
              borderRadius: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                fontSize: '1.5rem'
              }}>
                📋
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#ffffff'}}>
                Compliance Tracking
              </h3>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                Automated compliance monitoring for OSHA, MSHA, and other regulatory 
                requirements with detailed reporting and audit trails.
              </p>
            </div>

            <div style={{
              background: 'rgba(26, 26, 26, 0.6)',
              padding: '2rem',
              borderRadius: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                fontSize: '1.5rem'
              }}>
                👥
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#ffffff'}}>
                Personnel Safety
              </h3>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                Worker location tracking, PPE compliance monitoring, and safety 
                training management to protect your most valuable asset.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Environmental Monitoring */}
      <section style={{padding: '4rem 2rem', background: 'rgba(0, 0, 0, 0.3)'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#ffffff'
          }}>
            Environmental & Hazard Monitoring
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{
              background: 'rgba(26, 26, 26, 0.6)',
              padding: '2rem',
              borderRadius: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                fontSize: '1.5rem'
              }}>
                🌡️
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#ffffff'}}>
                Air Quality Monitoring
              </h3>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                Continuous monitoring of dust, gas, and particulate levels 
                with automatic ventilation controls and worker protection alerts.
              </p>
            </div>

            <div style={{
              background: 'rgba(26, 26, 26, 0.6)',
              padding: '2rem',
              borderRadius: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                fontSize: '1.5rem'
              }}>
                💧
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#ffffff'}}>
                Water Quality Control
              </h3>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                Real-time water quality monitoring for process water, 
                tailings, and environmental discharge compliance.
              </p>
            </div>

            <div style={{
              background: 'rgba(26, 26, 26, 0.6)',
              padding: '2rem',
              borderRadius: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                fontSize: '1.5rem'
              }}>
                ⚡
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#ffffff'}}>
                Structural Monitoring
              </h3>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                Advanced sensors monitor slope stability, ground movement, 
                and structural integrity to prevent catastrophic failures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1))'
      }}>
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            color: '#ffffff'
          }}>
            Protect Your People and Operations
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#d1d5db',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Ensure the highest safety standards with comprehensive monitoring and compliance management.
          </p>
          <Link href="/contact" style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '1.125rem',
            transition: 'all 0.3s ease'
          }}>
            Enhance Safety Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '3rem 2rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{maxWidth: '1200px', margin: '0 auto', textAlign: 'center'}}>
          <div style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#ffffff'}}>
            Elysium
          </div>
          <p style={{color: '#9ca3af', marginBottom: '2rem'}}>
            AI-powered predictive maintenance solutions for mining operations
          </p>
          <div style={{color: '#6b7280', fontSize: '0.875rem'}}>
            © 2025 Elysium. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
