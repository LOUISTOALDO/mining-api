"use client"

import Link from "next/link"
import { useState, useRef } from "react"
import { ArrowLeft, Users, Target, Award, Globe, TrendingUp, Shield, Zap, ArrowRight } from "lucide-react"

export default function AboutPage() {
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
              About Elysium
            </h1>
            <p style={{fontSize: '1.25rem', color: '#d1d5db', lineHeight: '1.6', maxWidth: '800px', margin: '0 auto'}}>
              Pioneering the future of mining operations through AI-powered predictive maintenance and intelligent equipment monitoring.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section style={{padding: '4rem 0'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center'}}>
            <div>
              <h2 style={{fontSize: '2.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '2rem'}}>
                Our Mission
              </h2>
              <p style={{fontSize: '1.125rem', color: '#d1d5db', lineHeight: '1.7', marginBottom: '2rem'}}>
                At Elysium, we're transforming mining operations through cutting-edge artificial intelligence and machine learning technologies. 
                Our mission is to make mining safer, more efficient, and more sustainable by predicting equipment failures before they happen 
                and optimizing operations in real-time.
              </p>
              <p style={{fontSize: '1.125rem', color: '#d1d5db', lineHeight: '1.7'}}>
                We believe that the future of mining lies in intelligent automation, predictive analytics, and data-driven decision making. 
                By harnessing the power of AI, we're helping mining companies reduce downtime, improve safety, and maximize productivity.
              </p>
            </div>
            <div style={{backgroundColor: '#111111', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a'}}>
              <h3 style={{fontSize: '1.5rem', fontWeight: '600', color: '#ffffff', marginBottom: '1.5rem'}}>
                Our Impact
              </h3>
              <div style={{display: 'grid', gap: '1.5rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{color: '#d1d5db'}}>Downtime Reduction</span>
                  <span style={{color: '#10b981', fontWeight: '600', fontSize: '1.25rem'}}>50%</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{color: '#d1d5db'}}>Safety Improvement</span>
                  <span style={{color: '#3b82f6', fontWeight: '600', fontSize: '1.25rem'}}>45%</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{color: '#d1d5db'}}>Cost Savings</span>
                  <span style={{color: '#f59e0b', fontWeight: '600', fontSize: '1.25rem'}}>$2M+</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{color: '#d1d5db'}}>Prediction Accuracy</span>
                  <span style={{color: '#8b5cf6', fontWeight: '600', fontSize: '1.25rem'}}>95%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section style={{padding: '4rem 0', backgroundColor: '#111111'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
          <h2 style={{fontSize: '2.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '3rem', textAlign: 'center'}}>
            Our Values
          </h2>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
            <div style={{backgroundColor: '#0a0a0a', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem'}}>
                <Shield style={{width: '2.5rem', height: '2.5rem', color: '#ef4444'}} />
                <h3 style={{fontSize: '1.5rem', fontWeight: '600', color: '#ffffff'}}>
                  Safety First
                </h3>
              </div>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                Worker safety is our top priority. We develop AI solutions that prevent accidents and create safer working environments for mining professionals.
              </p>
            </div>

            <div style={{backgroundColor: '#0a0a0a', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem'}}>
                <Zap style={{width: '2.5rem', height: '2.5rem', color: '#3b82f6'}} />
                <h3 style={{fontSize: '1.5rem', fontWeight: '600', color: '#ffffff'}}>
                  Innovation
                </h3>
              </div>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                We continuously push the boundaries of what's possible with AI and machine learning, developing cutting-edge solutions for the mining industry.
              </p>
            </div>

            <div style={{backgroundColor: '#0a0a0a', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem'}}>
                <Target style={{width: '2.5rem', height: '2.5rem', color: '#10b981'}} />
                <h3 style={{fontSize: '1.5rem', fontWeight: '600', color: '#ffffff'}}>
                  Excellence
                </h3>
              </div>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                We strive for excellence in everything we do, from our AI models to our customer service, ensuring the highest quality solutions for our clients.
              </p>
            </div>

            <div style={{backgroundColor: '#0a0a0a', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem'}}>
                <Globe style={{width: '2.5rem', height: '2.5rem', color: '#f59e0b'}} />
                <h3 style={{fontSize: '1.5rem', fontWeight: '600', color: '#ffffff'}}>
                  Sustainability
                </h3>
              </div>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                We're committed to sustainable mining practices, helping operations reduce environmental impact through intelligent optimization and efficiency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section style={{padding: '4rem 0'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
          <h2 style={{fontSize: '2.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '3rem', textAlign: 'center'}}>
            Our Team
          </h2>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
            <div style={{backgroundColor: '#111111', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a', textAlign: 'center'}}>
              <div style={{width: '80px', height: '80px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', borderRadius: '50%', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Users style={{width: '2rem', height: '2rem', color: '#ffffff'}} />
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.5rem'}}>
                AI Engineers
              </h3>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                World-class machine learning engineers and data scientists developing cutting-edge AI models for mining applications.
              </p>
            </div>

            <div style={{backgroundColor: '#111111', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a', textAlign: 'center'}}>
              <div style={{width: '80px', height: '80px', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '50%', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Award style={{width: '2rem', height: '2rem', color: '#ffffff'}} />
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.5rem'}}>
                Mining Experts
              </h3>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                Industry veterans with decades of experience in mining operations, equipment maintenance, and operational optimization.
              </p>
            </div>

            <div style={{backgroundColor: '#111111', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a', textAlign: 'center'}}>
              <div style={{width: '80px', height: '80px', background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', borderRadius: '50%', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <TrendingUp style={{width: '2rem', height: '2rem', color: '#ffffff'}} />
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.5rem'}}>
                Product Team
              </h3>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                Product managers and designers creating intuitive, powerful interfaces that make complex AI accessible to mining professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section style={{padding: '4rem 0', backgroundColor: '#111111'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center'}}>
            <div style={{backgroundColor: '#0a0a0a', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a'}}>
              <h3 style={{fontSize: '1.5rem', fontWeight: '600', color: '#ffffff', marginBottom: '1.5rem'}}>
                Our Technology Stack
              </h3>
              <div style={{display: 'grid', gap: '1rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{color: '#d1d5db'}}>Machine Learning</span>
                  <span style={{color: '#3b82f6', fontWeight: '600'}}>TensorFlow, PyTorch</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{color: '#d1d5db'}}>Data Processing</span>
                  <span style={{color: '#10b981', fontWeight: '600'}}>Apache Spark, Kafka</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{color: '#d1d5db'}}>Cloud Infrastructure</span>
                  <span style={{color: '#f59e0b', fontWeight: '600'}}>AWS, Azure</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{color: '#d1d5db'}}>Real-time Analytics</span>
                  <span style={{color: '#8b5cf6', fontWeight: '600'}}>InfluxDB, Redis</span>
                </div>
              </div>
            </div>
            <div>
              <h2 style={{fontSize: '2.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '2rem'}}>
                Cutting-Edge Technology
              </h2>
              <p style={{fontSize: '1.125rem', color: '#d1d5db', lineHeight: '1.7', marginBottom: '2rem'}}>
                Elysium leverages the latest advances in artificial intelligence, machine learning, and IoT technologies to deliver 
                unprecedented insights into mining operations. Our platform combines real-time data processing, predictive analytics, 
                and intelligent automation to optimize every aspect of mining operations.
              </p>
              <p style={{fontSize: '1.125rem', color: '#d1d5db', lineHeight: '1.7'}}>
                From computer vision systems that monitor worker safety to advanced neural networks that predict equipment failures 
                weeks in advance, our technology stack is designed to handle the unique challenges of modern mining operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{padding: '4rem 0'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', textAlign: 'center'}}>
          <h2 style={{fontSize: '2rem', fontWeight: '700', color: '#ffffff', marginBottom: '1rem'}}>
            Join the Mining Revolution
          </h2>
          <p style={{fontSize: '1.125rem', color: '#d1d5db', marginBottom: '2rem'}}>
            Partner with Elysium to transform your mining operations with AI-powered predictive maintenance and intelligent monitoring.
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