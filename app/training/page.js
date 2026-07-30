'use client';
import Link from 'next/link';
import { trainingModules, overallProgress } from '@/data/training-modules';

/* SVG Progress Ring */
function ProgressRing({ pct, size = 120, stroke = 10, color = 'var(--primary)' }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="progress-ring-wrapper" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bg-tertiary)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="progress-ring-text">
        <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-display)', background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{pct}%</div>
        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Complete</div>
      </div>
    </div>
  );
}

const difficultyColors = {
  Beginner: { bg: 'rgba(0,212,170,0.1)', color: 'var(--primary)', label: '🟢 Beginner' },
  Intermediate: { bg: 'rgba(255,215,0,0.1)', color: 'var(--accent)', label: '🟡 Intermediate' },
  Advanced: { bg: 'rgba(108,99,255,0.1)', color: 'var(--secondary)', label: '🔵 Advanced' },
};

export default function TrainingPortalPreviewPage() {
  const completedCount = trainingModules.filter(m => m.status === 'completed').length;
  const inProgressCount = trainingModules.filter(m => m.status === 'in-progress').length;

  return (
    <>
      {/* Hero */}
      <section className="training-hero">
        <div className="training-hero-bg" />
        <div className="container text-center">
          <span className="label">GrowthNest Academy</span>
          <h1 style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            Learn from the <span className="text-gradient">Best</span>
          </h1>
          <p style={{ maxWidth: '650px', margin: '0 auto', fontSize: '1.05rem' }}>
            Our comprehensive training portal equips you with the knowledge and skills needed to succeed in the insurance industry.
          </p>
        </div>
      </section>

      {/* Overview + Modules */}
      <section className="section">
        <div className="container">
          <div className="training-grid">
            {/* Left: Dashboard panel */}
            <div>
              <h3 style={{ marginBottom: '1.5rem' }}>Your Learning Dashboard</h3>
              <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                Track your progress, earn certificates, and access video lectures, PDF notes, live webinars, and practice tests.
              </p>

              {/* Progress Ring Card */}
              <div className="glass-card-static training-progress-card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <ProgressRing pct={overallProgress} />
                  <div>
                    <h4 style={{ marginBottom: '0.5rem' }}>Overall Progress</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      Keep going! Complete all modules to unlock your Advisor Certificate.
                    </p>
                    <div className="training-mini-stats">
                      <div className="training-mini-stat">
                        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{completedCount}</span>
                        <span>Done</span>
                      </div>
                      <div className="training-mini-stat">
                        <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{inProgressCount}</span>
                        <span>In Progress</span>
                      </div>
                      <div className="training-mini-stat">
                        <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>{trainingModules.length - completedCount - inProgressCount}</span>
                        <span>Locked</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Module progress bars */}
                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {trainingModules.map(mod => (
                    <div key={mod.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                        <span>{mod.title}</span>
                        <span style={{ color: mod.status === 'completed' ? 'var(--primary)' : mod.status === 'in-progress' ? 'var(--accent)' : 'var(--text-muted)' }}>
                          {mod.status === 'completed' ? '100%' : mod.status === 'in-progress' ? `${mod.progress}%` : '0%'}
                        </span>
                      </div>
                      <div className="progress-bar-container" style={{ height: '4px' }}>
                        <div className="progress-bar-fill" style={{
                          width: mod.status === 'completed' ? '100%' : mod.status === 'in-progress' ? `${mod.progress}%` : '0%',
                          background: mod.status === 'completed' ? undefined : mod.status === 'in-progress' ? 'linear-gradient(90deg, var(--accent), #ff8c00)' : 'var(--bg-tertiary)',
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certificate preview */}
              <div className="cert-preview-card">
                <div className="cert-preview-badge">🏅</div>
                <div>
                  <h5 style={{ margin: 0, marginBottom: '0.25rem' }}>Advisor Certificate</h5>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>Unlock after completing all modules. IRDAI-recognized credential.</p>
                </div>
                <span className="badge badge-accent" style={{ marginLeft: 'auto', flexShrink: 0 }}>15% left</span>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <Link href="/careers" className="btn btn-primary" style={{ flex: 1 }}>
                  Join to Access
                </Link>
                <Link href="/login" className="btn btn-secondary" style={{ flex: 1 }}>
                  Login
                </Link>
              </div>
            </div>

            {/* Right: Module List */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>Training Curriculum</h3>
                <span className="badge badge-primary">{trainingModules.length} Modules</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {trainingModules.map((mod, i) => {
                  const difficulty = i < 2 ? 'Beginner' : i < 4 ? 'Intermediate' : 'Advanced';
                  const dc = difficultyColors[difficulty];
                  return (
                    <div key={mod.id} className={`module-card ${mod.status}`}>
                      <div className="module-step">{String(i + 1).padStart(2, '0')}</div>
                      <div className="module-icon">{mod.icon}</div>
                      <div className="module-info">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '0.3rem' }}>
                          <h4 style={{ margin: 0, fontSize: '0.95rem', color: mod.status === 'locked' ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                            {mod.title}
                          </h4>
                          <span className="module-status-icon" style={{ flexShrink: 0 }}>
                            {mod.status === 'completed' ? '✅' : mod.status === 'in-progress' ? '⏳' : '🔒'}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>{mod.description}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>⏱️ {mod.duration}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>📚 {mod.lessons} Lessons</span>
                          <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: dc.bg, color: dc.color }}>
                            {dc.label}
                          </span>
                        </div>
                        {mod.status === 'in-progress' && (
                          <div style={{ marginTop: '0.6rem' }}>
                            <div className="progress-bar-container" style={{ height: '4px' }}>
                              <div className="progress-bar-fill" style={{ width: `${mod.progress}%`, background: 'linear-gradient(90deg, var(--accent), #ff8c00)' }} />
                            </div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--accent)', marginTop: '3px', display: 'block' }}>{mod.progress}% complete</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Will Master */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-heading">
            <span className="label">Curriculum Highlights</span>
            <h2>What You Will <span className="text-gradient">Master</span></h2>
            <p>Every skill you need to become a top-performing insurance advisor.</p>
          </div>
          <div className="grid grid-4">
            {[
              { icon: '🎯', title: 'Needs Analysis', desc: 'Accurately assess a client\'s financial needs and gaps.', color: 'rgba(0,212,170,0.1)', iconBg: 'rgba(0,212,170,0.15)' },
              { icon: '🗣️', title: 'Objection Handling', desc: 'Master answering "I don\'t have money" or "Let me think."', color: 'rgba(108,99,255,0.1)', iconBg: 'rgba(108,99,255,0.15)' },
              { icon: '📱', title: 'Social Selling', desc: 'Generate steady leads via WhatsApp and social media.', color: 'rgba(255,215,0,0.08)', iconBg: 'rgba(255,215,0,0.15)' },
              { icon: '📜', title: 'Underwriting Basics', desc: 'Ensure smooth policy issuance with compliance know-how.', color: 'rgba(255,99,132,0.08)', iconBg: 'rgba(255,99,132,0.15)' },
              { icon: '💼', title: 'Portfolio Planning', desc: 'Build comprehensive insurance portfolios for clients.', color: 'rgba(0,212,170,0.06)', iconBg: 'rgba(0,212,170,0.12)' },
              { icon: '📊', title: 'Sales Analytics', desc: 'Track performance metrics and optimize your pipeline.', color: 'rgba(108,99,255,0.06)', iconBg: 'rgba(108,99,255,0.12)' },
              { icon: '🤝', title: 'Client Retention', desc: 'Build long-term relationships for renewals and referrals.', color: 'rgba(255,215,0,0.06)', iconBg: 'rgba(255,215,0,0.12)' },
              { icon: '💡', title: 'Tax-Saving Strategies', desc: 'Position insurance as a powerful tax-saving instrument.', color: 'rgba(255,99,132,0.06)', iconBg: 'rgba(255,99,132,0.12)' },
            ].map((item, i) => (
              <div key={i} className="master-card glass-card card-hover-glow" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <div className="master-icon" style={{ background: item.iconBg }}>{item.icon}</div>
                <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>{item.title}</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .training-hero {
          padding: calc(var(--nav-height) + 3rem) 0 4rem;
          position: relative;
          overflow: hidden;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-glass);
        }

        .training-hero-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 60%, rgba(108,99,255,0.07), transparent 60%),
                      radial-gradient(ellipse at 20% 30%, rgba(0,212,170,0.05), transparent 50%);
        }

        .training-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }

        .training-progress-card { padding: 2rem; }

        .training-mini-stats {
          display: flex;
          gap: 1.5rem;
        }

        .training-mini-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .training-mini-stat span:first-child { font-size: 1.2rem; font-family: var(--font-display); }

        .cert-preview-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          background: linear-gradient(135deg, rgba(255,215,0,0.06), rgba(255,140,0,0.04));
          border: 1px solid rgba(255,215,0,0.2);
          border-radius: var(--radius-md);
        }

        .cert-preview-badge { font-size: 2rem; }

        .module-card {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          padding: 1rem;
          background: var(--bg-card);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          transition: all 0.2s;
        }

        .module-card.completed { border-left: 3px solid var(--primary); }
        .module-card.in-progress {
          border-left: 3px solid var(--accent);
          background: rgba(255,215,0,0.02);
          box-shadow: 0 0 20px rgba(255,215,0,0.05);
        }
        .module-card.locked { opacity: 0.55; filter: grayscale(60%); }

        .module-step {
          font-family: var(--font-display);
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--text-muted);
          padding-top: 2px;
          flex-shrink: 0;
          width: 24px;
        }

        .module-icon {
          width: 40px; height: 40px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-sm);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem;
          flex-shrink: 0;
        }

        .module-info { flex: 1; min-width: 0; }

        .master-icon {
          width: 56px; height: 56px;
          border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.8rem;
          margin: 0 auto 1rem;
        }

        @media (max-width: 1024px) {
          .training-grid { grid-template-columns: 1fr; gap: 3rem; }
        }
      `}</style>
    </>
  );
}
