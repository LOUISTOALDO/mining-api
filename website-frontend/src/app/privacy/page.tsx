"use client"

import Link from "next/link"
import { useState, useRef } from "react"
import { ArrowLeft, Shield, Lock, Eye, Database, Users, Globe, AlertCircle, ArrowRight } from "lucide-react"

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p style={{fontSize: '1.25rem', color: '#d1d5db', lineHeight: '1.6', maxWidth: '800px', margin: '0 auto'}}>
              Your privacy is important to us. Learn how Elysium collects, uses, and protects your data in our AI-powered mining solutions.
            </p>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '1rem'}}>
              <Shield style={{width: '1rem', height: '1rem', color: '#10b981'}} />
              <span style={{color: '#10b981', fontSize: '0.875rem', fontWeight: '600'}}>GDPR & CCPA Compliant</span>
            </div>
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
                Information We Collect
              </h2>
              
              <p style={{fontSize: '1.125rem', color: '#d1d5db', lineHeight: '1.7', marginBottom: '2rem'}}>
                Elysium collects information necessary to provide our AI-powered mining solutions and improve our services. 
                We collect data in the following categories:
              </p>

              <h3 style={{fontSize: '1.5rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem', marginTop: '2rem'}}>
                Equipment Data
              </h3>
              <ul style={{color: '#d1d5db', lineHeight: '1.7', marginBottom: '2rem', paddingLeft: '1.5rem'}}>
                <li style={{marginBottom: '0.5rem'}}>Sensor readings from mining equipment</li>
                <li style={{marginBottom: '0.5rem'}}>Performance metrics and operational data</li>
                <li style={{marginBottom: '0.5rem'}}>Maintenance records and service history</li>
                <li style={{marginBottom: '0.5rem'}}>Environmental conditions and safety data</li>
              </ul>

              <h3 style={{fontSize: '1.5rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem', marginTop: '2rem'}}>
                User Information
              </h3>
              <ul style={{color: '#d1d5db', lineHeight: '1.7', marginBottom: '2rem', paddingLeft: '1.5rem'}}>
                <li style={{marginBottom: '0.5rem'}}>Account credentials and contact information</li>
                <li style={{marginBottom: '0.5rem'}}>Usage patterns and service interactions</li>
                <li style={{marginBottom: '0.5rem'}}>Communication preferences and support requests</li>
                <li style={{marginBottom: '0.5rem'}}>Billing and payment information</li>
              </ul>

              <h2 style={{fontSize: '2rem', fontWeight: '700', color: '#ffffff', marginBottom: '2rem', marginTop: '3rem'}}>
                How We Use Your Data
              </h2>
              
              <p style={{fontSize: '1.125rem', color: '#d1d5db', lineHeight: '1.7', marginBottom: '2rem'}}>
                We use collected data to provide, maintain, and improve our services:
              </p>

              <ul style={{color: '#d1d5db', lineHeight: '1.7', marginBottom: '2rem', paddingLeft: '1.5rem'}}>
                <li style={{marginBottom: '0.5rem'}}>Train and improve our AI models for better predictions</li>
                <li style={{marginBottom: '0.5rem'}}>Provide real-time monitoring and alerting services</li>
                <li style={{marginBottom: '0.5rem'}}>Generate insights and analytics for operational optimization</li>
                <li style={{marginBottom: '0.5rem'}}>Ensure system security and prevent unauthorized access</li>
                <li style={{marginBottom: '0.5rem'}}>Comply with legal obligations and regulatory requirements</li>
              </ul>
            </div>

            {/* Right Column - Visual */}
            <div style={{position: 'sticky', top: '6rem'}}>
              <div style={{backgroundColor: '#111111', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a', marginBottom: '2rem'}}>
                <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem'}}>
                  Data Protection Measures
                </h3>
                <div style={{display: 'grid', gap: '1rem'}}>
                  <div style={{display: 'flex', alignItems: 'start', gap: '0.75rem'}}>
                    <Lock style={{width: '1.25rem', height: '1.25rem', color: '#10b981', flexShrink: 0, marginTop: '0.125rem'}} />
                    <div>
                      <h4 style={{fontSize: '0.875rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.25rem'}}>
                        Encryption
                      </h4>
                      <p style={{color: '#d1d5db', fontSize: '0.875rem', lineHeight: '1.5'}}>
                        All data is encrypted in transit and at rest using AES-256 encryption.
                      </p>
                    </div>
                  </div>
                  
                  <div style={{display: 'flex', alignItems: 'start', gap: '0.75rem'}}>
                    <Shield style={{width: '1.25rem', height: '1.25rem', color: '#3b82f6', flexShrink: 0, marginTop: '0.125rem'}} />
                    <div>
                      <h4 style={{fontSize: '0.875rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.25rem'}}>
                        Access Controls
                      </h4>
                      <p style={{color: '#d1d5db', fontSize: '0.875rem', lineHeight: '1.5'}}>
                        Strict access controls and multi-factor authentication protect your data.
                      </p>
                    </div>
                  </div>
                  
                  <div style={{display: 'flex', alignItems: 'start', gap: '0.75rem'}}>
                    <Database style={{width: '1.25rem', height: '1.25rem', color: '#f59e0b', flexShrink: 0, marginTop: '0.125rem'}} />
                    <div>
                      <h4 style={{fontSize: '0.875rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.25rem'}}>
                        Data Residency
                      </h4>
                      <p style={{color: '#d1d5db', fontSize: '0.875rem', lineHeight: '1.5'}}>
                        Data is stored in secure, geographically distributed data centers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{backgroundColor: '#111111', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a'}}>
                <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem'}}>
                  Your Rights
                </h3>
                <div style={{display: 'grid', gap: '1rem'}}>
                  <div>
                    <p style={{color: '#d1d5db', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Access & Portability</p>
                    <p style={{color: '#ffffff', fontSize: '0.875rem', fontWeight: '600'}}>Request your data</p>
                  </div>
                  <div>
                    <p style={{color: '#d1d5db', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Correction</p>
                    <p style={{color: '#ffffff', fontSize: '0.875rem', fontWeight: '600'}}>Update inaccurate data</p>
                  </div>
                  <div>
                    <p style={{color: '#d1d5db', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Deletion</p>
                    <p style={{color: '#ffffff', fontSize: '0.875rem', fontWeight: '600'}}>Request data deletion</p>
                  </div>
                  <div>
                    <p style={{color: '#d1d5db', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Opt-out</p>
                    <p style={{color: '#ffffff', fontSize: '0.875rem', fontWeight: '600'}}>Unsubscribe from communications</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Sharing Section */}
      <section style={{padding: '4rem 0', backgroundColor: '#111111'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
          <h2 style={{fontSize: '2.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '2rem', textAlign: 'center'}}>
            Data Sharing and Third Parties
          </h2>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
            <div style={{backgroundColor: '#0a0a0a', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'}}>
                <Users style={{width: '2rem', height: '2rem', color: '#3b82f6'}} />
                <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#ffffff'}}>
                  Service Providers
                </h3>
              </div>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                We may share data with trusted service providers who assist in delivering our services, such as cloud hosting, 
                analytics, and customer support. All providers are bound by strict confidentiality agreements.
              </p>
            </div>

            <div style={{backgroundColor: '#0a0a0a', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'}}>
                <Globe style={{width: '2rem', height: '2rem', color: '#10b981'}} />
                <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#ffffff'}}>
                  Legal Requirements
                </h3>
              </div>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                We may disclose data when required by law, court order, or to protect our rights, property, or safety, 
                or that of our users or the public.
              </p>
            </div>

            <div style={{backgroundColor: '#0a0a0a', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'}}>
                <Eye style={{width: '2rem', height: '2rem', color: '#f59e0b'}} />
                <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#ffffff'}}>
                  Business Transfers
                </h3>
              </div>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                In the event of a merger, acquisition, or sale of assets, user data may be transferred as part of the transaction, 
                subject to the same privacy protections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cookie Policy Section */}
      <section style={{padding: '4rem 0'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center'}}>
            <div>
              <h2 style={{fontSize: '2.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '2rem'}}>
                Cookies and Tracking
              </h2>
              <p style={{fontSize: '1.125rem', color: '#d1d5db', lineHeight: '1.7', marginBottom: '2rem'}}>
                We use cookies and similar technologies to enhance your experience, analyze usage patterns, and improve our services. 
                You can control cookie preferences through your browser settings.
              </p>
              <p style={{fontSize: '1.125rem', color: '#d1d5db', lineHeight: '1.7'}}>
                Essential cookies are required for the basic functionality of our services, while analytics cookies help us 
                understand how users interact with our platform to make improvements.
              </p>
            </div>
            <div style={{backgroundColor: '#111111', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a'}}>
              <h3 style={{fontSize: '1.5rem', fontWeight: '600', color: '#ffffff', marginBottom: '1.5rem'}}>
                Cookie Categories
              </h3>
              <div style={{display: 'grid', gap: '1rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{color: '#d1d5db'}}>Essential</span>
                  <span style={{color: '#10b981', fontWeight: '600'}}>Always Active</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{color: '#d1d5db'}}>Analytics</span>
                  <span style={{color: '#3b82f6', fontWeight: '600'}}>Optional</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{color: '#d1d5db'}}>Marketing</span>
                  <span style={{color: '#f59e0b', fontWeight: '600'}}>Optional</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{color: '#d1d5db'}}>Preference</span>
                  <span style={{color: '#8b5cf6', fontWeight: '600'}}>Optional</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{padding: '4rem 0', backgroundColor: '#111111'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', textAlign: 'center'}}>
          <h2 style={{fontSize: '2rem', fontWeight: '700', color: '#ffffff', marginBottom: '1rem'}}>
            Privacy Questions?
          </h2>
          <p style={{fontSize: '1.125rem', color: '#d1d5db', marginBottom: '2rem'}}>
            If you have questions about our privacy practices or want to exercise your data rights, please contact our privacy team.
          </p>
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
            <button 
              onClick={() => window.location.href = 'mailto:privacy@elysium.com'}
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
