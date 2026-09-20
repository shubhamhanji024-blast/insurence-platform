'use client';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const advisoryTracks = [
  {
    id: 'investment-planning',
    name: 'Investment Planning',
    category: 'Wealth Growth',
    desc: 'Asset allocation, curated mutual fund portfolios, equity distribution, and periodic risk profiling.',
    status: 'AVAILABLE',
    focus: 'Capital Appreciation & Compounding',
    advisorTier: 'Senior Portfolio Manager',
    icon: '💹',
    link: '/services/investment-planning',
    badgeColor: '#e0f2fe',
    textColor: '#0369a1',
  },
  {
    id: 'retirement-planning',
    name: 'Retirement Planning',
    category: 'Long-term Security',
    desc: 'Corpus calculation, pension indexation, annuity purchasing, and tax-efficient withdrawal structures.',
    status: 'AVAILABLE',
    focus: 'Post-Retirement Income Security',
    advisorTier: 'Retirement Specialist',
    icon: '🌴',
    link: '/services/retirement-planning',
    badgeColor: '#e0f2fe',
    textColor: '#0369a1',
  },
  {
    id: 'insurance-planning',
    name: 'Insurance Planning',
    category: 'Risk Protection',
    desc: 'Term life adequacy assessment, comprehensive health cover, and personal accident shield.',
    status: 'AVAILABLE',
    focus: 'Pure Protection & Family Shield',
    advisorTier: 'Insurance Advisory Desk',
    icon: '🛡️',
    link: '/services/insurance-planning',
    badgeColor: '#e0f2fe',
    textColor: '#0369a1',
  },
  {
    id: 'tax-planning',
    name: 'Tax Planning',
    category: 'Fiscal Optimization',
    desc: 'Section 80C, 80D structuring, NPS tax deductions, ELSS investments, and capital gains advisory.',
    status: 'AVAILABLE',
    focus: 'Tax Deduction & Compliance',
    advisorTier: 'Tax & Compliance Consultant',
    icon: '📋',
    link: '/services/tax-planning',
    badgeColor: '#e0f2fe',
    textColor: '#0369a1',
  },
  {
    id: 'wealth-management',
    name: 'Wealth Management',
    category: 'High Net Worth Advisory',
    desc: 'Private equity, bespoke debt syndication, estate succession planning, and family trust management.',
    status: 'AVAILABLE',
    focus: 'Estate & Multi-Asset Structuring',
    advisorTier: 'Executive Wealth Director',
    icon: '🏦',
    link: '/services/wealth-management',
    badgeColor: '#e0f2fe',
    textColor: '#0369a1',
  },
  {
    id: 'financial-planning',
    name: '360° Financial Planning',
    category: 'Foundational Roadmap',
    desc: 'End-to-end financial roadmap integrating emergency reserves, budgeting, and debt clearance.',
    status: 'AVAILABLE',
    focus: 'Holistic Financial Health',
    advisorTier: 'Lead Financial Planner',
    icon: '📊',
    link: '/services/financial-planning',
    badgeColor: '#e0f2fe',
    textColor: '#0369a1',
  },
];

export default function PlansPage() {
  return (
    <DashboardLayout>
      <head>
        <title>Advisory Tracks | GrowthNest Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      <div style={{ maxWidth: '1000px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0 0 0.35rem', color: 'var(--primary-900)', fontFamily: "'Playfair Display', serif" }}>
              Advisory Tracks &amp; Solutions
            </h2>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--gray-600)' }}>
              Explore specialized financial planning tracks or schedule a consultation to structure your custom plan.
            </p>
          </div>
          <Link
            href="/dashboard/appointments"
            className="btn btn-primary"
            style={{ background: '#101b3b', borderColor: '#101b3b' }}
          >
            + Book Advisory Session
          </Link>
        </div>

        {/* Empty / Enrollment State Notice */}
        <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>ℹ️</span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--primary-900)', fontSize: '0.92rem' }}>
                No active custom advisory enrollment yet.
              </div>
              <div style={{ color: 'var(--gray-600)', fontSize: '0.82rem' }}>
                Browse our core advisory solutions below to explore blueprints or connect with an advisor to start a customized track.
              </div>
            </div>
          </div>
          <Link href="/dashboard/appointments" className="btn btn-outline btn-sm" style={{ color: '#1e3a8a', borderColor: '#1e3a8a' }}>
            Schedule Consultation
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {advisoryTracks.map((plan) => (
            <div
              key={plan.id}
              className="glass-card-static"
              style={{
                background: '#ffffff',
                padding: '1.6rem',
                borderRadius: '14px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.75rem' }}>{plan.icon}</span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.65rem',
                      borderRadius: '12px',
                      background: plan.badgeColor,
                      color: plan.textColor,
                    }}
                  >
                    {plan.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>
                  {plan.category}
                </div>
                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                  {plan.name}
                </h3>
                <p style={{ margin: '0 0 1.25rem', fontSize: '0.82rem', color: 'var(--gray-600)', lineHeight: 1.5 }}>
                  {plan.desc}
                </p>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', color: 'var(--gray-500)' }}>
                  <span>Advisor Desk:</span>
                  <strong style={{ color: 'var(--gray-800)' }}>{plan.advisorTier}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--gray-500)' }}>
                  <span>Core Focus:</span>
                  <span style={{ color: '#0369a1', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>
                    {plan.focus}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link
                    href={plan.link}
                    className="btn btn-outline btn-sm"
                    style={{ flex: 1, justifyContent: 'center', fontSize: '0.78rem' }}
                  >
                    Explore Track
                  </Link>
                  <Link
                    href="/dashboard/appointments"
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1, justifyContent: 'center', fontSize: '0.78rem', background: '#101b3b', borderColor: '#101b3b' }}
                  >
                    Request Session
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
