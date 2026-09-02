'use client';

export default function LumpsumScenarios({ currentReturn, onSelectReturn }) {
  const scenarios = [
    { label: 'Conservative', returnRate: 8, badge: '8% Return', desc: 'Lower volatility, stable growth' },
    { label: 'Balanced', returnRate: 12, badge: '12% Return', desc: 'Moderate equity portfolio average' },
    { label: 'Growth', returnRate: 15, badge: '15% Return', desc: 'Higher long-term growth potential' },
  ];

  return (
    <div className="glass-card-static" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.2rem', color: 'var(--primary-900)' }}>
            Explore Investment Scenarios
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', margin: 0 }}>
            Click a preset scenario below to test return expectations (illustrative estimates only).
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {scenarios.map((sc) => {
          const isActive = Number(currentReturn) === sc.returnRate;
          return (
            <button
              key={sc.label}
              type="button"
              onClick={() => onSelectReturn(sc.returnRate)}
              style={{
                textAlign: 'left',
                padding: '1rem',
                borderRadius: 'var(--radius-lg)',
                border: isActive ? '2px solid #19C3A3' : '1px solid var(--gray-200)',
                background: isActive ? '#f0fdf4' : '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary-900)' }}>
                  {sc.label}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#19C3A3', background: 'rgba(25, 195, 163, 0.12)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                  {sc.badge}
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--gray-600)', margin: 0 }}>
                {sc.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
