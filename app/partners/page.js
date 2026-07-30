'use client';
import { useState } from 'react';
import { partners, partnerTypes } from '@/data/partners';

export default function PartnersPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const filtered = activeFilter === 'All'
    ? partners
    : partners.filter(p => p.type.includes(activeFilter));

  return (
    <>
      {/* Hero */}
      <section className="partners-hero">
        <div className="partners-hero-bg" />
        <div className="container text-center">
          <span className="label">Our Ecosystem</span>
          <h1 style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            20+ Trusted <span className="text-gradient">Insurance Partners</span>
          </h1>
          <p style={{ maxWidth: '650px', margin: '0 auto 2rem', fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            Sell products from India's most trusted insurance companies through one unified platform. Best commissions, fastest payouts.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {partnerTypes.map(t => (
              <button key={t} onClick={() => setActiveFilter(t)} className={`blog-cat-pill ${activeFilter === t ? 'active' : ''}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <div className="partners-trust-bar">
        <div className="container">
          <div className="partners-trust-items">
            {[
              { num: '20+', label: 'Insurance Partners' },
              { num: '98.5%', label: 'Avg Claim Settlement' },
              { num: '₹50Cr+', label: 'Business Generated' },
              { num: '15–35%', label: 'First-Year Commission' },
            ].map((s, i) => (
              <div key={i} className="partner-trust-item">
                <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.num}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Partners Grid */}
      <section className="section">
        <div className="container">
          <div className="partners-grid">
            {filtered.map(p => (
              <div key={p.id} className={`partner-card glass-card card-hover-glow ${selected === p.id ? 'expanded' : ''}`} onClick={() => setSelected(selected === p.id ? null : p.id)}>
                <div className="partner-header">
                  <div className="partner-logo-wrap">
                    <span className="partner-logo">{p.logo}</span>
                  </div>
                  <div className="partner-title">
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{p.name}</h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.type}</span>
                  </div>
                  <div className="partner-csr">
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>{p.claimSettlement}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>CSR</div>
                  </div>
                </div>

                <div className="partner-claim-bar">
                  <div className="progress-bar-container" style={{ height: '3px' }}>
                    <div className="progress-bar-fill" style={{ width: p.claimSettlement }} />
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '3px', display: 'block' }}>Claim Settlement Ratio</span>
                </div>

                {selected === p.id && (
                  <div className="partner-detail animate-fade-in">
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>{p.description}</p>
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Key Products</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {p.keyProducts.map((prod, i) => (
                          <span key={i} style={{ fontSize: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                            {prod}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span>📅 Founded: <strong style={{ color: 'var(--text-primary)' }}>{p.founded}</strong></span>
                      <span>🏙️ HQ: <strong style={{ color: 'var(--text-primary)' }}>{p.headquarters}</strong></span>
                      <span>📊 Share: <strong style={{ color: 'var(--primary)' }}>{p.marketShare}</strong></span>
                    </div>
                  </div>
                )}

                <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', cursor: 'pointer' }}>
                    {selected === p.id ? '▲ Show Less' : '▼ View Details'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Sell With Us */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-heading">
            <span className="label">Advisor Advantage</span>
            <h2>Why Sell Through <span className="text-gradient">GrowthNest?</span></h2>
          </div>
          <div className="grid grid-4">
            {[
              { icon: '💰', title: 'Best Commission', desc: '15–35% first year + renewal commissions credited within 15 days.' },
              { icon: '🎯', title: 'Single Platform', desc: 'Manage all your insurance companies through one dashboard.' },
              { icon: '📚', title: 'Product Training', desc: 'Dedicated product training for every insurance company we partner with.' },
              { icon: '🤝', title: 'Partner Support', desc: '24/7 partner helpdesk for quick query resolution and claim support.' },
            ].map((item, i) => (
              <div key={i} className="glass-card card-hover-glow" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                <h4 style={{ marginBottom: '0.4rem' }}>{item.title}</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .partners-hero {
          padding: calc(var(--nav-height) + 3rem) 0 3rem;
          position: relative; overflow: hidden;
          background: var(--bg-secondary); border-bottom: 1px solid var(--border-glass);
        }
        .partners-hero-bg {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(0,212,170,0.07), transparent 60%);
        }
        .partners-trust-bar {
          padding: 1.5rem 0; background: var(--bg-card);
          border-bottom: 1px solid var(--border-glass);
        }
        .partners-trust-items {
          display: flex; justify-content: center; gap: 4rem; flex-wrap: wrap;
        }
        .partner-trust-item { text-align: center; }
        .partners-grid {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem;
        }
        .partner-card { padding: 1.5rem; cursor: pointer; }
        .partner-header {
          display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;
        }
        .partner-logo-wrap {
          width: 56px; height: 56px; background: var(--bg-tertiary);
          border-radius: var(--radius-md); display: flex; align-items: center;
          justify-content: center; flex-shrink: 0;
        }
        .partner-logo { font-size: 1.8rem; }
        .partner-title { flex: 1; }
        .partner-csr { text-align: center; }
        .partner-claim-bar { margin-bottom: 0.5rem; }
        .partner-detail { padding-top: 1rem; border-top: 1px solid var(--border-glass); margin-top: 0.75rem; }
        :global(.blog-cat-pill) {
          padding: 0.4rem 1rem; border-radius: var(--radius-full);
          border: 1px solid var(--border-glass); background: transparent;
          color: var(--text-secondary); cursor: pointer; font-size: 0.85rem;
          transition: all 0.2s; font-family: var(--font-body);
        }
        :global(.blog-cat-pill:hover), :global(.blog-cat-pill.active) {
          background: var(--primary); border-color: var(--primary);
          color: var(--bg-primary); font-weight: 600;
        }
        @media (max-width: 768px) {
          .partners-grid { grid-template-columns: 1fr; }
          .partners-trust-items { gap: 2rem; }
        }
      `}</style>
    </>
  );
}
