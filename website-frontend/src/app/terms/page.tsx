"use client"

import Link from "next/link"
import { useState, useRef } from "react"
import { ArrowLeft, FileText, Calendar, Shield, AlertTriangle, ArrowRight } from "lucide-react"

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p style={{fontSize: '1.25rem', color: '#d1d5db', lineHeight: '1.6', maxWidth: '800px', margin: '0 auto'}}>
              Please read these terms carefully before using Elysium's AI-powered mining solutions and services.
            </p>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '1rem'}}>
              <Calendar style={{width: '1rem', height: '1rem', color: '#9ca3af'}} />
              <span style={{color: '#9ca3af', fontSize: '0.875rem'}}>Last updated: January 1, 2025</span>
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
                1. Acceptance of Terms
              </h2>
              
              <p style={{fontSize: '1.125rem', color: '#d1d5db', lineHeight: '1.7', marginBottom: '2rem'}}>
                By accessing and using Elysium's services, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>

              <h2 style={{fontSize: '2rem', fontWeight: '700', color: '#ffffff', marginBottom: '2rem', marginTop: '3rem'}}>
                2. Service Description
              </h2>
              
              <p style={{fontSize: '1.125rem', color: '#d1d5db', lineHeight: '1.7', marginBottom: '2rem'}}>
                Elysium provides AI-powered predictive maintenance, equipment monitoring, and operational optimization services for mining operations. 
                Our services include but are not limited to:
              </p>

              <ul style={{color: '#d1d5db', lineHeight: '1.7', marginBottom: '2rem', paddingLeft: '1.5rem'}}>
                <li style={{marginBottom: '0.5rem'}}>Machine learning models for equipment failure prediction</li>
                <li style={{marginBottom: '0.5rem'}}>Real-time monitoring and analytics dashboards</li>
                <li style={{marginBottom: '0.5rem'}}>IoT sensor data collection and processing</li>
                <li style={{marginBottom: '0.5rem'}}>Safety monitoring and risk assessment tools</li>
                <li style={{marginBottom: '0.5rem'}}>Fleet management and optimization solutions</li>
              </ul>

              <h2 style={{fontSize: '2rem', fontWeight: '700', color: '#ffffff', marginBottom: '2rem', marginTop: '3rem'}}>
                3. User Responsibilities
              </h2>
              
              <p style={{fontSize: '1.125rem', color: '#d1d5db', lineHeight: '1.7', marginBottom: '2rem'}}>
                Users are responsible for:
              </p>

              <ul style={{color: '#d1d5db', lineHeight: '1.7', marginBottom: '2rem', paddingLeft: '1.5rem'}}>
                <li style={{marginBottom: '0.5rem'}}>Providing accurate and complete information</li>
                <li style={{marginBottom: '0.5rem'}}>Maintaining the security of their account credentials</li>
                <li style={{marginBottom: '0.5rem'}}>Complying with all applicable laws and regulations</li>
                <li style={{marginBottom: '0.5rem'}}>Using the services only for lawful purposes</li>
                <li style={{marginBottom: '0.5rem'}}>Not interfering with the proper functioning of our systems</li>
              </ul>

              <h2 style={{fontSize: '2rem', fontWeight: '700', color: '#ffffff', marginBottom: '2rem', marginTop: '3rem'}}>
                4. Data and Privacy
              </h2>
              
              <p style={{fontSize: '1.125rem', color: '#d1d5db', lineHeight: '1.7', marginBottom: '2rem'}}>
                Elysium is committed to protecting your data and privacy. We collect, process, and store data in accordance with our 
                Privacy Policy and applicable data protection laws. By using our services, you consent to our data practices as described 
                in our Privacy Policy.
              </p>
            </div>

            {/* Right Column - Visual */}
            <div style={{position: 'sticky', top: '6rem'}}>
              <div style={{backgroundColor: '#111111', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a', marginBottom: '2rem'}}>
                <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem'}}>
                  Key Points
                </h3>
                <div style={{display: 'grid', gap: '1rem'}}>
                  <div style={{display: 'flex', alignItems: 'start', gap: '0.75rem'}}>
                    <Shield style={{width: '1.25rem', height: '1.25rem', color: '#10b981', flexShrink: 0, marginTop: '0.125rem'}} />
                    <div>
                      <h4 style={{fontSize: '0.875rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.25rem'}}>
                        Data Protection
                      </h4>
                      <p style={{color: '#d1d5db', fontSize: '0.875rem', lineHeight: '1.5'}}>
                        Your data is protected with enterprise-grade security measures and encryption.
                      </p>
                    </div>
                  </div>
                  
                  <div style={{display: 'flex', alignItems: 'start', gap: '0.75rem'}}>
                    <FileText style={{width: '1.25rem', height: '1.25rem', color: '#3b82f6', flexShrink: 0, marginTop: '0.125rem'}} />
                    <div>
                      <h4 style={{fontSize: '0.875rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.25rem'}}>
                        Service Availability
                      </h4>
                      <p style={{color: '#d1d5db', fontSize: '0.875rem', lineHeight: '1.5'}}>
                        We strive for 99.9% uptime but cannot guarantee uninterrupted service.
                      </p>
                    </div>
                  </div>
                  
                  <div style={{display: 'flex', alignItems: 'start', gap: '0.75rem'}}>
                    <AlertTriangle style={{width: '1.25rem', height: '1.25rem', color: '#f59e0b', flexShrink: 0, marginTop: '0.125rem'}} />
                    <div>
                      <h4 style={{fontSize: '0.875rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.25rem'}}>
                        Limitation of Liability
                      </h4>
                      <p style={{color: '#d1d5db', fontSize: '0.875rem', lineHeight: '1.5'}}>
                        Our liability is limited to the amount paid for the services in the 12 months preceding the claim.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{backgroundColor: '#111111', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a'}}>
                <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem'}}>
                  Contact Information
                </h3>
                <div style={{display: 'grid', gap: '1rem'}}>
                  <div>
                    <p style={{color: '#d1d5db', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Legal Questions</p>
                    <p style={{color: '#ffffff', fontSize: '0.875rem', fontWeight: '600'}}>legal@elysium.com</p>
                  </div>
                  <div>
                    <p style={{color: '#d1d5db', fontSize: '0.875rem', marginBottom: '0.25rem'}}>General Support</p>
                    <p style={{color: '#ffffff', fontSize: '0.875rem', fontWeight: '600'}}>support@elysium.com</p>
                  </div>
                  <div>
                    <p style={{color: '#d1d5db', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Business Inquiries</p>
                    <p style={{color: '#ffffff', fontSize: '0.875rem', fontWeight: '600'}}>business@elysium.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Terms Section */}
      <section style={{padding: '4rem 0', backgroundColor: '#111111'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
            <div style={{backgroundColor: '#0a0a0a', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a'}}>
              <h3 style={{fontSize: '1.5rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem'}}>
                5. Intellectual Property
              </h3>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                All intellectual property rights in our services, including but not limited to software, algorithms, and documentation, 
                remain the exclusive property of Elysium. Users may not copy, modify, or distribute our proprietary technology.
              </p>
            </div>

            <div style={{backgroundColor: '#0a0a0a', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a'}}>
              <h3 style={{fontSize: '1.5rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem'}}>
                6. Payment Terms
              </h3>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                Payment terms are specified in your service agreement. Fees are typically billed monthly or annually in advance. 
                Late payments may result in service suspension or termination.
              </p>
            </div>

            <div style={{backgroundColor: '#0a0a0a', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a'}}>
              <h3 style={{fontSize: '1.5rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem'}}>
                7. Termination
              </h3>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                Either party may terminate the service agreement with 30 days written notice. Elysium reserves the right to 
                terminate services immediately for violations of these terms.
              </p>
            </div>

            <div style={{backgroundColor: '#0a0a0a', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a'}}>
              <h3 style={{fontSize: '1.5rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem'}}>
                8. Governing Law
              </h3>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                These terms are governed by the laws of the jurisdiction where Elysium is incorporated. Any disputes will be 
                resolved through binding arbitration.
              </p>
            </div>

            <div style={{backgroundColor: '#0a0a0a', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a'}}>
              <h3 style={{fontSize: '1.5rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem'}}>
                9. Service Level Agreement
              </h3>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                We provide a 99.9% uptime SLA for our core services. Service credits may be available for qualifying downtime 
                events as specified in your service agreement.
              </p>
            </div>

            <div style={{backgroundColor: '#0a0a0a', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a'}}>
              <h3 style={{fontSize: '1.5rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem'}}>
                10. Updates to Terms
              </h3>
              <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
                We may update these terms from time to time. Material changes will be communicated with 30 days notice. 
                Continued use of our services constitutes acceptance of updated terms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{padding: '4rem 0'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', textAlign: 'center'}}>
          <h2 style={{fontSize: '2rem', fontWeight: '700', color: '#ffffff', marginBottom: '1rem'}}>
            Questions About Our Terms?
          </h2>
          <p style={{fontSize: '1.125rem', color: '#d1d5db', marginBottom: '2rem'}}>
            If you have any questions about these terms of service, please don't hesitate to contact our legal team.
          </p>
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
            <button 
              onClick={() => window.location.href = 'mailto:legal@elysium.com'}
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
