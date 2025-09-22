'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function EquipmentHealthAnalytics() {
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
            Equipment Health Analytics
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#d1d5db',
            marginBottom: '3rem',
            maxWidth: '800px',
            margin: '0 auto 3rem auto',
            lineHeight: '1.6'
          }}>
            Real-time monitoring and analytics for your mining equipment. Track performance, 
            identify anomalies, and optimize operations with comprehensive health insights.
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
              <div style={{fontSize: '2.5rem', fontWeight: '700', color: '#10b981', marginBottom: '0.5rem'}}>24/7</div>
              <div style={{color: '#9ca3af'}}>Continuous Monitoring</div>
            </div>
            <div style={{
              background: 'rgba(26, 26, 26, 0.6)',
              padding: '2rem',
              borderRadius: '1rem',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{fontSize: '2.5rem', fontWeight: '700', color: '#06b6d4', marginBottom: '0.5rem'}}>99.9%</div>
              <div style={{color: '#9ca3af'}}>Uptime Tracking</div>
            </div>
            <div style={{
              background: 'rgba(26, 26, 26, 0.6)',
              padding: '2rem',
              borderRadius: '1rem',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{fontSize: '2.5rem', fontWeight: '700', color: '#8b5cf6', marginBottom: '0.5rem'}}>1000+</div>
              <div style={{color: '#9ca3af'}}>Data Points</div>
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

      {/* Analytics Dashboard Preview */}
      <section style={{padding: '4rem 2rem', background: 'rgba(0, 0, 0, 0.2)'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#ffffff'
          }}>
            Real-Time Analytics Dashboard
          </h2>
          
          {/* Dashboard Mockup */}
          <div style={{
            background: 'rgba(26, 26, 26, 0.8)',
            borderRadius: '1rem',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            marginBottom: '3rem'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem'
            }}>
              {/* Equipment Status Cards */}
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
                  <h3 style={{fontSize: '1rem', fontWeight: '600', color: '#ffffff'}}>Excavator #001</h3>
                </div>
                <div style={{fontSize: '2rem', fontWeight: '700', color: '#10b981', marginBottom: '0.5rem'}}>98%</div>
                <div style={{color: '#9ca3af', fontSize: '0.875rem'}}>Health Score</div>
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
                  <h3 style={{fontSize: '1rem', fontWeight: '600', color: '#ffffff'}}>Haul Truck #045</h3>
                </div>
                <div style={{fontSize: '2rem', fontWeight: '700', color: '#f59e0b', marginBottom: '0.5rem'}}>76%</div>
                <div style={{color: '#9ca3af', fontSize: '0.875rem'}}>Health Score</div>
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
                  <h3 style={{fontSize: '1rem', fontWeight: '600', color: '#ffffff'}}>Crusher #012</h3>
                </div>
                <div style={{fontSize: '2rem', fontWeight: '700', color: '#ef4444', marginBottom: '0.5rem'}}>45%</div>
                <div style={{color: '#9ca3af', fontSize: '0.875rem'}}>Health Score</div>
              </div>
            </div>
          </div>

          {/* Key Features */}
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
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                fontSize: '1.5rem'
              }}>
                📈
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#ffffff'}}>
                Performance Tracking
              </h3>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                Monitor equipment efficiency, fuel consumption, and operational metrics 
                in real-time with detailed performance analytics.
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
                background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                fontSize: '1.5rem'
              }}>
                🔍
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#ffffff'}}>
                Anomaly Detection
              </h3>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                AI-powered anomaly detection identifies unusual patterns and potential 
                issues before they impact operations or safety.
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
                📊
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#ffffff'}}>
                Trend Analysis
              </h3>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                Historical data analysis and trend identification help optimize 
                maintenance schedules and improve long-term equipment performance.
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
            Get Complete Visibility Into Your Equipment
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#d1d5db',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Transform raw sensor data into actionable insights that drive operational excellence.
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
            Start Monitoring Today
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
