import Link from 'next/link';

export default function RetirementEducation() {
  return (
    <div className="sip-education-section">
      <div className="glass-card-static" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <span className="section-label">Educational Guide</span>
        <h2 className="section-title" style={{ textAlign: 'left', fontSize: '1.75rem' }}>
          What is Retirement Planning?
        </h2>
        <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, fontSize: '1rem', marginBottom: '2rem' }}>
          Retirement planning involves estimating your future financial requirements, understanding inflation-adjusted living expenses, and systematically building an investment portfolio that can sustain your desired lifestyle after you transition out of full-time employment.
        </p>

        <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--primary-900)' }}>
          Why start retirement planning early?
        </h3>

        <div className="process-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div className="process-card" style={{ padding: '1.5rem' }}>
            <div className="process-number">01</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Power of Compounding</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0 }}>
              Starting early allows your earnings and reinvested returns decades of compound growth with lower capital pressure.
            </p>
          </div>

          <div className="process-card" style={{ padding: '1.5rem' }}>
            <div className="process-number">02</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Financial Discipline</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0 }}>
              Automated monthly investments cultivate habit-building and insulate your wealth building from short-term market noise.
            </p>
          </div>

          <div className="process-card" style={{ padding: '1.5rem' }}>
            <div className="process-number">03</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Inflation Protection</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0 }}>
              Living costs compound over 20–30 years. Equity-backed retirement assets help outperform price inflation.
            </p>
          </div>

          <div className="process-card" style={{ padding: '1.5rem' }}>
            <div className="process-number">04</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Lower Outflow Needed</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0 }}>
              Investing at Age 25 requires a fraction of the monthly allocation needed at Age 45 to reach the exact same target corpus.
            </p>
          </div>
        </div>

        {/* Retirement Planning Considerations */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-xl)', padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-900)' }}>
            📌 Retirement Planning Considerations
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.95rem', color: 'var(--gray-700)' }}>
              <span style={{ color: '#19C3A3', fontWeight: 'bold' }}>✓</span>
              <span><strong>Account for Inflation:</strong> Always project future living expenses with realistic inflation assumptions (e.g. 6% p.a.).</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.95rem', color: 'var(--gray-700)' }}>
              <span style={{ color: '#19C3A3', fontWeight: 'bold' }}>✓</span>
              <span><strong>Review Plan Periodically:</strong> Rebalance your portfolio annually to align with changing life goals and market conditions.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.95rem', color: 'var(--gray-700)' }}>
              <span style={{ color: '#19C3A3', fontWeight: 'bold' }}>✓</span>
              <span><strong>Factor in Healthcare Costs:</strong> Reserve an adequate medical corpus alongside regular retirement living expenses.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.95rem', color: 'var(--gray-700)' }}>
              <span style={{ color: '#19C3A3', fontWeight: 'bold' }}>✓</span>
              <span><strong>Adjust Risk Tolerance:</strong> Gradually shift from growth equities to capital preservation instruments as retirement approaches.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.95rem', color: 'var(--gray-700)' }}>
              <span style={{ color: '#19C3A3', fontWeight: 'bold' }}>✓</span>
              <span><strong>Seek Professional Guidance:</strong> Consult a certified wealth advisor to tailor asset allocation to your tax profile.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
