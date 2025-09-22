"use client"

import { ArrowRight, Zap, Database, Brain, Shield, TrendingUp, Users, Globe } from "lucide-react"
import Link from "next/link"

// Updated header buttons - cache bust v1

export default function ProductsPage() {
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
              <Link href="/products" style={{color: '#3b82f6', fontSize: '0.9rem', fontWeight: '500', textDecoration: 'none'}}>Products</Link>
              <Link href="/solutions" style={{color: '#e5e7eb', fontSize: '0.9rem', fontWeight: '500', textDecoration: 'none', transition: 'color 0.2s'}}>Solutions</Link>
              <Link href="/enterprise" style={{color: '#e5e7eb', fontSize: '0.9rem', fontWeight: '500', textDecoration: 'none', transition: 'color 0.2s'}}>Enterprise</Link>
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
              <span style={{display: 'block', color: '#3b82f6'}}>AI-Powered</span>
              <span style={{display: 'block'}}>Products</span>
            </h1>
            
            <p style={{fontSize: '1.25rem', color: '#d1d5db', lineHeight: '1.6', marginBottom: '2rem', fontWeight: '400', maxWidth: '800px', margin: '0 auto 2rem auto'}}>
              Transform your mining operations with our comprehensive suite of AI-powered products designed for enterprise-scale predictive maintenance and operational intelligence.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section style={{padding: '4rem 0', backgroundColor: '#111111'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem'}}>
            
            {/* AI Platform */}
            <div style={{backgroundColor: '#1a1a1a', padding: '2.5rem', borderRadius: '1rem', border: '1px solid #2a2a2a', transition: 'all 0.3s'}}>
              <div style={{width: '4rem', height: '4rem', backgroundColor: '#3b82f6', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem'}}>
                <Brain style={{width: '2rem', height: '2rem', color: '#ffffff'}} />
              </div>
              <h3 style={{fontSize: '1.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '1rem'}}>
                AI Platform
              </h3>
              <p style={{color: '#9ca3af', lineHeight: '1.6', marginBottom: '2rem'}}>
                Comprehensive AI platform with machine learning models, real-time analytics, and predictive maintenance capabilities for mining operations.
              </p>
              <ul style={{listStyle: 'none', padding: 0, marginBottom: '2rem'}}>
                <li style={{color: '#d1d5db', marginBottom: '0.5rem', display: 'flex', alignItems: 'center'}}>
                  <span style={{color: '#10b981', marginRight: '0.5rem'}}>✓</span>
                  Predictive Maintenance Models
                </li>
                <li style={{color: '#d1d5db', marginBottom: '0.5rem', display: 'flex', alignItems: 'center'}}>
                  <span style={{color: '#10b981', marginRight: '0.5rem'}}>✓</span>
                  Real-time Equipment Monitoring
                </li>
                <li style={{color: '#d1d5db', marginBottom: '0.5rem', display: 'flex', alignItems: 'center'}}>
                  <span style={{color: '#10b981', marginRight: '0.5rem'}}>✓</span>
                  Failure Prediction (95%+ Accuracy)
                </li>
                <li style={{color: '#d1d5db', marginBottom: '0.5rem', display: 'flex', alignItems: 'center'}}>
                  <span style={{color: '#10b981', marginRight: '0.5rem'}}>✓</span>
                  Automated Alert System
                </li>
              </ul>
              <button style={{backgroundColor: '#3b82f6', color: '#ffffff', padding: '1rem 2rem', borderRadius: '0.5rem', fontWeight: '600', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '1rem', transition: 'all 0.2s', width: '100%', justifyContent: 'center'}}>
                Learn More
                <ArrowRight size={20} className="ml-2" />
              </button>
            </div>

            {/* Data Processing */}
            <div style={{backgroundColor: '#1a1a1a', padding: '2.5rem', borderRadius: '1rem', border: '1px solid #2a2a2a', transition: 'all 0.3s'}}>
              <div style={{width: '4rem', height: '4rem', backgroundColor: '#8b5cf6', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem'}}>
                <Database style={{width: '2rem', height: '2rem', color: '#ffffff'}} />
              </div>
              <h3 style={{fontSize: '1.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '1rem'}}>
                Data Processing
              </h3>
              <p style={{color: '#9ca3af', lineHeight: '1.6', marginBottom: '2rem'}}>
                High-performance data processing engine capable of handling massive telemetry datasets with real-time streaming and batch processing.
              </p>
              <ul style={{listStyle: 'none', padding: 0, marginBottom: '2rem'}}>
                <li style={{color: '#d1d5db', marginBottom: '0.5rem', display: 'flex', alignItems: 'center'}}>
                  <span style={{color: '#10b981', marginRight: '0.5rem'}}>✓</span>
                  Real-time Data Streaming
                </li>
                <li style={{color: '#d1d5db', marginBottom: '0.5rem', display: 'flex', alignItems: 'center'}}>
                  <span style={{color: '#10b981', marginRight: '0.5rem'}}>✓</span>
                  Multi-format Data Support
                </li>
                <li style={{color: '#d1d5db', marginBottom: '0.5rem', display: 'flex', alignItems: 'center'}}>
                  <span style={{color: '#10b981', marginRight: '0.5rem'}}>✓</span>
                  Advanced Data Export
                </li>
                <li style={{color: '#d1d5db', marginBottom: '0.5rem', display: 'flex', alignItems: 'center'}}>
                  <span style={{color: '#10b981', marginRight: '0.5rem'}}>✓</span>
                  Custom Query Builder
                </li>
              </ul>
              <button style={{backgroundColor: '#8b5cf6', color: '#ffffff', padding: '1rem 2rem', borderRadius: '0.5rem', fontWeight: '600', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '1rem', transition: 'all 0.2s', width: '100%', justifyContent: 'center'}}>
                Learn More
                <ArrowRight size={20} className="ml-2" />
              </button>
            </div>

            {/* ML Models */}
            <div style={{backgroundColor: '#1a1a1a', padding: '2.5rem', borderRadius: '1rem', border: '1px solid #2a2a2a', transition: 'all 0.3s'}}>
              <div style={{width: '4rem', height: '4rem', backgroundColor: '#06b6d4', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem'}}>
                <TrendingUp style={{width: '2rem', height: '2rem', color: '#ffffff'}} />
              </div>
              <h3 style={{fontSize: '1.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '1rem'}}>
                ML Models
              </h3>
              <p style={{color: '#9ca3af', lineHeight: '1.6', marginBottom: '2rem'}}>
                Pre-trained and custom machine learning models specifically designed for mining equipment health prediction and optimization.
              </p>
              <ul style={{listStyle: 'none', padding: 0, marginBottom: '2rem'}}>
                <li style={{color: '#d1d5db', marginBottom: '0.5rem', display: 'flex', alignItems: 'center'}}>
                  <span style={{color: '#10b981', marginRight: '0.5rem'}}>✓</span>
                  Equipment Health Scoring
                </li>
                <li style={{color: '#d1d5db', marginBottom: '0.5rem', display: 'flex', alignItems: 'center'}}>
                  <span style={{color: '#10b981', marginRight: '0.5rem'}}>✓</span>
                  Performance Optimization
                </li>
                <li style={{color: '#d1d5db', marginBottom: '0.5rem', display: 'flex', alignItems: 'center'}}>
                  <span style={{color: '#10b981', marginRight: '0.5rem'}}>✓</span>
                  Cost Analysis Models
                </li>
                <li style={{color: '#d1d5db', marginBottom: '0.5rem', display: 'flex', alignItems: 'center'}}>
                  <span style={{color: '#10b981', marginRight: '0.5rem'}}>✓</span>
                  Continuous Learning
                </li>
              </ul>
              <button style={{backgroundColor: '#06b6d4', color: '#ffffff', padding: '1rem 2rem', borderRadius: '0.5rem', fontWeight: '600', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '1rem', transition: 'all 0.2s', width: '100%', justifyContent: 'center'}}>
                Learn More
                <ArrowRight size={20} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{padding: '6rem 0'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
          <div style={{textAlign: 'center', marginBottom: '4rem'}}>
            <h2 style={{fontSize: '2.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '1rem'}}>
              Why Choose Our Products?
            </h2>
            <p style={{fontSize: '1.125rem', color: '#9ca3af', maxWidth: '600px', margin: '0 auto'}}>
              Built specifically for the mining industry with enterprise-grade reliability and performance
            </p>
          </div>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem'}}>
            <div style={{textAlign: 'center'}}>
              <div style={{width: '3rem', height: '3rem', backgroundColor: '#3b82f6', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto'}}>
                <Zap style={{width: '1.5rem', height: '1.5rem', color: '#ffffff'}} />
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem'}}>
                Lightning Fast
              </h3>
              <p style={{color: '#9ca3af', lineHeight: '1.6'}}>
                Process massive datasets in real-time with sub-second response times and optimized algorithms.
              </p>
            </div>
            
            <div style={{textAlign: 'center'}}>
              <div style={{width: '3rem', height: '3rem', backgroundColor: '#8b5cf6', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto'}}>
                <Shield style={{width: '1.5rem', height: '1.5rem', color: '#ffffff'}} />
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem'}}>
                Enterprise Security
              </h3>
              <p style={{color: '#9ca3af', lineHeight: '1.6'}}>
                Bank-grade security with encryption, compliance, and role-based access control.
              </p>
            </div>
            
            <div style={{textAlign: 'center'}}>
              <div style={{width: '3rem', height: '3rem', backgroundColor: '#06b6d4', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto'}}>
                <Users style={{width: '1.5rem', height: '1.5rem', color: '#ffffff'}} />
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem'}}>
                Scalable
              </h3>
              <p style={{color: '#9ca3af', lineHeight: '1.6'}}>
                Scale from single equipment to thousands of units with horizontal scaling capabilities.
              </p>
            </div>
            
            <div style={{textAlign: 'center'}}>
              <div style={{width: '3rem', height: '3rem', backgroundColor: '#10b981', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto'}}>
                <Globe style={{width: '1.5rem', height: '1.5rem', color: '#ffffff'}} />
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem'}}>
                Global Support
              </h3>
              <p style={{color: '#9ca3af', lineHeight: '1.6'}}>
                24/7 support with global coverage and expert technical assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{padding: '6rem 0', backgroundColor: '#111111'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', textAlign: 'center'}}>
          <h2 style={{fontSize: '2.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '1.5rem'}}>
            Ready to Transform Your Operations?
          </h2>
          <p style={{fontSize: '1.125rem', color: '#9ca3af', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto'}}>
            Ready to get started? Contact our team to discuss your mining operations and explore our AI solutions.
          </p>
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center'}}>
            <Link href="/contact" style={{
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
              textDecoration: 'none'
            }}>
              Get Started
              <ArrowRight size={20} className="ml-2" />
            </Link>
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
                Enterprise-grade AI solutions that transform mining operations and drive innovation.
              </p>
            </div>
            <div>
              <h4 style={{fontSize: '1rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem'}}>Products</h4>
              <ul style={{listStyle: 'none', padding: 0}}>
                <li style={{marginBottom: '0.5rem'}}><Link href="/products" style={{color: '#9ca3af', textDecoration: 'none'}}>AI Platform</Link></li>
                <li style={{marginBottom: '0.5rem'}}><Link href="/products" style={{color: '#9ca3af', textDecoration: 'none'}}>Data Processing</Link></li>
                <li style={{marginBottom: '0.5rem'}}><Link href="/products" style={{color: '#9ca3af', textDecoration: 'none'}}>ML Models</Link></li>
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
