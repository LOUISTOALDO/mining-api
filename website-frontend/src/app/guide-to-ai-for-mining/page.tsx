"use client"

import Link from "next/link"
import { useState, useRef } from "react"
import { ArrowLeft, Brain, Cpu, Database, Target, TrendingUp, Zap, Shield, ArrowRight } from "lucide-react"

export default function GuideToAIForMining() {
  const buttonAnimationRef = useRef<number | null>(null);
  
  return (
    <div style={{minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#ffffff', fontFamily: 'Inter, system-ui, sans-serif'}}>
      {/* Navigation */}
      <nav style={{position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(10, 10, 10, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #1a1a1a'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem'}}>
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
            <Link href="/" style={{color: '#e5e7eb', fontSize: '0.9rem', fontWeight: '500', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{padding: '4rem 0', backgroundColor: '#111111'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
          <div style={{textAlign: 'center', marginBottom: '3rem'}}>
            <h1 style={{fontSize: '3rem', fontWeight: '800', color: '#ffffff', marginBottom: '1rem', letterSpacing: '-0.02em'}}>
              Guide to AI for Mining
            </h1>
            <p style={{fontSize: '1.25rem', color: '#d1d5db', lineHeight: '1.6', maxWidth: '800px', margin: '0 auto'}}>
              Discover how artificial intelligence is revolutionizing mining operations, from exploration to production optimization.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section style={{padding: '4rem 0'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start'}}>
            
            {/* Left Column - Content */}
            <div>
              <h2 style={{fontSize: '2rem', fontWeight: '700', color: '#ffffff', marginBottom: '2rem'}}>
                AI Revolution in Mining
              </h2>
              
              <p style={{fontSize: '1.125rem', color: '#d1d5db', lineHeight: '1.7', marginBottom: '2rem'}}>
                Artificial Intelligence is transforming the mining industry by enabling smarter decision-making, 
                predictive maintenance, and operational optimization. From autonomous vehicles to intelligent 
                ore processing, AI is reshaping how mining operations function.
              </p>

              <h3 style={{fontSize: '1.5rem', fontWeight: '600', color: '#ffffff', marginBottom: '1.5rem', marginTop: '3rem'}}>
                Key AI Applications
              </h3>

              <div style={{display: 'grid', gap: '1.5rem', marginBottom: '3rem'}}>
                <div style={{display: 'flex', alignItems: 'start', gap: '1rem'}}>
                  <div style={{width: '3rem', height: '3rem', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                    <Brain style={{width: '1.5rem', height: '1.5rem', color: '#ffffff'}} />
                  </div>
                  <div>
                    <h4 style={{fontSize: '1.125rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.5rem'}}>
                      Autonomous Operations
                    </h4>
                    <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                      Self-driving haul trucks, automated drilling systems, and robotic equipment for safer, more efficient operations.
                    </p>
                  </div>
                </div>

                <div style={{display: 'flex', alignItems: 'start', gap: '1rem'}}>
                  <div style={{width: '3rem', height: '3rem', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                    <Target style={{width: '1.5rem', height: '1.5rem', color: '#ffffff'}} />
                  </div>
                  <div>
                    <h4 style={{fontSize: '1.125rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.5rem'}}>
                      Predictive Analytics
                    </h4>
                    <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                      Machine learning models predict equipment failures, optimize maintenance schedules, and forecast production outcomes.
                    </p>
                  </div>
                </div>

                <div style={{display: 'flex', alignItems: 'start', gap: '1rem'}}>
                  <div style={{width: '3rem', height: '3rem', background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                    <Database style={{width: '1.5rem', height: '1.5rem', color: '#ffffff'}} />
                  </div>
                  <div>
                    <h4 style={{fontSize: '1.125rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.5rem'}}>
                      Data Intelligence
                    </h4>
                    <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                      Advanced analytics extract insights from vast amounts of operational data to improve decision-making.
                    </p>
                  </div>
                </div>
              </div>

              <h3 style={{fontSize: '1.5rem', fontWeight: '600', color: '#ffffff', marginBottom: '1.5rem'}}>
                Implementation Roadmap
              </h3>

              <div style={{display: 'grid', gap: '1rem'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#111111', borderRadius: '0.5rem', border: '1px solid #2a2a2a'}}>
                  <div style={{width: '2rem', height: '2rem', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: '600', fontSize: '0.875rem'}}>1</div>
                  <span style={{color: '#d1d5db'}}>Assess current infrastructure and data quality</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#111111', borderRadius: '0.5rem', border: '1px solid #2a2a2a'}}>
                  <div style={{width: '2rem', height: '2rem', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: '600', fontSize: '0.875rem'}}>2</div>
                  <span style={{color: '#d1d5db'}}>Start with pilot projects and proof of concepts</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#111111', borderRadius: '0.5rem', border: '1px solid #2a2a2a'}}>
                  <div style={{width: '2rem', height: '2rem', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: '600', fontSize: '0.875rem'}}>3</div>
                  <span style={{color: '#d1d5db'}}>Build AI talent and capabilities</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#111111', borderRadius: '0.5rem', border: '1px solid #2a2a2a'}}>
                  <div style={{width: '2rem', height: '2rem', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: '600', fontSize: '0.875rem'}}>4</div>
                  <span style={{color: '#d1d5db'}}>Scale successful AI implementations</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#111111', borderRadius: '0.5rem', border: '1px solid #2a2a2a'}}>
                  <div style={{width: '2rem', height: '2rem', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: '600', fontSize: '0.875rem'}}>5</div>
                  <span style={{color: '#d1d5db'}}>Continuously optimize and expand AI capabilities</span>
                </div>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div style={{position: 'sticky', top: '6rem'}}>
              <div style={{backgroundColor: '#111111', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a', marginBottom: '2rem'}}>
                <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem'}}>
                  AI Impact Metrics
                </h3>
                <div style={{height: '300px', background: 'linear-gradient(135deg, #1e293b, #334155)', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', padding: '1rem', gap: '1.5rem'}}>
                  {/* AI Impact Visualization */}
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{color: '#d1d5db', fontSize: '0.875rem'}}>Productivity</span>
                    <div style={{width: '120px', height: '8px', background: '#374151', borderRadius: '4px', position: 'relative'}}>
                      <div style={{width: '85%', height: '100%', background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)', borderRadius: '4px'}}></div>
                    </div>
                    <span style={{color: '#3b82f6', fontWeight: '600', fontSize: '0.875rem'}}>+35%</span>
                  </div>
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{color: '#d1d5db', fontSize: '0.875rem'}}>Safety</span>
                    <div style={{width: '120px', height: '8px', background: '#374151', borderRadius: '4px', position: 'relative'}}>
                      <div style={{width: '92%', height: '100%', background: 'linear-gradient(90deg, #10b981, #059669)', borderRadius: '4px'}}></div>
                    </div>
                    <span style={{color: '#10b981', fontWeight: '600', fontSize: '0.875rem'}}>+48%</span>
                  </div>
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{color: '#d1d5db', fontSize: '0.875rem'}}>Efficiency</span>
                    <div style={{width: '120px', height: '8px', background: '#374151', borderRadius: '4px', position: 'relative'}}>
                      <div style={{width: '78%', height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #7c3aed)', borderRadius: '4px'}}></div>
                    </div>
                    <span style={{color: '#8b5cf6', fontWeight: '600', fontSize: '0.875rem'}}>+28%</span>
                  </div>
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{color: '#d1d5db', fontSize: '0.875rem'}}>Cost Reduction</span>
                    <div style={{width: '120px', height: '8px', background: '#374151', borderRadius: '4px', position: 'relative'}}>
                      <div style={{width: '65%', height: '100%', background: 'linear-gradient(90deg, #f59e0b, #d97706)', borderRadius: '4px'}}></div>
                    </div>
                    <span style={{color: '#f59e0b', fontWeight: '600', fontSize: '0.875rem'}}>+22%</span>
                  </div>
                </div>
              </div>

              <div style={{backgroundColor: '#111111', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a'}}>
                <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem'}}>
                  AI Technologies
                </h3>
                <div style={{display: 'grid', gap: '1rem'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{color: '#d1d5db'}}>Machine Learning</span>
                    <span style={{color: '#3b82f6', fontWeight: '600'}}>95%</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{color: '#d1d5db'}}>Computer Vision</span>
                    <span style={{color: '#10b981', fontWeight: '600'}}>87%</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{color: '#d1d5db'}}>Natural Language</span>
                    <span style={{color: '#8b5cf6', fontWeight: '600'}}>72%</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{color: '#d1d5db'}}>Robotics</span>
                    <span style={{color: '#f59e0b', fontWeight: '600'}}>68%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Use Cases Section */}
      <section style={{padding: '4rem 0', backgroundColor: '#111111'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
          <h2 style={{fontSize: '2rem', fontWeight: '700', color: '#ffffff', marginBottom: '2rem', textAlign: 'center'}}>
            AI Use Cases in Mining
          </h2>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
            <div style={{backgroundColor: '#0a0a0a', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'}}>
                <Cpu style={{width: '2rem', height: '2rem', color: '#3b82f6'}} />
                <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#ffffff'}}>
                  Autonomous Vehicles
                </h3>
              </div>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                Self-driving haul trucks and excavators that operate 24/7 with improved safety and efficiency.
              </p>
            </div>

            <div style={{backgroundColor: '#0a0a0a', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'}}>
                <TrendingUp style={{width: '2rem', height: '2rem', color: '#10b981'}} />
                <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#ffffff'}}>
                  Process Optimization
                </h3>
              </div>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                AI algorithms optimize ore processing, energy consumption, and production scheduling for maximum efficiency.
              </p>
            </div>

            <div style={{backgroundColor: '#0a0a0a', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'}}>
                <Shield style={{width: '2rem', height: '2rem', color: '#f59e0b'}} />
                <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#ffffff'}}>
                  Safety Monitoring
                </h3>
              </div>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                Computer vision systems monitor worker safety, detect hazards, and prevent accidents in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{padding: '4rem 0'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', textAlign: 'center'}}>
          <h2 style={{fontSize: '2rem', fontWeight: '700', color: '#ffffff', marginBottom: '1rem'}}>
            Start Your AI Journey
          </h2>
          <p style={{fontSize: '1.125rem', color: '#d1d5db', marginBottom: '2rem'}}>
            Transform your mining operations with Elysium's comprehensive AI solutions and expert guidance.
          </p>
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
            <button 
              onClick={() => window.location.href = '/contact'}
              style={{
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
                minWidth: '180px',
                justifyContent: 'center',
                gap: '0.5rem'
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
            >
              Get Started
              <ArrowRight size={20} />
            </button>
            <Link href="/" style={{
              backgroundColor: 'transparent',
              color: '#e5e7eb',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              textDecoration: 'none',
              border: '1px solid #374151'
            }}>
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
