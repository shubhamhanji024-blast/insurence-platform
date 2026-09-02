import Link from 'next/link';

export default function SIPEducation() {
  return (
    <div className="sip-education-section">
      <div className="glass-card-static" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <span className="section-label">Educational Guide</span>
        <h2 className="section-title" style={{ textAlign: 'left', fontSize: '1.75rem' }}>
          What is a Systematic Investment Plan (SIP)?
        </h2>
        <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, fontSize: '1rem', marginBottom: '2rem' }}>
          A Systematic Investment Plan (SIP) allows you to invest a fixed amount regularly into selected mutual funds. SIPs help investors build disciplined investing habits, benefit from rupee cost averaging, and participate in long-term wealth accumulation through the power of compounding.
        </p>

        <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--primary-900)' }}>
          How does a SIP work in 3 simple steps?
        </h3>

        <div className="process-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          <div className="process-card" style={{ padding: '1.5rem' }}>
            <div className="process-number">01</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Choose Investment Amount</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0 }}>
              Select an affordable monthly contribution starting from as low as ₹500/month based on your financial goals.
            </p>
          </div>

          <div className="process-card" style={{ padding: '1.5rem' }}>
            <div className="process-number">02</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Set Frequency &amp; Duration</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0 }}>
              Automate monthly auto-debits on a fixed date for your desired investment horizon (e.g. 5, 10, or 20 years).
            </p>
          </div>

          <div className="process-card" style={{ padding: '1.5rem' }}>
            <div className="process-number">03</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Compounding &amp; Growth</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0 }}>
              Sit back and stay invested. Your monthly contributions buy more units during market dips and grow exponentially over time.
            </p>
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link href="/contact" className="btn btn-primary btn-sm">
            Speak to a Wealth Advisor
          </Link>
          <Link href="/services/investment-planning" className="btn btn-outline btn-sm">
            Learn About Investment Planning
          </Link>
        </div>
      </div>
    </div>
  );
}
