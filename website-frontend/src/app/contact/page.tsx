"use client"

import Link from "next/link"
import { useState, useRef } from "react"
import { ArrowLeft, Send, CheckCircle, AlertCircle, ArrowRight } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const buttonAnimationRef = useRef<number | null>(null)

  // Add CSS for select dropdown options and background animations
  const selectStyles = `
    select option {
      background-color: #111111 !important;
      color: #ffffff !important;
    }
    select option:hover {
      background-color: #1f2937 !important;
      color: #ffffff !important;
    }
    select option:checked {
      background-color: #3b82f6 !important;
      color: #ffffff !important;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.1); }
    }
    
    @keyframes drift {
      0% { transform: translateX(-100px) translateY(0px); }
      50% { transform: translateX(100px) translateY(-50px); }
      100% { transform: translateX(-100px) translateY(0px); }
    }
    
    .bg-shape-1 {
      position: fixed;
      top: 10%;
      left: 5%;
      width: 200px;
      height: 200px;
      background: linear-gradient(45deg, #3b82f6, #8b5cf6);
      border-radius: 50%;
      opacity: 0.3;
      animation: float 8s ease-in-out infinite;
      z-index: 1;
      pointer-events: none;
    }
    
    .bg-shape-2 {
      position: fixed;
      top: 60%;
      right: 10%;
      width: 150px;
      height: 150px;
      background: linear-gradient(45deg, #06b6d4, #10b981);
      border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
      opacity: 0.25;
      animation: pulse 6s ease-in-out infinite;
      z-index: 1;
      pointer-events: none;
    }
    
    .bg-shape-3 {
      position: fixed;
      bottom: 20%;
      left: 15%;
      width: 100px;
      height: 100px;
      background: linear-gradient(45deg, #f59e0b, #ef4444);
      border-radius: 20% 80% 80% 20% / 20% 20% 80% 80%;
      opacity: 0.35;
      animation: drift 10s ease-in-out infinite;
      z-index: 1;
      pointer-events: none;
    }
    
    .bg-shape-4 {
      position: fixed;
      top: 30%;
      right: 20%;
      width: 80px;
      height: 80px;
      background: linear-gradient(45deg, #ec4899, #8b5cf6);
      border-radius: 50%;
      opacity: 0.3;
      animation: float 7s ease-in-out infinite reverse;
      z-index: 1;
      pointer-events: none;
    }
    
    .bg-shape-5 {
      position: fixed;
      bottom: 40%;
      right: 5%;
      width: 120px;
      height: 120px;
      background: linear-gradient(45deg, #22c55e, #06b6d4);
      border-radius: 40% 60% 60% 40% / 40% 40% 60% 60%;
      opacity: 0.28;
      animation: pulse 9s ease-in-out infinite;
      z-index: 1;
      pointer-events: none;
    }
  `;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Simulate form submission - in a real app, you'd send this to your backend
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // For demo purposes, we'll just show success
      setSubmitStatus('success')
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: selectStyles }} />
      
      {/* Background Animated Shapes */}
      <div className="bg-shape-1"></div>
      <div className="bg-shape-2"></div>
      <div className="bg-shape-3"></div>
      <div className="bg-shape-4"></div>
      <div className="bg-shape-5"></div>
      
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
              Contact Us
            </h1>
            <p style={{fontSize: '1.25rem', color: '#d1d5db', lineHeight: '1.6', maxWidth: '800px', margin: '0 auto'}}>
              Ready to transform your mining operations with AI? Get in touch with our team to discuss your needs and explore our solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section style={{padding: '4rem 0'}}>
        <div style={{maxWidth: '800px', margin: '0 auto', padding: '0 2rem'}}>
          <div>
            <h2 style={{fontSize: '2rem', fontWeight: '700', color: '#ffffff', marginBottom: '2rem', textAlign: 'center'}}>
              Send us a Message
            </h2>
              
              <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '2.5rem'}}>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem'}}>
                  <div>
                    <label style={{display: 'block', color: '#d1d5db', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem'}}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: '#111111',
                        border: '1px solid #374151',
                        borderRadius: '0.5rem',
                        color: '#ffffff',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = '#374151'}
                    />
                  </div>
                  
                  <div>
                    <label style={{display: 'block', color: '#d1d5db', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem'}}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: '#111111',
                        border: '1px solid #374151',
                        borderRadius: '0.5rem',
                        color: '#ffffff',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = '#374151'}
                    />
                  </div>
                </div>

                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem'}}>
                  <div>
                    <label style={{display: 'block', color: '#d1d5db', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem'}}>
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: '#111111',
                        border: '1px solid #374151',
                        borderRadius: '0.5rem',
                        color: '#ffffff',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = '#374151'}
                    />
                  </div>
                  
                  <div>
                    <label style={{display: 'block', color: '#d1d5db', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem'}}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: '#111111',
                        border: '1px solid #374151',
                        borderRadius: '0.5rem',
                        color: '#ffffff',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = '#374151'}
                    />
                  </div>
                </div>

                <div style={{width: '100%'}}>
                  <label style={{display: 'block', color: '#d1d5db', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem'}}>
                    Inquiry Type
                  </label>
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '1rem 2.5rem 1rem 0.75rem',
                      backgroundColor: '#111111',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                      color: '#ffffff',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                      minHeight: '3.25rem'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#374151'}
                  >
                    <option value="general" style={{backgroundColor: '#111111', color: '#ffffff'}}>General Inquiry</option>
                    <option value="demo" style={{backgroundColor: '#111111', color: '#ffffff'}}>Request Demo</option>
                    <option value="pricing" style={{backgroundColor: '#111111', color: '#ffffff'}}>Pricing Information</option>
                    <option value="support" style={{backgroundColor: '#111111', color: '#ffffff'}}>Technical Support</option>
                    <option value="partnership" style={{backgroundColor: '#111111', color: '#ffffff'}}>Partnership Opportunity</option>
                    <option value="media" style={{backgroundColor: '#111111', color: '#ffffff'}}>Media & Press</option>
                  </select>
                </div>

                <div style={{width: '100%'}}>
                  <label style={{display: 'block', color: '#d1d5db', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem'}}>
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#111111',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                      color: '#ffffff',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#374151'}
                  />
                </div>

                <div style={{width: '100%'}}>
                  <label style={{display: 'block', color: '#d1d5db', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem'}}>
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#111111',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                      color: '#ffffff',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#374151'}
                    placeholder="Tell us about your mining operations and how we can help..."
                  />
                </div>

                {/* Submit Status Messages */}
                {submitStatus === 'success' && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '1rem',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '0.5rem',
                    color: '#10b981'
                  }}>
                    <CheckCircle size={20} />
                    <span>Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.</span>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '1rem',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '0.5rem',
                    color: '#ef4444'
                  }}>
                    <AlertCircle size={20} />
                    <span>Sorry, there was an error sending your message. Please try again or contact us directly.</span>
                  </div>
                )}

                <div style={{display: 'flex', justifyContent: 'center'}}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: isSubmitting ? '#6b7280' : '#1a1a1a',
                      color: '#ffffff',
                      padding: '0.75rem 2rem',
                      borderRadius: '0.5rem',
                      fontWeight: '600',
                      border: isSubmitting ? 'none' : '1px solid #374151',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '0.875rem',
                      transition: 'all 0.3s ease',
                      boxShadow: isSubmitting ? 'none' : '0 4px 16px rgba(0, 0, 0, 0.3)',
                      position: 'relative',
                      overflow: 'hidden',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      minHeight: '2.75rem'
                    }}
                  onMouseEnter={(e) => {
                    if (isSubmitting) return;
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
                    if (isSubmitting) return;
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
                    if (isSubmitting) return;
                    e.target.style.border = 'none';
                    e.target.style.borderRadius = '2rem';
                    e.target.style.transform = 'scale(0.95)';
                    e.target.style.background = 'linear-gradient(135deg, #3b82f6, #8b5cf6)';
                    e.target.style.boxShadow = '0 8px 32px rgba(59, 130, 246, 0.4)';
                  }}
                  onMouseUp={(e) => {
                    if (isSubmitting) return;
                    e.target.style.border = '1px solid #374151';
                    e.target.style.borderRadius = '0.5rem';
                    e.target.style.transform = 'scale(1)';
                    e.target.style.background = '#1a1a1a';
                    e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
                    e.target.style.animation = 'none';
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div style={{
                        width: '1rem',
                        height: '1rem',
                        border: '2px solid #ffffff',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      Sending...
                    </>
                  ) : (
                    <>
                      Get Started
                      <ArrowRight size={20} />
                    </>
                  )}
                  </button>
                </div>
              </form>
          </div>
        </div>
      </section>


      {/* Add CSS for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
    </>
  )
}
