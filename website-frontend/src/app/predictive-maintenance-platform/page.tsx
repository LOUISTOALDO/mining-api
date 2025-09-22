'use client'
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function PredictiveMaintenancePlatform() {
  return (
    <div style={{minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#ffffff', fontFamily: 'Inter, system-ui, sans-serif'}}>
      <div style={{padding: '2rem', textAlign: 'center'}}>
        <h1 style={{fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem'}}>
          Predictive Maintenance Platform
        </h1>
        <p style={{fontSize: '1.2rem', marginBottom: '2rem', color: '#d1d5db'}}>
          Advanced AI-powered predictive maintenance solutions for mining operations
        </p>
        <Link 
          href="/contact" 
          style={{
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            padding: '1rem 2rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          Get Started
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}

