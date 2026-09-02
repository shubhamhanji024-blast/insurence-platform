'use client';
import { useState } from 'react';
import { testimonials, leaderboard } from '@/data/testimonials';

export default function SuccessStoriesPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const cities = ['All', ...new Set(testimonials.map(t => t.city))];
  const filtered = activeFilter === 'All' ? testimonials : testimonials.filter(t => t.city === activeFilter);

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <>
      {/* Hero */}
      <section className="stories-hero">
        <div className="stories-hero-bg" />
        <div className="container text-center">
          <span className="label">Success Stories</span>
          <h1 style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            Real People, <span className="text-gradient">Real Results</span>
          </h1>
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem' }}>
            Discover how ordinary people achieved extraordinary financial success through the GrowthNest platform.
          </p>
        </div>
      </section>

      {/* ---- Podium Section ---- */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2> <span className="text-gradient">Top Performers</span> This Month</h2>
            <p>Our highest earning advisors across India — you&apos;re next.</p>
          </div>

          <div className="podium-container" style={{ marginBottom: '3rem' }}>
            {/* Silver — 2nd */}
            <div className="podium-item podium-silver">
              <div className="podium-card">
                <div className="podium-avatar"></div>
                <h4 style={{ margin: '0.5rem 0 0.25rem', fontSize: '1rem' }}>{top3[1]?.name}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{top3[1]?.city}</p>
                <div className="podium-income">{top3[1]?.income}</div>
              </div>
              <div className="podium-base">#2</div>
            </div>

            {/* Gold — 1st (tallest) */}
            <div className="podium-item podium-gold" style={{ zIndex: 2 }}>
              <div className="podium-crown"></div>
              <div className="podium-card">
                <div className="podium-avatar"></div>
                <h4 style={{ margin: '0.5rem 0 0.25rem', fontSize: '1.1rem' }}>{top3[0]?.name}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{top3[0]?.city}</p>
                <div className="podium-income text-shimmer">{top3[0]?.income}</div>
                <span className="badge badge-accent" style={{ marginTop: '0.5rem', fontSize: '0.7rem' }}>Top Earner </span>
              </div>
              <div className="podium-base">#1</div>
            </div>

            {/* Bronze — 3rd */}
            <div className="podium-item podium-bronze">
              <div className="podium-card">
                <div className="podium-avatar"></div>
                <h4 style={{ margin: '0.5rem 0 0.25rem', fontSize: '1rem' }}>{top3[2]?.name}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{top3[2]?.city}</p>
                <div className="podium-income">{top3[2]?.income}</div>
              </div>
              <div className="podium-base">#3</div>
            </div>
          </div>

          {/* Rest of leaderboard */}
          <div className="leaderboard-rest glass-card" style={{ maxWidth: '700px', margin: '0 auto', padding: 0 }}>
            {rest.map((leader, i) => (
              <div key={i} className="leader-row-item">
                <span style={{ fontSize: '1.5rem' }}>{leader.emoji}</span>
                <div style={{ flex: 1 }}>
                  <h5 style={{ margin: 0 }}>{leader.name}</h5>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{leader.city}</span>
                </div>
                <div className="text-gradient" style={{ fontSize: '1.2rem', fontWeight: 800 }}>{leader.income}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA Strip ---- */}
      <section className="cta-strip">
        <div className="container">
          <div className="cta-strip-inner">
            <div>
              <h3 style={{ margin: 0, marginBottom: '0.25rem' }}>You Could Be Next </h3>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Join 5,000+ advisors who turned their career around with GrowthNest.</p>
            </div>
            <div className="flex gap-md">
              <a href="/careers" className="btn btn-accent">Start Your Journey →</a>
              <a href="/calculator" className="btn btn-glass">Calculate Income</a>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Stories Grid ---- */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-heading">
            <h2>Advisor <span className="text-gradient">Journeys</span></h2>
            <p>From all walks of life — every story is unique.</p>
          </div>

          {/* City Filter */}
          <div className="flex justify-center gap-sm flex-wrap" style={{ marginBottom: '2.5rem' }}>
            {cities.map(city => (
              <button
                key={city}
                className={`chip ${activeFilter === city ? 'active' : ''}`}
                onClick={() => setActiveFilter(city)}
              >
                {city === 'All' ? '️ All Cities' : ` ${city}`}
              </button>
            ))}
          </div>

          <div className="grid grid-3">
            {filtered.map(t => (
              <div key={t.id} className="story-card glass-card card-hover-glow">
                <div className="story-card-header">
                  <div className="story-avatar">{t.image}</div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, marginBottom: '2px' }}>{t.name}</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.role} · {t.city}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--primary)' }}>Joined {t.joinYear}</p>
                  </div>
                </div>

                {/* Income comparison */}
                <div className="story-income-bar">
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Then</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textDecoration: 'line-through' }}>
                      ~₹{t.joinYear <= 2019 ? '15,000' : t.joinYear <= 2020 ? '25,000' : '30,000'}/mo
                    </div>
                  </div>
                  <div className="story-income-arrow"></div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Now</div>
                    <div className="text-gradient" style={{ fontSize: '1.15rem', fontWeight: 800 }}>{t.monthlyIncome}/mo</div>
                  </div>
                </div>

                {/* Journey quote */}
                <div className="story-quote">
                  &ldquo;{t.quote}&rdquo;
                </div>

                {/* Journey text */}
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, flex: 1 }}>
                  {t.journey}
                </p>

                {/* Awards */}
                <div className="story-awards">
                  {t.awards.map((award, i) => (
                    <span key={i} className="story-award-chip">{award}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .stories-hero {
          padding: calc(var(--nav-height) + 3rem) 0 4rem;
          position: relative;
          overflow: hidden;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-glass);
        }

        .stories-hero-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 30% 70%, rgba(255,215,0,0.06), transparent 60%),
                      radial-gradient(ellipse at 70% 20%, rgba(0,212,170,0.05), transparent 50%);
        }

        /* Podium */
        .podium-crown {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          animation: float 2.5s ease-in-out infinite;
        }

        .podium-avatar { font-size: 3rem; display: block; }
        .podium-income {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-top: 0.5rem;
          background: var(--gradient-text);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Leaderboard rest */
        .leaderboard-rest { overflow: hidden; }
        .leader-row-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border-glass);
          transition: background var(--transition-fast);
        }
        .leader-row-item:last-child { border-bottom: none; }
        .leader-row-item:hover { background: rgba(255,255,255,0.02); }

        /* CTA Strip */
        .cta-strip {
          padding: 2rem 0;
          background: linear-gradient(135deg, rgba(255,215,0,0.05), rgba(0,212,170,0.04));
          border-top: 1px solid var(--border-glass);
          border-bottom: 1px solid var(--border-glass);
        }

        .cta-strip-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
        }

        /* Story Cards */
        .story-card { display: flex; flex-direction: column; gap: 1rem; }

        .story-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .story-avatar {
          width: 56px; height: 56px;
          background: var(--bg-tertiary);
          border: 2px solid var(--border-glass);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 2rem;
          flex-shrink: 0;
        }

        .story-income-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1rem;
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
        }

        .story-income-arrow {
          color: var(--primary);
          font-size: 1rem;
        }

        .story-quote {
          font-style: italic;
          font-size: 0.9rem;
          color: var(--text-secondary);
          padding-left: 0.75rem;
          border-left: 3px solid var(--primary);
          line-height: 1.5;
        }

        .story-awards {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-glass);
        }

        .story-award-chip {
          font-size: 0.72rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border-glass);
          padding: 3px 8px;
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .podium-container { flex-direction: column-reverse; align-items: center; }
          .podium-item { max-width: 100%; width: 100%; }
          .cta-strip-inner { flex-direction: column; text-align: center; }
        }
      `}</style>
    </>
  );
}
