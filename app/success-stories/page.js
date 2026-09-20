'use client';
import { useState } from 'react';
import { testimonials } from '@/data/testimonials';

export default function SuccessStoriesPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const cities = ['All', ...new Set(testimonials.map(t => t.city))];
  const filtered = activeFilter === 'All' ? testimonials : testimonials.filter(t => t.city === activeFilter);

  return (
    <>
      {/* Hero */}
      <section className="stories-hero">
        <div className="stories-hero-bg" />
        <div className="container text-center">
          <span className="label">Client Journeys</span>
          <h1 style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            Real Milestones, <span className="text-gradient">Structured Planning</span>
          </h1>
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem' }}>
            Discover how individuals and families navigated major life transitions and reached their goals through GrowthNest advisory.
          </p>
        </div>
      </section>

      {/* ---- Stories Grid ---- */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-heading">
            <h2>Financial <span className="text-gradient">Case Studies</span></h2>
            <p>Practical examples of structured goal planning, tax optimization, and long-term wealth protection.</p>
          </div>

          {/* City Filter */}
          <div className="flex justify-center gap-sm flex-wrap" style={{ marginBottom: '2.5rem' }}>
            {cities.map(city => (
              <button
                key={city}
                className={`chip ${activeFilter === city ? 'active' : ''}`}
                onClick={() => setActiveFilter(city)}
              >
                {city === 'All' ? 'All Regions' : city}
              </button>
            ))}
          </div>

          <div className="grid grid-3">
            {filtered.map(t => (
              <div key={t.id} className="story-card glass-card card-hover-glow" style={{ padding: '1.5rem', background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.2rem', color: '#101b3b', fontSize: '1.1rem' }}>{t.name}</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{t.role} · {t.city}</p>
                  </div>
                  <span style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0369a1', padding: '0.25rem 0.55rem', borderRadius: '12px', fontWeight: 600 }}>
                    {t.focusArea}
                  </span>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', borderLeft: '3px solid #19C3A3', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Milestone Accomplished</div>
                  <div style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 700, marginTop: '0.15rem' }}>{t.milestone}</div>
                </div>

                {/* Journey quote */}
                <div style={{ fontStyle: 'italic', fontSize: '0.88rem', color: '#334155', paddingLeft: '0.75rem', borderLeft: '3px solid #cbd5e1', marginBottom: '1rem', lineHeight: 1.5 }}>
                  &ldquo;{t.quote}&rdquo;
                </div>

                {/* Journey text */}
                <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                  {t.journey}
                </p>
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
              <h3 style={{ margin: 0, marginBottom: '0.25rem' }}>Begin Your Financial Plan</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Schedule a consultation with a certified wealth advisor to structure your personal goals.</p>
            </div>
            <div className="flex gap-md">
              <a href="/contact" className="btn btn-accent">Talk to an Advisor →</a>
              <a href="/calculators" className="btn btn-glass">Explore Calculators</a>
            </div>
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
