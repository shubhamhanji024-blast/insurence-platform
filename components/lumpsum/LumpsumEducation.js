import Link from 'next/link';

export default function LumpsumEducation() {
  return (
    <div className="sip-education-section">
      <div className="glass-card-static" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <span className="section-label">Educational Guide</span>
        <h2 className="section-title" style={{ textAlign: 'left', fontSize: '1.75rem' }}>
          What is a Lumpsum Investment?
        </h2>
        <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, fontSize: '1rem', marginBottom: '2rem' }}>
          A lumpsum investment is a one-time allocation of a larger capital amount into an investment vehicle (such as mutual funds, equity portfolios, or fixed income instruments) rather than investing smaller amounts regularly over time. The potential future value of your lumpsum investment grows as returns compound across your chosen investment horizon.
        </p>

        <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--primary-900)' }}>
          How does compound growth work in 4 steps?
        </h3>

        <div className="process-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div className="process-card" style={{ padding: '1.5rem' }}>
            <div className="process-number">01</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>One-Time Capital</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0 }}>
              You deposit an initial lumpsum amount into your chosen investment portfolio.
            </p>
          </div>

          <div className="process-card" style={{ padding: '1.5rem' }}>
            <div className="process-number">02</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Generate Returns</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0 }}>
              Your investment generates market-linked or fixed annual growth returns over time.
            </p>
          </div>

          <div className="process-card" style={{ padding: '1.5rem' }}>
            <div className="process-number">03</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Reinvestment &amp; Compounding</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0 }}>
              Accumulated returns get reinvested, earning additional growth on top of previous gains.
            </p>
          </div>

          <div className="process-card" style={{ padding: '1.5rem' }}>
            <div className="process-number">04</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Long-Term Multiplier</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0 }}>
              Over longer time horizons, compounding accelerates the total estimated future value exponentially.
            </p>
          </div>
        </div>

        {/* Things to Consider */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-xl)', padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-900)' }}>
            📌 Things to Consider
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.95rem', color: 'var(--gray-700)' }}>
              <span style={{ color: '#19C3A3', fontWeight: 'bold' }}>✓</span>
              <span><strong>Investment Returns Can Vary:</strong> Market fluctuations may impact short-term returns; long-term holding periods help smooth volatility.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.95rem', color: 'var(--gray-700)' }}>
              <span style={{ color: '#19C3A3', fontWeight: 'bold' }}>✓</span>
              <span><strong>Longer Periods Enable Compounding:</strong> Allowing your money to stay invested longer maximizes the compounding effect.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.95rem', color: 'var(--gray-700)' }}>
              <span style={{ color: '#19C3A3', fontWeight: 'bold' }}>✓</span>
              <span><strong>Inflation Impacts Purchasing Power:</strong> Consider real returns net of inflation to ensure your future wealth meets your financial goals.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.95rem', color: 'var(--gray-700)' }}>
              <span style={{ color: '#19C3A3', fontWeight: 'bold' }}>✓</span>
              <span><strong>Past Performance Does Not Guarantee Future Results:</strong> Historical averages provide benchmarks but cannot guarantee exact future returns.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
