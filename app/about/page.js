'use client';
import Link from 'next/link';
import { team, milestones } from '@/data/team';

export default function AboutPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <span className="hero-badge">About GrowthNest</span>
          <h1>Financial clarity for a better tomorrow</h1>
          <p>
            We help individuals and families make smarter, more confident financial decisions through personalized planning, trusted guidance, and modern solutions.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="grid grid-2" style={{ gap: '2rem' }}>
            <div className="glass-card" style={{ padding: '2.5rem', borderLeft: '4px solid var(--primary-700)' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-700)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
              </div>
              <h3 style={{ marginBottom: '0.75rem', color: 'var(--primary-900)' }}>Our Mission</h3>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, fontSize: '0.95rem', margin: 0 }}>
                To empower every individual and business with accessible, transparent, and personalized financial planning — helping them build lasting wealth and secure their financial future.
              </p>
            </div>
            <div className="glass-card" style={{ padding: '2.5rem', borderLeft: '4px solid var(--accent-500)' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fef9c3', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#854d0e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              </div>
              <h3 style={{ marginBottom: '0.75rem', color: 'var(--primary-900)' }}>Our Vision</h3>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, fontSize: '0.95rem', margin: 0 }}>
                To become India&apos;s most trusted financial advisory platform, known for customer-first principles, transparent recommendations, and innovative digital wealth management solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story / Split */}
      <section className="section">
        <div className="container">
          <div className="split-grid">
            <div className="split-image">
              <img
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="GrowthNest advisory meeting"
                loading="lazy"
              />
            </div>
            <div>
              <span className="section-label">Our Story</span>
              <h2 className="section-title" style={{ textAlign: 'left' }}>
                Built on Trust, Transparency &amp; Expertise
              </h2>
              <p style={{ color: 'var(--gray-600)', marginBottom: '1rem', lineHeight: 1.7 }}>
                Founded with a mission to eliminate confusion in financial planning, GrowthNest has grown into a trusted financial services platform serving thousands of clients across India.
              </p>
              <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                We combine deep domain expertise in investment planning, tax strategy, and wealth management with modern digital tools to deliver an unmatched client experience.
              </p>

              <div className="grid grid-2" style={{ gap: '1rem', marginBottom: '2rem' }}>
                {[
                  { num: '10K+', lbl: 'Clients Supported' },
                  { num: '₹100Cr+', lbl: 'Financial Goals Planned' },
                  { num: '95%', lbl: 'Customer Satisfaction' },
                  { num: '10+', lbl: 'Years of Expertise' },
                ].map((s, i) => (
                  <div key={i} style={{ padding: '1rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)' }}>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-700)' }}>{s.num}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '0.2rem' }}>{s.lbl}</div>
                  </div>
                ))}
              </div>

              <Link href="/contact" className="btn btn-primary">Talk to an Advisor</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="section bg-gray-50">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-label">Leadership</span>
            <h2 className="section-title">Meet Our Experts</h2>
            <p className="section-desc">Experienced professionals dedicated to guiding your financial success.</p>
          </div>

          <div className="grid grid-3" style={{ gap: '1.5rem' }}>
            {team.map((member, i) => (
              <div key={i} className="service-card" style={{ textAlign: 'center' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'var(--primary-700)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '1.25rem', margin: '0 auto 1.25rem',
                  fontFamily: 'Playfair Display, serif'
                }}>
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>{member.name}</h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--primary-700)', fontWeight: 600, marginBottom: '0.75rem' }}>{member.role}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', lineHeight: 1.6, margin: 0 }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-label">What Drives Us</span>
            <h2 className="section-title">Our Core Values</h2>
          </div>

          <div className="why-grid">
            {[
              { title: 'Trust', desc: 'Built on absolute integrity, compliance, and transparent advisory.', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> },
              { title: 'Customer First', desc: 'Your financial goals dictate every plan and recommendation we produce.', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg> },
              { title: 'Simplicity', desc: 'Demystifying complex investment structures into plain, actionable advice.', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg> },
              { title: 'Excellence', desc: 'Continuous research and data-driven methods to deliver top tier outcomes.', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg> },
            ].map((v, i) => (
              <div key={i} className="why-card">
                <div className="why-icon">{v.icon}</div>
                <div className="why-text">
                  <h4>{v.title}</h4>
                  <p>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <span className="section-label" style={{ color: '#d4af37' }}>Get In Touch</span>
          <h2>Ready to work with GrowthNest?</h2>
          <p>Schedule a complimentary financial review with one of our experienced advisors today.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-secondary btn-lg">Contact Us</Link>
            <Link href="/services" className="btn btn-outline-white btn-lg">Explore Services</Link>
          </div>
        </div>
      </section>
    </>
  );
}
