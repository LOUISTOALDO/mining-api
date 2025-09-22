'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FailurePredictionEngine() {
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
            background: 'linear-gradient(135deg, #ef4444, #dc2626, #f59e0b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: '1.1'
          }}>
            Failure Prediction Engine
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#d1d5db',
            marginBottom: '3rem',
            maxWidth: '800px',
            margin: '0 auto 3rem auto',
            lineHeight: '1.6'
          }}>
            Advanced AI engine that predicts equipment failures weeks in advance. 
            Prevent costly breakdowns and maximize operational efficiency with machine learning.
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
              border: '1px solid rgba(239, 68, 68, 0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{fontSize: '2.5rem', fontWeight: '700', color: '#ef4444', marginBottom: '0.5rem'}}>95%</div>
              <div style={{color: '#9ca3af'}}>Prediction Accuracy</div>
            </div>
            <div style={{
              background: 'rgba(26, 26, 26, 0.6)',
              padding: '2rem',
              borderRadius: '1rem',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{fontSize: '2.5rem', fontWeight: '700', color: '#f59e0b', marginBottom: '0.5rem'}}>14</div>
              <div style={{color: '#9ca3af'}}>Days Early Warning</div>
            </div>
            <div style={{
              background: 'rgba(26, 26, 26, 0.6)',
              padding: '2rem',
              borderRadius: '1rem',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{fontSize: '2.5rem', fontWeight: '700', color: '#8b5cf6', marginBottom: '0.5rem'}}>$5M+</div>
              <div style={{color: '#9ca3af'}}>Cost Avoidance</div>
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
            radial-gradient(circle at ${50 + mousePosition.x * 50}% ${50 + mousePosition.y * 50}%, rgba(239, 68, 68, 0.3) 0%, transparent 70%)
          `,
          borderRadius: '50%',
          filter: 'blur(4px)',
          transform: `translate(-50%, -50%) translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`,
          transition: 'all 0.1s ease-out'
        }} />
      </section>

      {/* AI Engine Features */}
      <section style={{padding: '4rem 2rem', background: 'rgba(0, 0, 0, 0.2)'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#ffffff'
          }}>
            How Our AI Engine Works
          </h2>
          
          {/* AI Process Flow */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem'
          }}>
            <div style={{
              background: 'rgba(26, 26, 26, 0.6)',
              padding: '2rem',
              borderRadius: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              position: 'relative'
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
                1️⃣
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#ffffff'}}>
                Data Ingestion
              </h3>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                Collects real-time sensor data, maintenance records, and operational 
                parameters from all mining equipment across your fleet.
              </p>
            </div>

            <div style={{
              background: 'rgba(26, 26, 26, 0.6)',
              padding: '2rem',
              borderRadius: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              position: 'relative'
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
                2️⃣
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#ffffff'}}>
                Pattern Recognition
              </h3>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                Advanced machine learning algorithms analyze patterns and identify 
                early warning signs of potential equipment failures.
              </p>
            </div>

            <div style={{
              background: 'rgba(26, 26, 26, 0.6)',
              padding: '2rem',
              borderRadius: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              position: 'relative'
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
                3️⃣
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#ffffff'}}>
                Risk Assessment
              </h3>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                Calculates failure probability scores and provides detailed risk 
                assessments with recommended maintenance actions.
              </p>
            </div>
          </div>

          {/* Prediction Examples */}
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
              Recent Predictions
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                  <h4 style={{fontSize: '1rem', fontWeight: '600', color: '#ffffff'}}>Excavator #003</h4>
                  <span style={{
                    background: '#ef4444',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>HIGH RISK</span>
                </div>
                <p style={{color: '#d1d5db', fontSize: '0.875rem', marginBottom: '0.5rem'}}>
                  Hydraulic pump failure predicted in 8 days
                </p>
                <p style={{color: '#9ca3af', fontSize: '0.75rem'}}>
                  Confidence: 94% | Cost to fix: $45,000
                </p>
              </div>

              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(245, 158, 11, 0.3)'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                  <h4 style={{fontSize: '1rem', fontWeight: '600', color: '#ffffff'}}>Haul Truck #127</h4>
                  <span style={{
                    background: '#f59e0b',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>MEDIUM RISK</span>
                </div>
                <p style={{color: '#d1d5db', fontSize: '0.875rem', marginBottom: '0.5rem'}}>
                  Engine overheating risk in 12 days
                </p>
                <p style={{color: '#9ca3af', fontSize: '0.75rem'}}>
                  Confidence: 87% | Cost to fix: $28,000
                </p>
              </div>

              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                  <h4 style={{fontSize: '1rem', fontWeight: '600', color: '#ffffff'}}>Crusher #008</h4>
                  <span style={{
                    background: '#10b981',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>LOW RISK</span>
                </div>
                <p style={{color: '#d1d5db', fontSize: '0.875rem', marginBottom: '0.5rem'}}>
                  Belt wear monitoring - normal operation
                </p>
                <p style={{color: '#9ca3af', fontSize: '0.75rem'}}>
                  Confidence: 96% | Next check: 30 days
                </p>
              </div>
            </div>
          </div>

          {/* Key Benefits */}
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
                💰
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#ffffff'}}>
                Cost Reduction
              </h3>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                Prevent expensive emergency repairs and reduce maintenance costs 
                by up to 40% through proactive maintenance scheduling.
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
                ⏰
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#ffffff'}}>
                Early Warning
              </h3>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                Get up to 14 days advance notice of potential failures, 
                allowing time to plan maintenance during optimal windows.
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
                🎯
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#ffffff'}}>
                High Accuracy
              </h3>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                Our AI models achieve 95% prediction accuracy, reducing false 
                alarms and ensuring reliable maintenance recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(245, 158, 11, 0.1))'
      }}>
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            color: '#ffffff'
          }}>
            Stop Failures Before They Happen
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#d1d5db',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Join mining operations worldwide using AI to predict and prevent equipment failures.
          </p>
          <Link href="/contact" style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '1.125rem',
            transition: 'all 0.3s ease'
          }}>
            Start Predicting Today
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
