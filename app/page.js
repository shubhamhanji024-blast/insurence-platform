'use client';
import { useState } from 'react';
import Link from 'next/link';

/* ---- FAQ Item ---- */
function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className={`faq-item${isOpen ? ' open' : ''}`}>
      <button className="faq-trigger" onClick={onToggle} aria-expanded={isOpen}>
        <span>{question}</span>
        <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div className="faq-answer" aria-hidden={!isOpen}>
        <div className="faq-answer-inner">{answer}</div>
      </div>
    </div>
  );
}

/* ---- Services Data ---- */
const services = [
  {
    id: 'financial-planning',
    title: 'Financial Planning',
    desc: 'Comprehensive financial roadmaps tailored to your life goals — from wealth building to emergency funds and beyond.',
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
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
];

/* ---- Testimonials Data ---- */
const testimonials = [
  {
    name: 'Rajesh Sharma',
    title: 'Business Owner, Delhi',
    initial: 'R',
    text: 'GrowthNest completely transformed my financial approach. Their personalized planning is precise and the team is always available to guide me. My portfolio has grown 40% in just 18 months.',
    stars: 5,
  },
  {
    name: 'Priya Mehta',
    title: 'Software Engineer, Bangalore',
    initial: 'P',
    text: 'The retirement planning service is exceptional. They helped me structure my savings in a tax-efficient way. I feel completely secure about my financial future now.',
    stars: 5,
  },
  {
    name: 'Amit Patel',
    title: 'Doctor, Mumbai',
    initial: 'A',
    text: 'As a busy professional I needed someone to manage my finances. GrowthNest handles everything perfectly. The transparent advice and data-driven insights are incredible.',
    stars: 5,
  },
];

/* ---- Blog Posts ---- */
const blogPosts = [
  {
    tag: 'Wealth Building',
    date: 'Aug 2026',
    title: 'How to Start Building Wealth in Your 30s',
    desc: 'Practical steps to begin your wealth journey with systematic planning, smart investments, and compounding returns.',
    img: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=600',
    href: '/blog',
  },
  {
    tag: 'Investing',
    date: 'Jul 2026',
    title: '5 Mistakes to Avoid When Investing',
    desc: 'Common investment pitfalls and how to avoid them — from emotional decisions to ignoring diversification.',
    img: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=600',
    href: '/blog',
  },
  {
    tag: 'Retirement',
    date: 'Jul 2026',
    title: 'How Much Should You Save for Retirement?',
    desc: 'The power of compounding explained — how starting early dramatically changes your retirement wealth accumulation.',
    img: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=600',
    href: '/blog',
  },
];

/* ---- FAQ Data ---- */
const faqs = [
  {
    question: 'What services does GrowthNest provide?',
    answer: 'GrowthNest provides a comprehensive suite of financial services including Financial Planning, Investment Planning, Wealth Management, Retirement Planning, Tax Planning, and Insurance Planning. Our expert advisors create personalized strategies tailored to your unique financial goals.',
  },
  {
    question: 'How does financial planning work?',
    answer: 'Our financial planning process starts with a thorough understanding of your current financial position, income, expenses, and long-term goals. We then analyze your situation, identify opportunities, and create a personalized roadmap. We continuously monitor and adjust your plan as your life circumstances evolve.',
  },
  {
    question: 'Can I create an investment plan?',
    answer: "Absolutely! We create customized investment plans based on your risk tolerance, time horizon, and financial goals. Whether you're interested in mutual funds, stocks, bonds, or alternative investments, we help you build a diversified portfolio designed for long-term growth.",
  },
  {
    question: 'How can I get started?',
    answer: 'Getting started is simple. Click "Get Started" on our website to create your free account, or reach out to us via the Contact page to schedule a complimentary consultation. Our advisor will connect with you within 24 hours to understand your needs.',
  },
  {
    question: 'Is financial planning personalized?',
    answer: 'Yes, absolutely. We believe there is no one-size-fits-all approach to financial planning. Every strategy we create is tailored to your specific financial situation, goals, risk tolerance, and life stage. We take the time to understand you before recommending any solutions.',
  },
  {
    question: 'How do I contact a financial advisor?',
    answer: 'You can contact us through our Contact page, by email at hello@growthnest.com, or by phone at +91 98765 43210. Our advisors are available Monday to Friday from 9 AM to 7 PM IST, and Saturday from 10 AM to 5 PM. We also offer video consultations.',
  },
];

/* ---- SIP Calculator Component ---- */
function SipCalculator() {
  const [monthly, setMonthly] = useState(5000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);

  const months = years * 12;
  const r = rate / 100 / 12;
  const maturity = Math.round(monthly * (((Math.pow(1 + r, months) - 1) / r) * (1 + r)));
  const invested = monthly * months;
  const returns = maturity - invested;

  const fmt = (n) => {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
    return `₹${n.toLocaleString('en-IN')}`;
  };

  return (
    <div className="calculator-card">
      <h3 style={{ fontFamily: "'Playfair Display', serif", marginBottom: '1.5rem', color: '#101b3b' }}>SIP Returns Calculator</h3>
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span>Monthly Investment</span>
          <strong style={{ color: '#1e3a8a' }}>₹{monthly.toLocaleString('en-IN')}</strong>
        </label>
        <input type="range" min={500} max={100000} step={500} value={monthly} onChange={e => setMonthly(+e.target.value)} />
      </div>
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span>Investment Period</span>
          <strong style={{ color: '#1e3a8a' }}>{years} Years</strong>
        </label>
        <input type="range" min={1} max={30} step={1} value={years} onChange={e => setYears(+e.target.value)} />
      </div>
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span>Expected Annual Returns</span>
          <strong style={{ color: '#1e3a8a' }}>{rate}%</strong>
        </label>
        <input type="range" min={6} max={24} step={0.5} value={rate} onChange={e => setRate(+e.target.value)} />
      </div>
      <div className="calc-result">
        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estimated Maturity Value</p>
        <div className="calc-result-num">{fmt(maturity)}</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.25rem' }}>Total Invested</p>
            <p style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>{fmt(invested)}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.25rem' }}>Wealth Gained</p>
            <p style={{ fontSize: '1rem', fontWeight: 600, color: '#d4af37' }}>{fmt(returns)}</p>
          </div>
        </div>
      </div>
      <div style={{ marginTop: '1.25rem' }}>
        <Link href="/contact" className="btn btn-outline w-full" style={{ justifyContent: 'center' }}>
          Get a Free Consultation
        </Link>
      </div>
    </div>
  );
}

/* ---- HomePage ---- */
export default function HomePage() {
  const [openFaq, setOpenFaq] = useState(0);
  const toggleFaq = (i) => setOpenFaq(openFaq === i ? -1 : i);

  return (
    <>
      {/* ======= HERO ======= */}
      <section className="hero" id="hero-section">
        <div className="container">
          <div className="hero-content fade-in-up">
            <div className="hero-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
              India&apos;s Trusted Financial Advisory
            </div>
            <h1>
              Build a Smarter<br />
              <span style={{ color: '#d4af37' }}>Financial Future</span>
            </h1>
            <p className="hero-subtitle">
              GrowthNest helps individuals and businesses make informed financial decisions through personalized planning, trusted guidance, and modern financial solutions.
            </p>
            <div className="hero-actions">
              <Link href="/register" className="btn btn-secondary btn-lg" id="hero-getstarted-btn">Get Started</Link>
              <Link href="/services" className="btn btn-outline-white btn-lg" id="hero-services-btn">Explore Services</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======= TRUST SECTION ======= */}
      <section className="trust-section" id="trust-section" aria-label="Why trust GrowthNest">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--gray-500)', fontWeight: 500 }}>Helping people make better financial decisions</p>
          </div>
          <div className="trust-grid">
            {[
              { title: 'Trusted Guidance', desc: 'SEBI-registered advisors with decade-long expertise', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> },
              { title: 'Transparent Advice', desc: 'Fee-only model — no hidden commissions, ever', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg> },
              { title: 'Personalized Planning', desc: 'Every strategy built uniquely around your goals', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> },
              { title: 'Long-Term Approach', desc: 'We focus on sustainable, lasting wealth creation', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg> },
            ].map((item, i) => (
              <div key={i} className="trust-item">
                <div className="trust-icon">{item.icon}</div>
                <div className="trust-text"><h4>{item.title}</h4><p>{item.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= SERVICES ======= */}
      <section className="section bg-gray-50" id="services-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-label">Our Services</span>
            <h2 className="section-title">Financial solutions designed around you</h2>
            <p className="section-desc">From financial planning to wealth management — comprehensive guidance tailored to your unique needs.</p>
          </div>
          <div className="services-grid">
            {services.map((s) => (
              <div key={s.id} className="service-card" id={`service-${s.id}`}>
                <div className="service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <Link href={`/services/${s.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '1rem', fontSize: '0.875rem', fontWeight: 600, color: '#1e3a8a' }}>
                  Learn More
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= ABOUT ======= */}
      <section className="section" id="about-section">
        <div className="container">
          <div className="split-grid">
            <div className="split-image">
              <img src="https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=800" alt="GrowthNest team meeting" loading="lazy" />
              <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem', background: 'rgba(16,27,59,0.92)', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ textAlign: 'center', flex: 1, borderRight: '1px solid rgba(255,255,255,0.2)', paddingRight: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#d4af37', fontFamily: "'Playfair Display', serif" }}>95%</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.15rem' }}>Client Satisfaction</div>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#d4af37', fontFamily: "'Playfair Display', serif" }}>10+</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.15rem' }}>Years of Expertise</div>
                </div>
              </div>
            </div>
            <div>
              <span className="section-label">About GrowthNest</span>
              <h2 className="section-title" style={{ textAlign: 'left' }}>Financial clarity for a better tomorrow.</h2>
              <p style={{ color: '#4b5563', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                At GrowthNest, we believe everyone deserves clear, unbiased financial guidance. We simplify complex financial decisions through personalized planning, transparent recommendations, and a deep commitment to your long-term prosperity.
              </p>
              <div className="feature-list">
                {[
                  { title: 'Understanding Your Goals', desc: 'We listen first, then plan — ensuring our strategies align with what truly matters to you.' },
                  { title: 'Transparent Recommendations', desc: 'No conflicts of interest. Our fee-only model means your success is our only motivation.' },
                  { title: 'Personalized Financial Planning', desc: 'Every client receives a unique financial roadmap, not a generic template.' },
                  { title: 'Long-Term Financial Growth', desc: 'We focus on sustainable wealth creation strategies that work across market cycles.' },
                ].map((f, i) => (
                  <div key={i} className="feature-item">
                    <div className="feature-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <div className="feature-text"><h4>{f.title}</h4><p>{f.desc}</p></div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
                <Link href="/about" className="btn btn-primary" id="about-learn-more-btn">Learn More</Link>
                <Link href="/contact" className="btn btn-outline" id="about-contact-btn">Talk to an Advisor</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======= FEATURED / ONE CLEAR PLAN ======= */}
      <section className="section bg-gray-50" id="featured-section">
        <div className="container">
          <div className="split-grid">
            <div>
              <span className="section-label">One Clear Plan</span>
              <h2 className="section-title" style={{ textAlign: 'left' }}>One clear plan for your financial goals.</h2>
              <p style={{ color: '#4b5563', marginBottom: '2rem', lineHeight: 1.7 }}>
                GrowthNest gives you a single, unified view of your financial life — tracking goals, monitoring investments, analyzing risk, and measuring progress — all in one intelligent platform.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {[
                  { icon: '📊', title: 'Financial Goal Tracking', desc: 'Set, monitor and achieve every financial milestone.' },
                  { icon: '📈', title: 'Investment Planning', desc: 'Personalized investment portfolios with regular rebalancing.' },
                  { icon: '🔍', title: 'Risk Analysis', desc: 'Understand your risk profile and invest accordingly.' },
                  { icon: '💼', title: 'Portfolio Overview', desc: 'Consolidated view of all your assets and investments.' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem 1.25rem', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>{item.icon}</div>
                    <div>
                      <p style={{ fontWeight: 700, color: '#101b3b', marginBottom: '0.1rem', fontSize: '0.95rem' }}>{item.title}</p>
                      <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: 0 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/register" className="btn btn-primary">Get Started Today</Link>
            </div>

            {/* Dashboard Mockup */}
            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
              <div style={{ background: '#101b3b', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.9rem' }}>My Financial Dashboard</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
                </div>
              </div>
              <div style={{ padding: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                  {[
                    { label: 'Portfolio Value', value: '₹24.8L', delta: '+12.4%', color: '#22c55e' },
                    { label: 'Monthly Savings', value: '₹45,000', delta: 'On Track', color: '#3b82f6' },
                    { label: 'Financial Goals', value: '3 Active', delta: '2 Near Target', color: '#f59e0b' },
                    { label: 'Investments', value: '₹18.2L', delta: '+8.7%', color: '#8b5cf6' },
                  ].map((s, i) => (
                    <div key={i} style={{ background: '#f9fafb', borderRadius: '10px', padding: '0.875rem', border: '1px solid #e5e7eb' }}>
                      <p style={{ fontSize: '0.7rem', color: '#6b7280', margin: '0 0 0.3rem' }}>{s.label}</p>
                      <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#101b3b', margin: '0 0 0.2rem', fontFamily: "'Playfair Display', serif" }}>{s.value}</p>
                      <span style={{ fontSize: '0.7rem', color: s.color, fontWeight: 600 }}>{s.delta}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '1rem', border: '1px solid #e5e7eb', marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>Portfolio Performance — 2026</p>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '60px' }}>
                    {[35, 45, 40, 60, 55, 70, 65, 80, 75, 90, 85, 100].map((h, i) => (
                      <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 11 ? '#1e3a8a' : i >= 9 ? '#93c5fd' : '#dbeafe', borderRadius: '3px 3px 0 0' }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
                    {['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'].map(m => (
                      <span key={m} style={{ fontSize: '0.6rem', color: '#9ca3af' }}>{m}</span>
                    ))}
                  </div>
                </div>
                <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '1rem', border: '1px solid #e5e7eb' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>Goal Progress</p>
                  {[
                    { goal: 'Emergency Fund', pct: 85, color: '#1e3a8a' },
                    { goal: 'Home Down Payment', pct: 42, color: '#d4af37' },
                    { goal: 'Retirement Corpus', pct: 28, color: '#22c55e' },
                  ].map((g, i) => (
                    <div key={i} style={{ marginBottom: '0.6rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.72rem', color: '#374151' }}>{g.goal}</span>
                        <span style={{ fontSize: '0.72rem', color: g.color, fontWeight: 600 }}>{g.pct}%</span>
                      </div>
                      <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${g.pct}%`, height: '100%', background: g.color, borderRadius: '3px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======= HOW IT WORKS ======= */}
      <section className="process-section" id="how-it-works">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <span className="section-label">Our Process</span>
            <h2 className="section-title">Your financial journey, simplified.</h2>
            <p className="section-desc">A clear, structured approach to help you achieve your financial goals at every step.</p>
          </div>
          <div className="process-grid">
            {[
              { num: '01', title: 'Understand', desc: 'Understand your goals, income, expenses, and current financial position through an in-depth consultation.' },
              { num: '02', title: 'Analyze', desc: 'Analyze your financial needs, risk tolerance, opportunities, and potential risks with data-driven tools.' },
              { num: '03', title: 'Plan', desc: 'Create a personalized, actionable financial strategy aligned with your short-term and long-term goals.' },
              { num: '04', title: 'Grow', desc: 'Implement your plan, track progress regularly, and make smarter financial decisions over time.' },
            ].map((step, i) => (
              <div key={i} className="process-card">
                <div className="process-number">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= WHY GROWTHNEST ======= */}
      <section className="why-section" id="why-growthnest">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <span className="section-label">Why Choose Us</span>
            <h2 className="section-title">Why GrowthNest?</h2>
            <p className="section-desc">We combine expert knowledge, technology, and a genuine client-first philosophy to deliver exceptional results.</p>
          </div>
          <div className="why-grid">
            {[
              { title: 'Personalized Approach', desc: 'No two clients are alike. We craft strategies unique to your financial situation and aspirations.', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> },
              { title: 'Transparent Recommendations', desc: 'Every recommendation comes with a clear rationale. No hidden fees, no conflicts of interest.', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg> },
              { title: 'Data-Driven Insights', desc: 'Our decisions are backed by real data, sophisticated analysis, and market intelligence.', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg> },
              { title: 'Long-Term Planning', desc: 'We look beyond the immediate future to help you build wealth that lasts across generations.', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> },
              { title: 'Easy-to-Understand Guidance', desc: 'We break down complex financial concepts into simple, actionable advice you can act on today.', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg> },
              { title: 'Customer First', desc: 'Your financial success is our success. We measure our performance by the goals you achieve.', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg> },
            ].map((item, i) => (
              <div key={i} className="why-card">
                <div className="why-icon">{item.icon}</div>
                <div className="why-text"><h4>{item.title}</h4><p>{item.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= TESTIMONIALS ======= */}
      <section className="section" id="client-experiences">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-label">Client Experiences</span>
            <h2 className="section-title">What Our Clients Say</h2>
            <p className="section-desc">Real stories from people who trusted us with their financial journey.</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card" id={`testimonial-${i}`}>
                <div className="stars">{'★'.repeat(t.stars)}</div>
                <p className="testimonial-text">&ldquo;{t.text}&rdquo;</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.initial}</div>
                  <div>
                    <p className="author-name">{t.name}</p>
                    <p className="author-title">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= SIP CALCULATOR ======= */}
      <section className="section bg-gray-50" id="calculators-section">
        <div className="container">
          <div className="split-grid">
            <div>
              <span className="section-label">Planning Tools</span>
              <h2 className="section-title" style={{ textAlign: 'left' }}>Calculate Your Financial Future</h2>
              <p style={{ color: '#4b5563', marginBottom: '2rem', lineHeight: 1.7 }}>
                Use our interactive SIP calculator to plan your investments and understand the power of compounding over time.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { title: 'SIP Calculator', desc: 'Plan your monthly mutual fund investments' },
                  { title: 'Retirement Corpus Calculator', desc: 'Find out how much you need to retire comfortably' },
                  { title: 'Tax Savings Planner', desc: 'See how much tax you can save with smart investments' },
                  { title: 'Goal-Based Planning', desc: 'Plan for specific goals like home, education, or travel' },
                ].map((c, i) => (
                  <Link key={i} href="/contact" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#fff', transition: 'all 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="12" y2="14" /></svg>
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: '#101b3b', marginBottom: '0.1rem', fontSize: '0.95rem' }}>{c.title}</p>
                      <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0 }}>{c.desc}</p>
                    </div>
                    <svg style={{ marginLeft: 'auto', flexShrink: 0 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
                  </Link>
                ))}
              </div>
            </div>
            <div><SipCalculator /></div>
          </div>
        </div>
      </section>

      {/* ======= BLOG / INSIGHTS ======= */}
      <section className="section" id="insights-section">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
            <div>
              <span className="section-label">Financial Insights</span>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Latest From Our Blog</h2>
            </div>
            <Link href="/blog" className="btn btn-outline btn-sm" id="view-all-blog-btn">View All Articles</Link>
          </div>
          <div className="blog-grid">
            {blogPosts.map((post, i) => (
              <Link key={i} href={post.href} className="blog-card" id={`blog-card-${i}`}>
                <div className="blog-image"><img src={post.img} alt={post.title} loading="lazy" /></div>
                <div className="blog-body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <span className="blog-tag">{post.tag}</span>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{post.date}</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.desc}</p>
                  <span className="blog-link">
                    Read More
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ======= FAQ ======= */}
      <section className="faq-section" id="faq-section">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <span className="section-label">FAQ</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-desc">Everything you need to know about GrowthNest and our services.</p>
          </div>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} isOpen={openFaq === i} onToggle={() => toggleFaq(i)} />
            ))}
          </div>
        </div>
      </section>

      {/* ======= CTA ======= */}
      <section className="cta-section" id="cta-section">
        <div className="container">
          <span className="section-label" style={{ color: '#d4af37' }}>Start Today</span>
          <h2>Your financial future starts today.</h2>
          <p>Take the next step toward making smarter and more confident financial decisions.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" className="btn btn-secondary btn-lg" id="cta-start-btn">Get Started</Link>
            <Link href="/contact" className="btn btn-outline-white btn-lg" id="cta-contact-btn">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
