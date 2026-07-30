'use client';
import { team, milestones } from '@/data/team';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-bg" />
        <div className="container">
          <div className="about-hero-grid">
            <div>
              <span className="label">Our Story</span>
              <h1 style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                Democratizing <span className="text-gradient">Insurance Advisory</span> in India
              </h1>
              <p style={{ fontSize: '1.05rem', marginBottom: '1.5rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                GrowthNest was founded in 2014 with one belief — that anyone with dedication and the right training can build a rewarding career in insurance advisory, regardless of their background.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href="/careers" className="btn btn-primary">🚀 Join Our Team</Link>
                <Link href="/contact" className="btn btn-secondary">Contact Us</Link>
              </div>
            </div>
            <div className="about-stats-card glass-card">
              {[
                { num: '5,000+', label: 'Active Advisors', icon: '👥' },
                { num: '20+', label: 'Insurance Partners', icon: '🤝' },
                { num: '15 States', label: 'Pan-India Presence', icon: '🗺️' },
                { num: '₹50 Cr+', label: 'Business Generated', icon: '💰' },
                { num: '98%', label: 'Advisor Satisfaction', icon: '⭐' },
                { num: '2014', label: 'Year Founded', icon: '📅' },
              ].map((s, i) => (
                <div key={i} className="about-stat">
                  <div className="about-stat-icon">{s.icon}</div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.num}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="grid grid-2">
            <div className="glass-card card-hover-glow" style={{ padding: '2.5rem', borderLeft: '4px solid var(--primary)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎯</div>
              <h3 style={{ marginBottom: '0.75rem' }}>Our Mission</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                To empower every Indian with the opportunity to become a financial advisor — providing free world-class training, digital tools, and a trusted network of insurance partners to build unlimited income.
              </p>
            </div>
            <div className="glass-card card-hover-glow" style={{ padding: '2.5rem', borderLeft: '4px solid var(--secondary)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌟</div>
              <h3 style={{ marginBottom: '0.75rem' }}>Our Vision</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                To create 25,000 financially independent insurance advisors across India by 2030, generating ₹500 Crore in business and ensuring every Indian family has adequate insurance coverage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="label">Our Journey</span>
            <h2>10 Years of <span className="text-gradient">Impact</span></h2>
          </div>
          <div className="timeline">
            {milestones.map((m, i) => (
              <div key={i} className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}>
                <div className="timeline-dot">{m.year}</div>
                <div className="timeline-card glass-card card-hover-glow">
                  <h4 style={{ marginBottom: '0.4rem', fontSize: '1rem' }}>{m.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-heading">
            <span className="label">The People Behind GrowthNest</span>
            <h2>Meet Our <span className="text-gradient">Leadership Team</span></h2>
          </div>
          <div className="grid grid-3">
            {team.map((member, i) => (
              <div key={i} className="glass-card card-hover-glow team-card">
                <div className="team-avatar">{member.name.split(' ').map(n => n[0]).join('')}</div>
                <h4 style={{ marginBottom: '0.2rem', textAlign: 'center' }}>{member.name}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, textAlign: 'center', marginBottom: '0.75rem' }}>{member.role}</div>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.6, margin: '0 0 1rem' }}>{member.bio}</p>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <a href={member.linkedin} className="team-social">💼</a>
                  <a href={member.twitter} className="team-social">🐦</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="label">What Drives Us</span>
            <h2>Our Core <span className="text-gradient">Values</span></h2>
          </div>
          <div className="grid grid-4">
            {[
              { icon: '🏆', title: 'Excellence', desc: 'We set the highest standards in training and advisor support.' },
              { icon: '🤝', title: 'Trust', desc: 'Built on integrity, transparency, and long-term relationships.' },
              { icon: '💡', title: 'Innovation', desc: 'Constantly improving our platform with better tools and technology.' },
              { icon: '❤️', title: 'Empathy', desc: 'We understand the advisor journey and support every step.' },
            ].map((v, i) => (
              <div key={i} className="glass-card card-hover-glow" style={{ padding: '1.75rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{v.icon}</div>
                <h4 style={{ marginBottom: '0.4rem' }}>{v.title}</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .about-hero {
          padding: calc(var(--nav-height) + 3rem) 0 4rem;
          position: relative; overflow: hidden;
          border-bottom: 1px solid var(--border-glass);
        }
        .about-hero-bg {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 30% 50%, rgba(0,212,170,0.06), transparent 50%),
                      radial-gradient(ellipse at 70% 30%, rgba(108,99,255,0.05), transparent 50%);
        }
        .about-hero-grid {
          display: grid; grid-template-columns: 1fr 420px; gap: 4rem; align-items: center;
        }
        .about-stats-card {
          padding: 1.5rem;
          display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;
        }
        .about-stat {
          display: flex; gap: 0.75rem; align-items: center;
        }
        .about-stat-icon {
          font-size: 1.5rem; width: 40px; height: 40px; display: flex;
          align-items: center; justify-content: center;
          background: var(--bg-tertiary); border-radius: var(--radius-sm); flex-shrink: 0;
        }
        /* Timeline */
        .timeline {
          position: relative; max-width: 900px; margin: 0 auto;
          display: flex; flex-direction: column; gap: 0;
        }
        .timeline::before {
          content: ''; position: absolute; left: 50%; top: 0; bottom: 0;
          width: 2px; background: var(--border-glass); transform: translateX(-50%);
        }
        .timeline-item {
          display: flex; gap: 2rem; align-items: flex-start;
          padding: 1.5rem 0; position: relative;
        }
        .timeline-item.left { flex-direction: row; }
        .timeline-item.right { flex-direction: row-reverse; }
        .timeline-dot {
          position: absolute; left: 50%; transform: translateX(-50%);
          width: 56px; height: 56px; border-radius: 50%;
          background: var(--gradient-primary); color: var(--bg-primary);
          font-weight: 800; font-size: 0.75rem; font-family: var(--font-display);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 0 4px var(--bg-primary), 0 0 0 6px var(--primary);
          z-index: 2;
        }
        .timeline-card {
          width: calc(50% - 3rem); padding: 1.25rem;
        }
        .timeline-item.left .timeline-card { margin-right: calc(50% + 1rem); }
        .timeline-item.right .timeline-card { margin-left: calc(50% + 1rem); }
        /* Team */
        .team-card { padding: 2rem; display: flex; flex-direction: column; }
        .team-avatar {
          width: 72px; height: 72px; border-radius: 50%;
          background: var(--gradient-primary); display: flex; align-items: center;
          justify-content: center; font-weight: 800; font-size: 1.4rem;
          color: var(--bg-primary); margin: 0 auto 1rem;
          font-family: var(--font-display);
        }
        .team-social {
          width: 32px; height: 32px; background: var(--bg-tertiary);
          border: 1px solid var(--border-glass); border-radius: var(--radius-sm);
          display: flex; align-items: center; justify-content: center;
          text-decoration: none; transition: all 0.2s; font-size: 0.9rem;
        }
        .team-social:hover { border-color: var(--primary); background: rgba(0,212,170,0.08); }
        @media (max-width: 1024px) {
          .about-hero-grid { grid-template-columns: 1fr; gap: 2.5rem; }
          .about-stats-card { order: -1; }
        }
        @media (max-width: 768px) {
          .timeline::before { left: 24px; }
          .timeline-dot { left: 24px; width: 48px; height: 48px; font-size: 0.65rem; }
          .timeline-item { flex-direction: column !important; padding-left: 60px; }
          .timeline-card { width: 100% !important; margin: 0 !important; }
        }
      `}</style>
    </>
  );
}
