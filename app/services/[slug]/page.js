'use client';
import { use } from 'react';
import Link from 'next/link';

const servicesData = {
  'financial-planning': {
    title: 'Financial Planning',
    badge: 'Comprehensive Advisory',
    tagline: 'A clear, customized roadmap for all your life milestones.',
    description: 'Financial Planning at GrowthNest is designed to bring total clarity to your financial life. We evaluate your current income, assets, liabilities, and future goals to build a resilient financial plan.',
    benefits: [
      { title: 'Goal-Based Wealth Planning', desc: 'Identify short-term, medium-term, and long-term milestones with exact target numbers.' },
      { title: 'Cash Flow & Expense Structuring', desc: 'Optimize your monthly cash flow to maximize savings without compromising lifestyle.' },
      { title: 'Emergency Fund Strategy', desc: 'Build a 6-12 month liquid safety net to protect against unexpected life events.' },
      { title: 'Debt Management & Reduction', desc: 'Smart restructuring to eliminate high-interest debt and improve credit posture.' },
    ],
    process: [
      { step: '01', title: 'Data Gathering', desc: 'Comprehensive review of your income, expenses, liabilities, and financial aspirations.' },
      { step: '02', title: 'Gap Analysis', desc: 'Identifying shortfall in savings, protection coverage, and asset allocation.' },
      { step: '03', title: 'Plan Blueprint', desc: 'Custom financial roadmap detailing exact asset allocation and monthly targets.' },
      { step: '04', title: 'Review & Adapt', desc: 'Annual reviews to update the plan as your career, family, and markets evolve.' },
    ]
  },
  'investment-planning': {
    title: 'Investment Planning',
    badge: 'Wealth Creation',
    tagline: 'Data-driven portfolios engineered for sustainable growth.',
    description: 'Our Investment Planning service helps you build and manage a diversified investment portfolio aligned with your risk tolerance, liquidity needs, and time horizon.',
    benefits: [
      { title: 'Asset Allocation Strategy', desc: 'Balanced exposure across Equities, Debt, Gold, and Global Assets tailored to your risk profile.' },
      { title: 'Mutual Fund & Stock Curation', desc: 'Rigorous quantitative and qualitative filtering to pick top-performing funds.' },
      { title: 'SIP & Lumpsum Optimization', desc: 'Systematic investment plans designed to benefit from market volatility and rupee cost averaging.' },
      { title: 'Periodic Portfolio Rebalancing', desc: 'Disciplined rebalancing to maintain target asset ratios and lock in gains.' },
    ],
    process: [
      { step: '01', title: 'Risk Profiling', desc: 'Assessing your risk capacity and psychological willingness to take market risk.' },
      { step: '02', title: 'Portfolio Design', desc: 'Crafting an optimal asset mix using historical data and forward expectations.' },
      { step: '03', title: 'Implementation', desc: 'Deploying capital seamlessly through digital, paperless onboarding.' },
      { step: '04', title: 'Active Monitoring', desc: 'Continuous monitoring with quarterly progress reports and tactical tweaks.' },
    ]
  },
  'wealth-management': {
    title: 'Wealth Management',
    badge: 'HNI & Family Office',
    tagline: 'Bespoke wealth solutions for High-Net-Worth Individuals.',
    description: 'GrowthNest Wealth Management provides sophisticated advisory services for high-net-worth individuals, business owners, and corporate executives requiring customized asset management.',
    benefits: [
      { title: 'Dedicated Wealth Advisor', desc: 'Single point of contact supported by a team of analysts, tax consultants, and research experts.' },
      { title: 'Estate & Legacy Planning', desc: 'Structuring trusts, wills, and succession strategies to protect family legacy across generations.' },
      { title: 'Alternative Investment Funds (AIF)', desc: 'Access to private equity, venture debt, structured products, and real estate funds.' },
      { title: 'Tax-Efficient Structuring', desc: 'Optimizing corporate and personal asset holding structures for maximum tax efficiency.' },
    ],
    process: [
      { step: '01', title: 'Discovery & Audit', desc: 'Holistic assessment of family assets, business holdings, liabilities, and estate goals.' },
      { step: '02', title: 'Strategy Architecture', desc: 'Designing custom investment mandates and legal asset holding structures.' },
      { step: '03', title: 'Execution', desc: 'Execution across public, private markets, and specialized institutional vehicles.' },
      { step: '04', title: 'Governance', desc: 'Regular family board meetings, consolidated reporting, and risk audits.' },
    ]
  },
  'retirement-planning': {
    title: 'Retirement Planning',
    badge: 'Financial Independence',
    tagline: 'Ensure a comfortable, stress-free life after your career.',
    description: 'Retirement Planning at GrowthNest ensures you can maintain your desired lifestyle after retirement without worrying about outliving your money or inflation.',
    benefits: [
      { title: 'Corpus Requirement Estimation', desc: 'Calculating inflation-adjusted retirement target considering medical and lifestyle expenses.' },
      { title: 'Pension & Annuity Advisory', desc: 'Structuring guaranteed lifetime income streams through annuities and provident funds.' },
      { title: 'Tax-Efficient Withdrawal Strategy', desc: 'Planning systematic withdrawal strategies (SWPs) to minimize tax during retirement years.' },
      { title: 'Healthcare & Long-Term Care Plan', desc: 'Dedicated medical insurance reserves to protect your retirement capital from health shocks.' },
    ],
    process: [
      { step: '01', title: 'Lifestyle Mapping', desc: 'Defining expected post-retirement expenses, travel plans, and healthcare requirements.' },
      { step: '02', title: 'Corpus Calculation', desc: 'Determining exact savings required factoring in 6-8% annual inflation.' },
      { step: '03', title: 'Accumulation Phase', desc: 'Building high-growth assets during your earning years via equity SIPs.' },
      { step: '04', title: 'Distribution Phase', desc: 'Transitioning to capital preservation and steady monthly cash flows post-retirement.' },
    ]
  },
  'tax-planning': {
    title: 'Tax Planning',
    badge: 'Tax Optimization',
    tagline: 'Legally minimize tax liabilities while building wealth.',
    description: 'Our Tax Planning service goes beyond simple Section 80C deductions. We help you structure investments, income streams, and capital gains to maximize after-tax returns.',
    benefits: [
      { title: 'Section 80C & Beyond Deductions', desc: 'Optimizing ELSS, NPS, Health Insurance (80D), and Home Loan deductions.' },
      { title: 'Capital Gains Tax Management', desc: 'Tax harvesting strategies for equity and mutual funds to utilize annual exemptions.' },
      { title: 'Tax-Efficient Income Structuring', desc: 'Selecting growth options over dividend options for better compounding and lower tax drag.' },
      { title: 'Advance Tax & Filing Support', desc: 'Quarterly advance tax computation and guidance for seamless annual return filing.' },
    ],
    process: [
      { step: '01', title: 'Tax Assessment', desc: 'Evaluating overall income sources: salary, business, capital gains, rental, and interest.' },
      { step: '02', title: 'Deduction Audit', desc: 'Identifying unused tax exemptions and allowable deductions under current tax laws.' },
      { step: '03', title: 'Investment Alignment', desc: 'Deploying tax-saving investments early in the financial year for maximum compounding.' },
      { step: '04', title: 'Year-End Review', desc: 'Final audit before March 31st to ensure zero missed tax optimization opportunities.' },
    ]
  },
  'insurance-planning': {
    title: 'Insurance Planning',
    badge: 'Family Protection',
    tagline: 'Protect your family and assets against unexpected life risks.',
    description: 'Insurance Planning ensures that unexpected life events, illness, or disability do not derail your family’s financial security or drain your hard-earned savings.',
    benefits: [
      { title: 'Human Life Value (HLV) Analysis', desc: 'Scientific calculation of exact term insurance cover required for primary earners.' },
      { title: 'Comprehensive Health Insurance', desc: 'Selecting high-deductible super top-up and floater policies with restoration benefits.' },
      { title: 'Critical Illness & Disability Cover', desc: 'Lump-sum payout policies protecting against lifestyle diseases and permanent disability.' },
      { title: 'Claim Support & Advocacy', desc: 'Dedicated assistance for claim settlement to ensure hassle-free payouts when needed.' },
    ],
    process: [
      { step: '01', title: 'Risk Audit', desc: 'Evaluating existing policies, company cover gaps, and dependent financial requirements.' },
      { step: '02', title: 'Need Calculation', desc: 'Determining exact cover amounts for term life, health, and critical illness.' },
      { step: '03', title: 'Policy Comparison', desc: 'Unbiased comparison of claim settlement ratios, sub-limits, and exclusions.' },
      { step: '04', title: 'Issuance & Review', desc: 'Assisting with medical checks, policy issuance, and annual cover adequacy reviews.' },
    ]
  }
};

