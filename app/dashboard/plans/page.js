'use client';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const detailedPlans = [
  {
    id: 'investment-planning',
    name: 'Investment Planning',
    category: 'Wealth Growth',
    desc: 'Asset allocation, curated mutual fund portfolios, equity distribution, and periodic risk profiling.',
    status: 'ACTIVE',
    createdDate: '15 Jan 2026',
    nextAction: 'Review portfolio rebalancing with advisor',
    advisor: 'Senior Portfolio Manager',
    icon: '💹',
    link: '/services/investment-planning',
    badgeColor: '#dcfce7',
    textColor: '#15803d',
  },
  {
    id: 'retirement-planning',
    name: 'Retirement Planning',
    category: 'Long-term Security',
    desc: 'Corpus calculation, pension indexation, annuity purchasing, and tax-efficient withdrawal structures.',
    status: 'ACTIVE',
    createdDate: '02 Feb 2026',
    nextAction: 'Increase monthly voluntary SIP by 10%',
    advisor: 'Retirement Specialist',
    icon: '🌴',
    link: '/services/retirement-planning',
    badgeColor: '#dcfce7',
    textColor: '#15803d',
  },
  {
    id: 'insurance-planning',
    name: 'Insurance Planning',
    category: 'Risk Protection',
    desc: 'Term life adequacy assessment, comprehensive health cover, and personal accident shield.',
    status: 'IN_REVIEW',
    createdDate: '20 Feb 2026',
    nextAction: 'Provide updated diagnostic reports for premium underwriting',
    advisor: 'Insurance Advisory Desk',
    icon: '🛡️',
    link: '/services/insurance-planning',
    badgeColor: '#fef3c7',
    textColor: '#b45309',
  },
  {
    id: 'tax-planning',
    name: 'Tax Planning',
    category: 'Fiscal Optimization',
    desc: 'Section 80C, 80D structuring, NPS tax deductions, ELSS investments, and capital gains advisory.',
    status: 'ACTIVE',
    createdDate: '10 Mar 2026',
    nextAction: 'Finalize FY 2025-26 tax-saving investment certificates',
    advisor: 'Tax & Compliance Consultant',
    icon: '📋',
    link: '/services/tax-planning',
    badgeColor: '#dcfce7',
    textColor: '#15803d',
  },
  {
    id: 'wealth-management',
    name: 'Wealth Management',
    category: 'High Net Worth Advisory',
    desc: 'Private equity, bespoke debt syndication, estate succession planning, and family trust management.',
    status: 'EXPLORE',
    createdDate: 'Available',
    nextAction: 'Book consultation to unlock HNI advisory tier',
    advisor: 'Executive Wealth Director',
    icon: '🏦',
    link: '/services/wealth-management',
    badgeColor: '#f1f5f9',
    textColor: '#475569',
  },
  {
    id: 'financial-planning',
    name: '360° Financial Planning',
    category: 'Foundational Roadmap',
    desc: 'End-to-end financial roadmap integrating emergency reserves, budgeting, and debt clearance.',
    status: 'ACTIVE',
    createdDate: '01 Jan 2026',
    nextAction: 'Maintain minimum 6 months living expenses in liquid buffer',
    advisor: 'Lead Financial Planner',
    icon: '📊',
    link: '/services/financial-planning',
    badgeColor: '#dcfce7',
    textColor: '#15803d',
  },
];

export default function PlansPage() {
  return (
    <DashboardLayout>
      <head>
        <title>My Financial Plans | GrowthNest Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      <div style={{ maxWidth: '1000px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0 0 0.35rem', color: 'var(--primary-900)', fontFamily: "'Playfair Display', serif" }}>
              My Financial Plans
            </h2>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--gray-600)' }}>
              Track active financial planning advisory tracks and strategic milestones.
            </p>
          </div>
          <Link
            href="/services"
            className="btn btn-outline"
            style={{ color: '#1e3a8a', borderColor: '#1e3a8a' }}
          >
            Explore All Services →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {detailedPlans.map((plan) => (
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
                  <span>Advisor:</span>
                  <strong style={{ color: 'var(--gray-800)' }}>{plan.advisor}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', color: 'var(--gray-500)' }}>
                  <span>Created:</span>
                  <span style={{ color: 'var(--gray-700)' }}>{plan.createdDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--gray-500)' }}>
                  <span>Next Action:</span>
                  <span style={{ color: '#0369a1', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>
                    {plan.nextAction}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link
                    href={plan.link}
                    className="btn btn-outline btn-sm"
                    style={{ flex: 1, justifyContent: 'center', fontSize: '0.78rem' }}
                  >
                    Learn More
                  </Link>
                  <Link
                    href="/dashboard/support"
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1, justifyContent: 'center', fontSize: '0.78rem', background: '#101b3b', borderColor: '#101b3b' }}
                  >
                    Consult Advisor
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
