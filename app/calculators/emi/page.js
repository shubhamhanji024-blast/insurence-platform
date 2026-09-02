import { Suspense } from 'react';
import EMICalculator from '@/components/emi/EMICalculator';

export const metadata = {
  title: 'EMI Calculator | GrowthNest',
  description: 'Calculate monthly EMI, interest payable, and total loan payment for home, car, and personal loans with GrowthNest.',
  openGraph: {
    title: 'EMI Calculator | GrowthNest',
    description: 'Calculate monthly EMI, interest payable, and total loan payment for home, car, and personal loans with GrowthNest.',
  },
};

export default function EMIPage() {
  return (
    <>
      {/* Page Header */}
      <section className="page-hero">
        <div className="container" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ maxWidth: '640px' }}>
              <span className="hero-badge">EMI CALCULATOR</span>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#ffffff' }}>
                Calculate Your Loan EMI
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                Estimate your monthly loan installments, total interest, and complete repayment schedule.
              </p>
            </div>

            <div className="hide-mobile" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--radius-xl)', padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#19C3A3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#101b3b', fontWeight: 'bold', fontSize: '1.5rem' }}>
                🏦
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Loan Planning</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>Smart Borrowing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Calculator Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <Suspense fallback={<div className="glass-card text-center" style={{ padding: '3rem', color: 'var(--gray-500)' }}>Loading EMI calculator...</div>}>
            <EMICalculator />
          </Suspense>
        </div>
      </section>
    </>
  );
}
