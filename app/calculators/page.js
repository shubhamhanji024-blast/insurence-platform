import { Suspense } from 'react';
import SIPCalculator from '@/components/sip/SIPCalculator';
import Link from 'next/link';

export const metadata = {
  title: 'Financial Calculators | GrowthNest',
  description: 'Calculate SIP returns, monthly loan EMIs, lumpsum investments, and retirement planning with GrowthNest financial calculators.',
  openGraph: {
    title: 'Financial Calculators | GrowthNest',
    description: 'Calculate SIP returns, monthly loan EMIs, lumpsum investments, and retirement planning with GrowthNest financial calculators.',
  },
};

export default function CalculatorsPage() {
  return (
    <>
      {/* Page Header */}
      <section className="page-hero">
        <div className="container" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ maxWidth: '640px' }}>
              <span className="hero-badge">FINANCIAL CALCULATORS</span>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#ffffff' }}>
                Smart Wealth &amp; Loan Calculators
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                Estimate SIP returns, calculate loan EMIs, project lumpsum growth, and plan your retirement corpus with precision.
              </p>
            </div>

            {/* Header Graphic */}
            <div className="hide-mobile" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--radius-xl)', padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#19C3A3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#101b3b', fontWeight: 'bold', fontSize: '1.5rem' }}>
                🧮
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Precision Tools</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>GrowthNest Calculators</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Section */}
      <section className="section bg-gray-50">
        <div className="container">
          {/* Calculator Hub Switcher Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {/* SIP Calculator Card */}
            <div className="glass-card-static" style={{ padding: '1.35rem', borderLeft: '4px solid #19C3A3' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '1.35rem' }}>📈</span>
                <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--primary-900)' }}>SIP Calculator</h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--gray-600)', marginBottom: '1rem', lineHeight: 1.5 }}>
                Estimate how your monthly investments can grow over time with our simple SIP calculator.
              </p>
              <Link href="/calculators/sip" className="btn btn-outline btn-sm">
                Calculate SIP →
              </Link>
            </div>

            {/* EMI Calculator Card */}
            <div className="glass-card-static" style={{ padding: '1.35rem', borderLeft: '4px solid var(--primary-900)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '1.35rem' }}>🏠</span>
                <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--primary-900)' }}>EMI Calculator</h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--gray-600)', marginBottom: '1rem', lineHeight: 1.5 }}>
                Calculate your monthly loan payment and total interest outflow.
              </p>
              <Link href="/calculators/emi" className="btn btn-outline btn-sm">
                Calculate EMI →
              </Link>
            </div>

            {/* Lumpsum Calculator Card */}
            <div className="glass-card-static" style={{ padding: '1.35rem', borderLeft: '4px solid #d4af37' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '1.35rem' }}>💰</span>
                <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--primary-900)' }}>Lumpsum Calculator</h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--gray-600)', marginBottom: '1rem', lineHeight: 1.5 }}>
                Estimate how your one-time investment can grow over time.
              </p>
              <Link href="/calculators/lumpsum" className="btn btn-outline btn-sm">
                Calculate Lumpsum →
              </Link>
            </div>

            {/* Retirement Calculator Card */}
            <div className="glass-card-static" style={{ padding: '1.35rem', borderLeft: '4px solid #101b3b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '1.35rem' }}>🌴</span>
                <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--primary-900)' }}>Retirement Calculator</h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--gray-600)', marginBottom: '1rem', lineHeight: 1.5 }}>
                Estimate the retirement corpus you may need and how your current savings could grow.
              </p>
              <Link href="/calculators/retirement" className="btn btn-secondary btn-sm">
                Plan Retirement →
              </Link>
            </div>
          </div>

          {/* Featured SIP Calculator wrapped in Suspense */}
          <Suspense fallback={<div className="glass-card text-center" style={{ padding: '3rem', color: 'var(--gray-500)' }}>Loading calculator...</div>}>
            <SIPCalculator />
          </Suspense>
        </div>
      </section>
    </>
  );
}
