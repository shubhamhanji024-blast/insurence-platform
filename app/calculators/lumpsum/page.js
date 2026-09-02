import { Suspense } from 'react';
import LumpsumCalculator from '@/components/lumpsum/LumpsumCalculator';

export const metadata = {
  title: 'Lumpsum Calculator | GrowthNest',
  description: 'Estimate how your one-time investment can grow over time with the GrowthNest Lumpsum Calculator.',
  openGraph: {
    title: 'Lumpsum Calculator | GrowthNest',
    description: 'Estimate how your one-time investment can grow over time with the GrowthNest Lumpsum Calculator.',
  },
};

export default function LumpsumPage() {
  return (
    <>
      {/* Page Header */}
      <section className="page-hero">
        <div className="container" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ maxWidth: '640px' }}>
              <span className="hero-badge">LUMPSUM CALCULATOR</span>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#ffffff' }}>
                One-Time Investment Growth
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                Estimate the future value of your one-time lumpsum investment over your desired time horizon.
              </p>
            </div>

            <div className="hide-mobile" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--radius-xl)', padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#19C3A3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#101b3b', fontWeight: 'bold', fontSize: '1.5rem' }}>
                💰
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Single Investment</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>Compounded Wealth</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Calculator Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <Suspense fallback={<div className="glass-card text-center" style={{ padding: '3rem', color: 'var(--gray-500)' }}>Loading lumpsum calculator...</div>}>
            <LumpsumCalculator />
          </Suspense>
        </div>
      </section>
    </>
  );
}
