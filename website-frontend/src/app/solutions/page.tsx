"use client"

import { ArrowRight, Truck, Factory, Building, Car, Heart, ShoppingCart, Shield } from "lucide-react"
import Link from "next/link"
import { useState, useRef } from "react"

// Updated header buttons - cache bust v1


export default function SolutionsPage() {
  const buttonAnimationRef = useRef<number | null>(null)
  
  const solutions = [
    {
      icon: Truck,
      title: "Heavy Machinery Monitoring",
      description: "Advanced AI monitoring for excavators, haul trucks, and drilling equipment with real-time performance analytics and predictive maintenance.",
      features: ["Real-time Equipment Tracking", "Performance Analytics", "Predictive Maintenance", "Fuel Optimization"],
      color: "#3b82f6"
    },
    {
      icon: Factory,
      title: "Processing Plant Intelligence",
      description: "Smart monitoring of crushers, conveyors, and processing equipment with automated optimization and quality control systems.",
      features: ["Process Optimization", "Quality Control", "Throughput Analytics", "Equipment Efficiency"],
      color: "#8b5cf6"
    },
    {
      icon: Building,
      title: "Mine Site Operations",
      description: "Comprehensive mine site management with integrated data from all operations, safety monitoring, and resource optimization.",
      features: ["Site-wide Analytics", "Safety Monitoring", "Resource Allocation", "Environmental Compliance"],
      color: "#06b6d4"
    },
    {
      icon: Car,
      title: "Fleet Management",
      description: "Intelligent fleet tracking and optimization for mining vehicles with route planning, maintenance scheduling, and driver analytics.",
      features: ["Fleet Tracking", "Route Optimization", "Maintenance Scheduling", "Driver Performance"],
      color: "#10b981"
    },
    {
      icon: Heart,
      title: "Safety & Environmental",
      description: "AI-powered safety monitoring and environmental compliance with real-time hazard detection and regulatory reporting.",
      features: ["Hazard Detection", "Environmental Monitoring", "Compliance Reporting", "Safety Analytics"],
      color: "#ef4444"
    },
    {
      icon: ShoppingCart,
      title: "Data Analytics Platform",
      description: "Comprehensive mining data platform with advanced analytics, reporting, and business intelligence for operational insights.",
      features: ["Data Integration", "Advanced Analytics", "Custom Reporting", "Business Intelligence"],
      color: "#f59e0b"
    }
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
              <Link href="/solutions" style={{color: '#3b82f6', fontSize: '0.9rem', fontWeight: '500', textDecoration: 'none'}}>Solutions</Link>
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
              <span style={{display: 'block', color: '#3b82f6'}}>Mining Solutions</span>
              <span style={{display: 'block'}}>for Data & Machinery</span>
            </h1>
            
            <p style={{fontSize: '1.25rem', color: '#d1d5db', lineHeight: '1.6', marginBottom: '2rem', fontWeight: '400', maxWidth: '800px', margin: '0 auto 2rem auto'}}>
              Specialized AI solutions designed specifically for mining operations. From heavy machinery monitoring to data analytics, we provide intelligent systems that optimize your mining operations.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section style={{padding: '4rem 0', backgroundColor: '#111111'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem'}}>
            {solutions.map((solution, index) => (
              <div key={index} style={{backgroundColor: '#1a1a1a', padding: '2.5rem', borderRadius: '1rem', border: '1px solid #2a2a2a', transition: 'all 0.3s'}}>
                <div style={{width: '4rem', height: '4rem', backgroundColor: solution.color, borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem'}}>
                  <solution.icon style={{width: '2rem', height: '2rem', color: '#ffffff'}} />
                </div>
                <h3 style={{fontSize: '1.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '1rem'}}>
                  {solution.title}
                </h3>
                <p style={{color: '#9ca3af', lineHeight: '1.6', marginBottom: '2rem'}}>
                  {solution.description}
                </p>
                <ul style={{listStyle: 'none', padding: 0, marginBottom: '2rem'}}>
                  {solution.features.map((feature, featureIndex) => (
                    <li key={featureIndex} style={{color: '#d1d5db', marginBottom: '0.5rem', display: 'flex', alignItems: 'center'}}>
                      <span style={{color: '#10b981', marginRight: '0.5rem'}}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button style={{backgroundColor: solution.color, color: '#ffffff', padding: '1rem 2rem', borderRadius: '0.5rem', fontWeight: '600', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '1rem', transition: 'all 0.2s', width: '100%', justifyContent: 'center'}}>
                  Learn More
                  <ArrowRight size={20} className="ml-2" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mining Focus Section */}
      <section style={{padding: '6rem 0'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center'}}>
            <div>
              <h2 style={{fontSize: '2.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '1.5rem'}}>
                <span style={{color: '#3b82f6'}}>Mining Operations</span><br />
                Our Specialty
              </h2>
              <p style={{fontSize: '1.125rem', color: '#d1d5db', lineHeight: '1.6', marginBottom: '2rem'}}>
                With deep expertise in mining operations, we've developed the most advanced AI platform specifically designed for the mining industry. Our solutions have helped mining companies achieve unprecedented levels of efficiency and safety.
              </p>
              
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem'}}>
                <div>
                  <h4 style={{fontSize: '1.5rem', fontWeight: '700', color: '#3b82f6', marginBottom: '0.5rem'}}>50%</h4>
                  <p style={{color: '#9ca3af', fontSize: '0.9rem'}}>Reduction in Downtime</p>
                </div>
                <div>
                  <h4 style={{fontSize: '1.5rem', fontWeight: '700', color: '#10b981', marginBottom: '0.5rem'}}>95%</h4>
                  <p style={{color: '#9ca3af', fontSize: '0.9rem'}}>Prediction Accuracy</p>
                </div>
                <div>
                  <h4 style={{fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b', marginBottom: '0.5rem'}}>$2M+</h4>
                  <p style={{color: '#9ca3af', fontSize: '0.9rem'}}>Average Annual Savings</p>
                </div>
                <div>
                  <h4 style={{fontSize: '1.5rem', fontWeight: '700', color: '#ef4444', marginBottom: '0.5rem'}}>99.9%</h4>
                  <p style={{color: '#9ca3af', fontSize: '0.9rem'}}>System Uptime</p>
                </div>
              </div>
              
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
            </div>
            
            <div style={{position: 'relative'}}>
              <div style={{backgroundColor: '#1a1a1a', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a'}}>
                <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', marginBottom: '1.5rem'}}>
                  Mining Equipment Types
                </h3>
                <div style={{display: 'grid', gap: '1rem'}}>
                  {[
                    'Excavators & Loaders',
                    'Haul Trucks & Conveyors',
                    'Drills & Blasting Equipment',
                    'Processing Plants',
                    'Crushers & Screens',
                    'Pumps & Compressors'
                  ].map((equipment, index) => (
                    <div key={index} style={{display: 'flex', alignItems: 'center', padding: '0.75rem', backgroundColor: '#111111', borderRadius: '0.5rem'}}>
                      <div style={{width: '0.5rem', height: '0.5rem', backgroundColor: '#3b82f6', borderRadius: '50%', marginRight: '1rem'}}></div>
                      <span style={{color: '#d1d5db', fontSize: '0.9rem'}}>{equipment}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section style={{padding: '6rem 0', backgroundColor: '#111111'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
          <div style={{textAlign: 'center', marginBottom: '4rem'}}>
            <h2 style={{fontSize: '2.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '1rem'}}>
              Success Stories
            </h2>
            <p style={{fontSize: '1.125rem', color: '#9ca3af', maxWidth: '600px', margin: '0 auto'}}>
              See how leading companies are transforming their operations with our AI solutions
            </p>
          </div>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
            <div style={{backgroundColor: '#1a1a1a', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a'}}>
              <div style={{display: 'flex', alignItems: 'center', marginBottom: '1.5rem'}}>
                <div style={{width: '3rem', height: '3rem', backgroundColor: '#3b82f6', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem'}}>
                  <Truck style={{width: '1.5rem', height: '1.5rem', color: '#ffffff'}} />
                </div>
                <div>
                  <h4 style={{fontSize: '1.125rem', fontWeight: '600', color: '#ffffff'}}>Global Mining Corp</h4>
                  <p style={{color: '#9ca3af', fontSize: '0.875rem'}}>Fortune 500 Mining Company</p>
                </div>
              </div>
              <p style={{color: '#d1d5db', lineHeight: '1.6', marginBottom: '1rem'}}>
                "Elysium's predictive maintenance platform reduced our equipment downtime by 60% and saved us over $5M annually in maintenance costs."
              </p>
              <div style={{display: 'flex', gap: '1rem'}}>
                <span style={{color: '#10b981', fontSize: '0.875rem', fontWeight: '600'}}>60% Downtime Reduction</span>
                <span style={{color: '#f59e0b', fontSize: '0.875rem', fontWeight: '600'}}>$5M+ Annual Savings</span>
              </div>
            </div>
            
            <div style={{backgroundColor: '#1a1a1a', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a'}}>
              <div style={{display: 'flex', alignItems: 'center', marginBottom: '1.5rem'}}>
                <div style={{width: '3rem', height: '3rem', backgroundColor: '#8b5cf6', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem'}}>
                  <Factory style={{width: '1.5rem', height: '1.5rem', color: '#ffffff'}} />
                </div>
                <div>
                  <h4 style={{fontSize: '1.125rem', fontWeight: '600', color: '#ffffff'}}>Industrial Manufacturing Ltd</h4>
                  <p style={{color: '#9ca3af', fontSize: '0.875rem'}}>Leading Manufacturer</p>
                </div>
              </div>
              <p style={{color: '#d1d5db', lineHeight: '1.6', marginBottom: '1rem'}}>
                "The AI platform optimized our production lines and improved quality control, resulting in 25% efficiency gains and zero quality incidents."
              </p>
              <div style={{display: 'flex', gap: '1rem'}}>
                <span style={{color: '#10b981', fontSize: '0.875rem', fontWeight: '600'}}>25% Efficiency Gain</span>
                <span style={{color: '#3b82f6', fontSize: '0.875rem', fontWeight: '600'}}>Zero Quality Issues</span>
              </div>
            </div>
            
            <div style={{backgroundColor: '#1a1a1a', padding: '2rem', borderRadius: '1rem', border: '1px solid #2a2a2a'}}>
              <div style={{display: 'flex', alignItems: 'center', marginBottom: '1.5rem'}}>
                <div style={{width: '3rem', height: '3rem', backgroundColor: '#06b6d4', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem'}}>
                  <Shield style={{width: '1.5rem', height: '1.5rem', color: '#ffffff'}} />
                </div>
                <div>
                  <h4 style={{fontSize: '1.125rem', fontWeight: '600', color: '#ffffff'}}>Defense Solutions Inc</h4>
                  <p style={{color: '#9ca3af', fontSize: '0.875rem'}}>Government Contractor</p>
                </div>
              </div>
              <p style={{color: '#d1d5db', lineHeight: '1.6', marginBottom: '1rem'}}>
                "Elysium's secure platform enabled us to achieve full compliance while improving mission-critical system reliability by 40%."
              </p>
              <div style={{display: 'flex', gap: '1rem'}}>
                <span style={{color: '#10b981', fontSize: '0.875rem', fontWeight: '600'}}>40% Reliability Gain</span>
                <span style={{color: '#06b6d4', fontSize: '0.875rem', fontWeight: '600'}}>Full Compliance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{padding: '6rem 0'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', textAlign: 'center'}}>
          <h2 style={{fontSize: '2.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '1.5rem'}}>
            Ready to Optimize Your Mining Operations?
          </h2>
          <p style={{fontSize: '1.125rem', color: '#9ca3af', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto'}}>
            Discover how our mining-specific AI solutions can revolutionize your equipment monitoring, data analytics, and operational efficiency.
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
                Enterprise-grade AI solutions that transform operations and drive innovation across industries.
              </p>
            </div>
            <div>
              <h4 style={{fontSize: '1rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem'}}>Solutions</h4>
              <ul style={{listStyle: 'none', padding: 0}}>
                <li style={{marginBottom: '0.5rem'}}><Link href="/solutions" style={{color: '#9ca3af', textDecoration: 'none'}}>Mining Operations</Link></li>
                <li style={{marginBottom: '0.5rem'}}><Link href="/solutions" style={{color: '#9ca3af', textDecoration: 'none'}}>Manufacturing</Link></li>
                <li style={{marginBottom: '0.5rem'}}><Link href="/solutions" style={{color: '#9ca3af', textDecoration: 'none'}}>Government & Defense</Link></li>
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
