'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';

function formatINR(n) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

export default function CalculatorPage() {
  const [policies, setPolicies] = useState(8);
  const [premium, setPremium] = useState(20000);
  const [commRate, setCommRate] = useState(25);

  const monthly = useMemo(() => {
    const monthlyPrem = policies * premium;
    const yr1 = Math.round(monthlyPrem * (commRate / 100));
    const yr2 = Math.round(monthlyPrem * 12 * 0.07);
    const yr3 = Math.round(monthlyPrem * 12 * 0.075);
    const annual = yr1 * 12 + yr2 + yr3;
    return { monthlyPrem, yr1, yr2, yr3, annual, total3yr: yr1 * 12 + yr2 + yr3 * 2 };
  }, [policies, premium, commRate]);

  const tiers = [
    { label: 'Starter', policies: 3, income: '₹15K–30K/mo', color: 'var(--text-muted)' },
    { label: 'Active', policies: 8, income: '₹30K–80K/mo', color: 'var(--primary)' },
    { label: 'Gold', policies: 15, income: '₹80K–1.5L/mo', color: 'var(--accent)' },
    { label: 'Elite', policies: 30, income: '₹1.5L–3L+/mo', color: '#a855f7' },
  ];

  return (
    <>
      {/* Hero */}
      <section className="calc-hero">
        <div className="calc-hero-bg" />
        <div className="container text-center">
          <span className="label">Income Estimator</span>
          <h1 style={{ marginTop: '1rem', marginBottom: '0.75rem' }}>
            How Much Will You <span className="text-gradient">Earn?</span>
          </h1>
          <p style={{ maxWidth: '530px', margin: '0 auto', color: 'var(--text-secondary)' }}>
            Adjust the sliders below to estimate your monthly and annual income as a GrowthNest advisor.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="calc-layout">
            {/* Calculator Inputs */}
            <div className="calc-panel glass-card">
              <h3 style={{ marginBottom: '0.25rem' }}>🎛️ Adjust Your Targets</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>Drag the sliders to see your potential income.</p>

              {/* Slider: Policies */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>📋 Policies Per Month</label>
                  <span className="slider-value">{policies}</span>
                </div>
                <input type="range" min={1} max={50} value={policies} onChange={e => setPolicies(Number(e.target.value))} className="calc-slider" />
                <div className="slider-range-labels"><span>1</span><span>50</span></div>
              </div>

              {/* Slider: Premium */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>💳 Avg Annual Premium</label>
                  <span className="slider-value">{formatINR(premium)}</span>
                </div>
                <input type="range" min={5000} max={100000} step={5000} value={premium} onChange={e => setPremium(Number(e.target.value))} className="calc-slider" />
                <div className="slider-range-labels"><span>₹5K</span><span>₹1L</span></div>
              </div>

              {/* Slider: Commission */}
              <div className="slider-group">
                <div className="slider-header">
                  <label>📊 Commission Rate</label>
                  <span className="slider-value">{commRate}%</span>
                </div>
                <input type="range" min={15} max={35} value={commRate} onChange={e => setCommRate(Number(e.target.value))} className="calc-slider" />
                <div className="slider-range-labels"><span>15%</span><span>35%</span></div>
              </div>

              {/* Advisor Tiers */}
              <div className="advisor-tiers">
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Quick Presets</div>
                {tiers.map(t => (
                  <button key={t.label} className={`tier-btn ${policies === t.policies ? 'active' : ''}`} onClick={() => setPolicies(t.policies)} style={{ '--tier-color': t.color }}>
                    <span style={{ fontWeight: 700, color: t.color }}>{t.label}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.policies} policies</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: t.color }}>{t.income}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="calc-results">
              {/* Main Result */}
              <div className="calc-main-result">
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Est. Monthly Commission
                </div>
                <div className="calc-big-number">{formatINR(monthly.yr1)}<span className="calc-big-unit">/mo</span></div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  Based on {policies} policies × {formatINR(premium)} premium × {commRate}% commission
                </div>
              </div>

              {/* Year breakdown */}
              <div className="calc-breakdown">
                {[
                  { year: 'Year 1', value: monthly.yr1 * 12, color: 'var(--primary)', pct: 100, desc: `${commRate}% commission on new policies` },
                  { year: 'Year 2', value: monthly.yr1 * 12 + monthly.yr2, color: 'var(--secondary)', pct: 85, desc: 'Year 1 + 7% renewal from previous policies' },
                  { year: 'Year 3', value: monthly.total3yr, color: 'var(--accent)', pct: 70, desc: 'Year 1+2+3 renewals compounding' },
                ].map((y, i) => (
                  <div key={i} className="calc-year-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{y.year}</span>
                      <span style={{ fontWeight: 800, fontFamily: 'var(--font-display)', color: y.color }}>{formatINR(y.value)}</span>
                    </div>
                    <div className="progress-bar-container" style={{ height: '4px', marginBottom: '0.4rem' }}>
                      <div className="progress-bar-fill" style={{ width: `${y.pct}%`, background: y.color }} />
                    </div>
                    <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>{y.desc}</div>
                  </div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="calc-quick-stats">
                <div className="calc-stat">
                  <div className="calc-stat-val">{formatINR(monthly.monthlyPrem * 12)}</div>
                  <div className="calc-stat-lbl">Annual Premium Collected</div>
                </div>
                <div className="calc-stat">
                  <div className="calc-stat-val">{policies * 12}</div>
                  <div className="calc-stat-lbl">Policies Per Year</div>
                </div>
                <div className="calc-stat">
                  <div className="calc-stat-val">{formatINR(monthly.yr1)}</div>
                  <div className="calc-stat-lbl">Avg Monthly Earnings</div>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  * Estimates are indicative. Actual earnings depend on effort, products, and market conditions.
                </p>
                <Link href="/careers" className="btn btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                  🚀 Start Earning This — Join Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .calc-hero {
          padding: calc(var(--nav-height) + 3rem) 0 3rem;
          position: relative; overflow: hidden;
          background: var(--bg-secondary); border-bottom: 1px solid var(--border-glass);
        }
        .calc-hero-bg {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(108,99,255,0.08), transparent 60%);
        }
        .calc-layout {
          display: grid; grid-template-columns: 420px 1fr; gap: 2.5rem; align-items: start;
        }
        .calc-panel { padding: 2rem; }
        .slider-group { margin-bottom: 1.75rem; }
        .slider-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 0.5rem; font-size: 0.88rem; font-weight: 500;
        }
        .slider-value {
          font-family: var(--font-display); font-weight: 800;
          color: var(--primary); font-size: 1.1rem;
        }
        .calc-slider {
          width: 100%; height: 4px; border-radius: 2px;
          appearance: none; background: var(--bg-tertiary); cursor: pointer; outline: none;
        }
        .calc-slider::-webkit-slider-thumb {
          appearance: none; width: 20px; height: 20px;
          border-radius: 50%; background: var(--primary); cursor: pointer;
          box-shadow: 0 0 0 4px rgba(0,212,170,0.2); transition: box-shadow 0.2s;
        }
        .calc-slider::-webkit-slider-thumb:hover { box-shadow: 0 0 0 8px rgba(0,212,170,0.15); }
        .slider-range-labels {
          display: flex; justify-content: space-between;
          font-size: 0.72rem; color: var(--text-muted); margin-top: 4px;
        }
        .advisor-tiers {
          display: flex; flex-direction: column; gap: 0.4rem; margin-top: 1.5rem;
          padding-top: 1.5rem; border-top: 1px solid var(--border-glass);
        }
        .tier-btn {
          display: flex; justify-content: space-between; align-items: center;
          padding: 0.625rem 0.875rem; border-radius: var(--radius-md);
          background: var(--bg-tertiary); border: 1px solid var(--border-glass);
          cursor: pointer; transition: all 0.2s; font-family: var(--font-body);
          color: var(--text-primary);
        }
        .tier-btn:hover { border-color: var(--primary); }
        .tier-btn.active { background: rgba(0,212,170,0.06); border-color: var(--primary); }

        /* Results */
        .calc-results { display: flex; flex-direction: column; gap: 1.25rem; }
        .calc-main-result {
          padding: 2rem; text-align: center;
          background: linear-gradient(135deg, rgba(0,212,170,0.06), rgba(108,99,255,0.06));
          border: 1px solid rgba(0,212,170,0.2); border-radius: var(--radius-xl);
        }
        .calc-big-number {
          font-family: var(--font-display); font-size: 4rem; font-weight: 900;
          background: var(--gradient-text); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          line-height: 1;
        }
        .calc-big-unit { font-size: 1.5rem; }
        .calc-breakdown {
          display: flex; flex-direction: column; gap: 0.75rem;
        }
        .calc-year-card {
          padding: 1rem 1.25rem; background: var(--bg-card);
          border: 1px solid var(--border-glass); border-radius: var(--radius-md);
        }
        .calc-quick-stats {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem;
        }
        .calc-stat {
          padding: 1rem; text-align: center; background: var(--bg-card);
          border: 1px solid var(--border-glass); border-radius: var(--radius-md);
        }
        .calc-stat-val {
          font-family: var(--font-display); font-size: 1.3rem; font-weight: 800;
          color: var(--primary); margin-bottom: 0.25rem;
        }
        .calc-stat-lbl { font-size: 0.72rem; color: var(--text-muted); }
        @media (max-width: 900px) {
          .calc-layout { grid-template-columns: 1fr; }
          .calc-quick-stats { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 480px) {
          .calc-big-number { font-size: 2.5rem; }
          .calc-quick-stats { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
