'use client';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const calculators = [
  {
    type: 'SIP',
    title: 'SIP Calculator',
    desc: 'Estimate how your monthly investments can grow over time with the power of compounding. Perfect for planning your systematic investment strategy.',
    icon: '📈',
    href: '/dashboard/calculators/sip',
    color: '#19C3A3',
    features: ['Monthly investment growth', 'Compound interest estimation', 'Wealth projection', 'Save & compare plans'],
  },
  {
    type: 'EMI',
    title: 'EMI Calculator',
    desc: 'Calculate your monthly loan EMI, total interest payable, and get a complete amortization schedule for any loan.',
    icon: '🏠',
    href: '/dashboard/calculators/emi',
    color: '#1e3a8a',
    features: ['Monthly EMI calculation', 'Interest breakdown', 'Amortization schedule', 'Loan comparison'],
  },
  {
    type: 'LUMPSUM',
    title: 'Lumpsum Calculator',
    desc: 'Project how a one-time investment grows with the power of compounding over your chosen investment period.',
    icon: '💰',
    href: '/dashboard/calculators/lumpsum',
    color: '#d4af37',
    features: ['One-time investment growth', 'Return estimation', 'Year-wise breakdown', 'Multiple scenarios'],
  },
  {
    type: 'RETIREMENT',
    title: 'Retirement Calculator',
    desc: 'Plan your retirement corpus, estimate future needs adjusted for inflation, and determine your required monthly savings.',
    icon: '🌴',
    href: '/dashboard/calculators/retirement',
    color: '#101b3b',
    features: ['Corpus requirement', 'Inflation adjustment', 'Monthly savings needed', 'Retirement readiness'],
  },
];

export default function DashboardCalculatorsPage() {
  return (
    <DashboardLayout>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-900)', margin: '0 0 0.5rem', fontFamily: "'Playfair Display', serif" }}>
          🧮 Financial Calculators
        </h2>
        <p style={{ color: 'var(--gray-600)', fontSize: '0.92rem', margin: 0 }}>
          Run precision financial calculations and save results to your dashboard.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {calculators.map((calc) => (
          <div
            key={calc.type}
            className="glass-card-static"
            style={{
              padding: '1.75rem',
              background: '#ffffff',
              borderLeft: `5px solid ${calc.color}`,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '2rem' }}>{calc.icon}</span>
              <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--primary-900)', fontWeight: 700 }}>
                {calc.title}
              </h3>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--gray-600)', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
              {calc.desc}
            </p>

            <div style={{ marginBottom: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-500)', marginBottom: '0.5rem' }}>
                Features:
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {calc.features.map((feat, idx) => (
                  <li key={idx} style={{ fontSize: '0.82rem', color: 'var(--gray-700)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ color: calc.color, fontWeight: 700 }}>✓</span> {feat}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href={calc.href}
              className="btn btn-primary w-full"
              style={{ justifyContent: 'center', padding: '0.75rem' }}
            >
              Open {calc.title} →
            </Link>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