export default function ServiceDetailPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const service = servicesData[slug] || servicesData['financial-planning'];

  return (
    <>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <span className="hero-badge">{service.badge}</span>
          <h1>{service.title}</h1>
          <p>{service.tagline}</p>
        </div>
      </section>

      {/* Overview & Benefits */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="split-grid" style={{ marginBottom: '4rem', alignItems: 'center' }}>
            <div>
              <span className="section-label">Overview</span>
              <h2 className="section-title" style={{ textAlign: 'left' }}>
                Why {service.title} Matters
              </h2>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '1.5rem' }}>
                {service.description}
              </p>
              <Link href="/contact" className="btn btn-primary">Book Consultation for {service.title}</Link>
            </div>
            
            <div className="glass-card" style={{ padding: '2rem', background: '#fff' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-900)' }}>Quick Highlights</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--gray-700)' }}>
                  <span style={{ color: 'var(--primary-700)', fontWeight: 700 }}>✓</span> SEBI-Registered Financial Advisory
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--gray-700)' }}>
                  <span style={{ color: 'var(--primary-700)', fontWeight: 700 }}>✓</span> 100% Transparent Fee-Only Model
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--gray-700)' }}>
                  <span style={{ color: 'var(--primary-700)', fontWeight: 700 }}>✓</span> Dedicated Senior Advisor Assigned
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--gray-700)' }}>
                  <span style={{ color: 'var(--primary-700)', fontWeight: 700 }}>✓</span> 24/7 Digital Dashboard Tracking
                </li>
              </ul>
            </div>
          </div>

          {/* Key Benefits Grid */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="section-label">Key Pillars</span>
            <h2 className="section-title">What We Deliver</h2>
          </div>

          <div className="service-detail-features">
            {service.benefits.map((benefit, i) => (
              <div key={i} className="service-feature-item">
                <div className="service-feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '0.25rem' }}>{benefit.title}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0, lineHeight: 1.6 }}>{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Implement */}
      <section className="process-section">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <span className="section-label">Implementation</span>
            <h2 className="section-title">How It Works</h2>
            <p className="section-desc">Our structured process for {service.title.toLowerCase()}.</p>
          </div>

          <div className="process-grid">
            {service.process.map((step, i) => (
              <div key={i} className="process-card">
                <div className="process-number">{step.step}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <span className="section-label" style={{ color: '#d4af37' }}>Get Started</span>
          <h2>Ready to optimize your {service.title.toLowerCase()}?</h2>
          <p>Schedule a 1-on-1 consultation with a GrowthNest expert today.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-secondary btn-lg">Schedule Consultation</Link>
            <Link href="/services" className="btn btn-outline-white btn-lg">Explore Other Services</Link>
          </div>
        </div>
      </section>
    </>
  );
}
