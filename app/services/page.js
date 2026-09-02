'use client';
import Link from 'next/link';

const servicesList = [
  {
    id: 'financial-planning',
    title: 'Financial Planning',
    desc: 'Comprehensive financial roadmaps tailored to your life goals — from wealth building to emergency funds and beyond.',
    features: ['Goal-Based Wealth Planning', 'Cash Flow & Expense Structuring', 'Emergency Fund Advisory', 'Debt Optimization'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" />
      </svg>
    ),
  },
  {
    id: 'investment-planning',
    title: 'Investment Planning',
    desc: 'Personalized investment strategies and diversified portfolio management to grow your wealth steadily over time.',
    features: ['Asset Allocation Strategy', 'Mutual Fund & Equity Curation', 'SIP & Lumpsum Structuring', 'Periodic Rebalancing'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
  {
    id: 'wealth-management',
    title: 'Wealth Management',
    desc: 'Holistic wealth strategies for high-net-worth individuals — asset allocation, legacy planning, and portfolio optimization.',
    features: ['HNI Portfolio Management', 'Estate & Legacy Planning', 'Alternative Investments', 'Dedicated Wealth Advisor'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    id: 'retirement-planning',
    title: 'Retirement Planning',
    desc: 'Comprehensive retirement solutions ensuring financial security with pension plans, SIPs, and long-term strategies.',
    features: ['Corpus Need Estimation', 'Pension & Annuity Advisory', 'Tax-Efficient Retirement Income', 'Inflation-Adjusted Growth'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    id: 'tax-planning',
    title: 'Tax Planning',
    desc: 'Strategic tax-saving investment options and financial structuring to legally minimise your tax liability every year.',
    features: ['Section 80C & Beyond Optimization', 'Capital Gains Tax Planning', 'Tax-Efficient Investment Selection', 'Year-End Filing Guidance'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    id: 'insurance-planning',
    title: 'Insurance Planning',
    desc: 'Expert guidance on life, health, and general insurance to protect you and your loved ones from unexpected events.',
    features: ['Term Life Cover Analysis', 'Health & Critical Illness Plans', 'Family Floater Evaluation', 'Claim Assistance Support'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <span className="hero-badge">Our Solutions</span>
          <h1>Financial Services Designed Around You</h1>
          <p>
            From comprehensive financial planning to tax optimization — GrowthNest provides end-to-end guidance for every stage of life.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section bg-gray-50">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-label">All Services</span>
            <h2 className="section-title">Explore Our Offerings</h2>
            <p className="section-desc">Click on any service to learn more about how we help you achieve your specific financial goals.</p>
          </div>

          <div className="services-grid">
            {servicesList.map((s) => (
              <div key={s.id} className="service-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p style={{ flex: 1 }}>{s.desc}</p>
                
                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--gray-100)' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-500)', marginBottom: '0.5rem' }}>Key Features:</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.25rem 0', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {s.features.map((feat, idx) => (
                      <li key={idx} style={{ fontSize: '0.825rem', color: 'var(--gray-700)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ color: 'var(--primary-700)', fontWeight: 700 }}>✓</span> {feat}
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    href={`/services/${s.id}`}
                    className="btn btn-outline btn-sm w-full"
                    style={{ justifyContent: 'center' }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <span className="section-label" style={{ color: '#d4af37' }}>Custom Strategy</span>
          <h2>Not sure which service is right for you?</h2>
          <p>Book a free 30-minute consultation with a senior advisor to evaluate your financial situation.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-secondary btn-lg">Schedule Consultation</Link>
            <Link href="/register" className="btn btn-outline-white btn-lg">Create Free Account</Link>
          </div>
        </div>
      </section>
    </>
  );
}
