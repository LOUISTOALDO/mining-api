"use client"

import { ArrowRight, Shield, Lock, Users, Globe, Award, CheckCircle, Zap, Database, Brain } from "lucide-react"
import Link from "next/link"
import { useState, useRef } from "react"

// Updated header buttons - cache bust v1


export default function EnterprisePage() {
  const buttonAnimationRef = useRef<number | null>(null)
  
  const enterpriseFeatures = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with end-to-end encryption, multi-factor authentication, and comprehensive audit logging.",
      features: ["SOC 2 Type II Certified", "GDPR Compliant", "End-to-End Encryption", "Multi-Factor Authentication"]
    },
    {
      icon: Lock,
      title: "Data Privacy",
      description: "Complete data sovereignty with on-premise deployment options and comprehensive privacy controls.",
      features: ["Data Residency Controls", "On-Premise Deployment", "Privacy by Design", "Data Anonymization"]
    },
    {
      icon: Users,
      title: "Role-Based Access",
      description: "Granular permission system with custom roles, team management, and advanced user controls.",
      features: ["Custom Role Creation", "Team Management", "API Key Management", "Session Controls"]
    },
    {
      icon: Globe,
      title: "Global Infrastructure",
      description: "Worldwide deployment with 99.9% uptime SLA, global CDN, and multi-region redundancy.",
      features: ["99.9% Uptime SLA", "Global CDN", "Multi-Region Deployment", "Disaster Recovery"]
    }
  ]

  const complianceStandards = [
    { name: "SOC 2 Type II", status: "Certified", color: "#10b981" },
    { name: "ISO 27001", status: "Certified", color: "#10b981" },
    { name: "GDPR", status: "Compliant", color: "#10b981" },
    { name: "HIPAA", status: "Compliant", color: "#10b981" },
    { name: "CCPA", status: "Compliant", color: "#10b981" },
    { name: "FedRAMP", status: "In Progress", color: "#f59e0b" }
  ]

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
            
            <div style={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
              <Link href="/products" style={{color: '#e5e7eb', fontSize: '0.9rem', fontWeight: '500', textDecoration: 'none', transition: 'color 0.2s'}}>Products</Link>
              <Link href="/solutions" style={{color: '#e5e7eb', fontSize: '0.9rem', fontWeight: '500', textDecoration: 'none', transition: 'color 0.2s'}}>Solutions</Link>
              <Link href="/enterprise" style={{color: '#3b82f6', fontSize: '0.9rem', fontWeight: '500', textDecoration: 'none'}}>Enterprise</Link>
            </div>
            
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
              <Link href="/" style={{color: '#e5e7eb', fontSize: '0.9rem', fontWeight: '500', textDecoration: 'none'}}>Back to Home</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{padding: '6rem 0', minHeight: '60vh', display: 'flex', alignItems: 'center'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', width: '100%'}}>
          <div style={{textAlign: 'center', marginBottom: '4rem'}}>
            <h1 style={{fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.1', color: '#ffffff', marginBottom: '1.5rem', letterSpacing: '-0.02em'}}>
              <span style={{display: 'block', color: '#3b82f6'}}>Enterprise-Grade</span>
              <span style={{display: 'block'}}>AI Solutions</span>
            </h1>
            
            <p style={{fontSize: '1.25rem', color: '#d1d5db', lineHeight: '1.6', marginBottom: '2rem', fontWeight: '400', maxWidth: '800px', margin: '0 auto 2rem auto'}}>
              Built for enterprise scale with security, compliance, and reliability at the core. Trusted by Fortune 500 companies and government agencies worldwide.
            </p>
            
            <div style={{display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'center', marginTop: '2rem'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <Award style={{width: '1.5rem', height: '1.5rem', color: '#10b981'}} />
                <span style={{color: '#d1d5db', fontSize: '0.9rem', fontWeight: '500'}}>SOC 2 Certified</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <Shield style={{width: '1.5rem', height: '1.5rem', color: '#3b82f6'}} />
                <span style={{color: '#d1d5db', fontSize: '0.9rem', fontWeight: '500'}}>99.9% Uptime SLA</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <Globe style={{width: '1.5rem', height: '1.5rem', color: '#8b5cf6'}} />
                <span style={{color: '#d1d5db', fontSize: '0.9rem', fontWeight: '500'}}>Global Deployment</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section style={{padding: '4rem 0', backgroundColor: '#111111'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
          <div style={{textAlign: 'center', marginBottom: '4rem'}}>
            <h2 style={{fontSize: '2.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '1rem'}}>
              Enterprise Features
            </h2>
            <p style={{fontSize: '1.125rem', color: '#9ca3af', maxWidth: '600px', margin: '0 auto'}}>
              Comprehensive enterprise capabilities designed for large-scale deployments and mission-critical operations
            </p>
          </div>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
            {enterpriseFeatures.map((feature, index) => (
              <div key={index} style={{backgroundColor: '#1a1a1a', padding: '2.5rem', borderRadius: '1rem', border: '1px solid #2a2a2a', transition: 'all 0.3s'}}>
                <div style={{width: '4rem', height: '4rem', backgroundColor: '#3b82f6', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem'}}>
                  <feature.icon style={{width: '2rem', height: '2rem', color: '#ffffff'}} />
                </div>
                <h3 style={{fontSize: '1.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '1rem'}}>
                  {feature.title}
                </h3>
                <p style={{color: '#9ca3af', lineHeight: '1.6', marginBottom: '2rem'}}>
                  {feature.description}
                </p>
                <ul style={{listStyle: 'none', padding: 0}}>
                  {feature.features.map((item, itemIndex) => (
                    <li key={itemIndex} style={{color: '#d1d5db', marginBottom: '0.5rem', display: 'flex', alignItems: 'center'}}>
                      <CheckCircle style={{width: '1rem', height: '1rem', color: '#10b981', marginRight: '0.5rem'}} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance & Certifications */}
      <section style={{padding: '6rem 0'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
          <div style={{textAlign: 'center', marginBottom: '4rem'}}>
            <h2 style={{fontSize: '2.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '1rem'}}>
              Compliance & Certifications
            </h2>
            <p style={{fontSize: '1.125rem', color: '#9ca3af', maxWidth: '600px', margin: '0 auto'}}>
              Meeting the highest standards of security, privacy, and compliance across industries
            </p>
          </div>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '4rem'}}>
            {complianceStandards.map((standard, index) => (
              <div key={index} style={{backgroundColor: '#1a1a1a', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a', textAlign: 'center'}}>
                <h4 style={{fontSize: '1.125rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.5rem'}}>
                  {standard.name}
                </h4>
                <span style={{color: standard.color, fontSize: '0.875rem', fontWeight: '500'}}>
                  {standard.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Architecture */}
      <section style={{padding: '6rem 0', backgroundColor: '#111111'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center'}}>
            <div>
              <h2 style={{fontSize: '2.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '1.5rem'}}>
                <span style={{color: '#3b82f6'}}>Scalable</span><br />
                Architecture
              </h2>
              <p style={{fontSize: '1.125rem', color: '#d1d5db', lineHeight: '1.6', marginBottom: '2rem'}}>
                Built on a modern, cloud-native architecture that scales from single deployments to global enterprise networks. Our platform handles millions of data points with sub-second response times.
              </p>
              
              <div style={{display: 'grid', gap: '1.5rem'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                  <div style={{width: '3rem', height: '3rem', backgroundColor: '#3b82f6', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Zap style={{width: '1.5rem', height: '1.5rem', color: '#ffffff'}} />
                  </div>
                  <div>
                    <h4 style={{fontSize: '1.125rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.25rem'}}>High Performance</h4>
                    <p style={{color: '#9ca3af', fontSize: '0.9rem'}}>Sub-second response times with horizontal scaling</p>
                  </div>
                </div>
                
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                  <div style={{width: '3rem', height: '3rem', backgroundColor: '#8b5cf6', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Database style={{width: '1.5rem', height: '1.5rem', color: '#ffffff'}} />
                  </div>
                  <div>
                    <h4 style={{fontSize: '1.125rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.25rem'}}>Data Management</h4>
                    <p style={{color: '#9ca3af', fontSize: '0.9rem'}}>Advanced data processing with real-time streaming</p>
                  </div>
                </div>
                
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                  <div style={{width: '3rem', height: '3rem', backgroundColor: '#06b6d4', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Brain style={{width: '1.5rem', height: '1.5rem', color: '#ffffff'}} />
                  </div>
                  <div>
                    <h4 style={{fontSize: '1.125rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.25rem'}}>AI/ML Pipeline</h4>
                    <p style={{color: '#9ca3af', fontSize: '0.9rem'}}>Continuous learning with automated model updates</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{position: 'relative'}}>
              <div style={{backgroundColor: '#1a1a1a', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a'}}>
                <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', marginBottom: '1.5rem'}}>
                  Enterprise Metrics
                </h3>
                <div style={{display: 'grid', gap: '1.5rem'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#111111', borderRadius: '0.5rem'}}>
                    <span style={{color: '#d1d5db', fontSize: '0.9rem'}}>Uptime SLA</span>
                    <span style={{color: '#10b981', fontSize: '1.125rem', fontWeight: '600'}}>99.9%</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#111111', borderRadius: '0.5rem'}}>
                    <span style={{color: '#d1d5db', fontSize: '0.9rem'}}>Response Time</span>
                    <span style={{color: '#3b82f6', fontSize: '1.125rem', fontWeight: '600'}}>&lt;100ms</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#111111', borderRadius: '0.5rem'}}>
                    <span style={{color: '#d1d5db', fontSize: '0.9rem'}}>Data Throughput</span>
                    <span style={{color: '#8b5cf6', fontSize: '1.125rem', fontWeight: '600'}}>1M+ events/sec</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#111111', borderRadius: '0.5rem'}}>
                    <span style={{color: '#d1d5db', fontSize: '0.9rem'}}>Global Regions</span>
                    <span style={{color: '#06b6d4', fontSize: '1.125rem', fontWeight: '600'}}>15+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Support */}
      <section style={{padding: '6rem 0'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
          <div style={{textAlign: 'center', marginBottom: '4rem'}}>
            <h2 style={{fontSize: '2.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '1rem'}}>
              Enterprise Support
            </h2>
            <p style={{fontSize: '1.125rem', color: '#9ca3af', maxWidth: '600px', margin: '0 auto'}}>
              Dedicated support team with enterprise-grade service level agreements and 24/7 availability
            </p>
          </div>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem'}}>
            <div style={{textAlign: 'center'}}>
              <div style={{width: '3rem', height: '3rem', backgroundColor: '#3b82f6', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto'}}>
                <Users style={{width: '1.5rem', height: '1.5rem', color: '#ffffff'}} />
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem'}}>
                Dedicated Support
              </h3>
              <p style={{color: '#9ca3af', lineHeight: '1.6'}}>
                Dedicated customer success manager and technical support team for enterprise customers.
              </p>
            </div>
            
            <div style={{textAlign: 'center'}}>
              <div style={{width: '3rem', height: '3rem', backgroundColor: '#8b5cf6', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto'}}>
                <Zap style={{width: '1.5rem', height: '1.5rem', color: '#ffffff'}} />
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem'}}>
                24/7 Availability
              </h3>
              <p style={{color: '#9ca3af', lineHeight: '1.6'}}>
                Round-the-clock support with guaranteed response times and escalation procedures.
              </p>
            </div>
            
            <div style={{textAlign: 'center'}}>
              <div style={{width: '3rem', height: '3rem', backgroundColor: '#06b6d4', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto'}}>
                <Award style={{width: '1.5rem', height: '1.5rem', color: '#ffffff'}} />
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem'}}>
                SLA Guarantees
              </h3>
              <p style={{color: '#9ca3af', lineHeight: '1.6'}}>
                Service level agreements with uptime guarantees and performance commitments.
              </p>
            </div>
            
            <div style={{textAlign: 'center'}}>
              <div style={{width: '3rem', height: '3rem', backgroundColor: '#10b981', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto'}}>
                <Globe style={{width: '1.5rem', height: '1.5rem', color: '#ffffff'}} />
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem'}}>
                Global Coverage
              </h3>
              <p style={{color: '#9ca3af', lineHeight: '1.6'}}>
                Support teams across multiple time zones with local language capabilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{padding: '6rem 0', backgroundColor: '#111111'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', textAlign: 'center'}}>
          <h2 style={{fontSize: '2.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '1.5rem'}}>
            Ready for Enterprise Scale?
          </h2>
          <p style={{fontSize: '1.125rem', color: '#9ca3af', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto'}}>
            Contact our enterprise team to discuss your specific requirements and get a custom solution tailored to your organization.
          </p>
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center'}}>
            <button
              onClick={() => window.location.href = '/contact'}
              style={{
                backgroundColor: '#1a1a1a',
                color: '#ffffff',
                padding: '1rem 2rem',
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
                overflow: 'hidden'
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
              <ArrowRight size={20} className="ml-2" />
            </button>
            <Link href="/" style={{
              color: '#e5e7eb',
              backgroundColor: 'transparent',
              border: '1px solid #374151',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.2s',
              textDecoration: 'none'
            }}>
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{backgroundColor: '#0a0a0a', padding: '3rem 0', borderTop: '1px solid #2a2a2a'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem'}}>
            <div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', marginBottom: '1rem'}}>Elysium</h3>
              <p style={{color: '#9ca3af', lineHeight: '1.6'}}>
                Enterprise-grade AI solutions with security, compliance, and reliability at the core.
              </p>
            </div>
            <div>
              <h4 style={{fontSize: '1rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem'}}>Enterprise</h4>
              <ul style={{listStyle: 'none', padding: 0}}>
                <li style={{marginBottom: '0.5rem'}}><Link href="/enterprise" style={{color: '#9ca3af', textDecoration: 'none'}}>Security & Compliance</Link></li>
                <li style={{marginBottom: '0.5rem'}}><Link href="/enterprise" style={{color: '#9ca3af', textDecoration: 'none'}}>Enterprise Support</Link></li>
                <li style={{marginBottom: '0.5rem'}}><Link href="/enterprise" style={{color: '#9ca3af', textDecoration: 'none'}}>Global Infrastructure</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{fontSize: '1rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem'}}>Company</h4>
              <ul style={{listStyle: 'none', padding: 0}}>
                <li style={{marginBottom: '0.5rem'}}><Link href="/about" style={{color: '#9ca3af', textDecoration: 'none'}}>About</Link></li>
                <li style={{marginBottom: '0.5rem'}}><Link href="/careers" style={{color: '#9ca3af', textDecoration: 'none'}}>Careers</Link></li>
                <li style={{marginBottom: '0.5rem'}}><Link href="/contact" style={{color: '#9ca3af', textDecoration: 'none'}}>Contact</Link></li>
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
  )
}
