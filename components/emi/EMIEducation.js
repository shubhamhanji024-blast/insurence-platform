import Link from 'next/link';

export default function EMIEducation() {
  return (
    <div className="sip-education-section">
      <div className="glass-card-static" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <span className="section-label">Educational Guide</span>
        <h2 className="section-title" style={{ textAlign: 'left', fontSize: '1.75rem' }}>
          What is Equated Monthly Instalment (EMI)?
        </h2>
        <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, fontSize: '1rem', marginBottom: '2rem' }}>
          EMI, or Equated Monthly Instalment, is the fixed payment amount made by a borrower to a lender on a specified date each calendar month. Every EMI comprises both a principal repayment portion and an interest component. In the initial years of a loan, a larger share of the EMI goes toward interest; over time, the principal repayment share grows.
        </p>

        <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--primary-900)' }}>
          How is EMI calculated in 4 steps?
        </h3>

        <div className="process-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div className="process-card" style={{ padding: '1.5rem' }}>
            <div className="process-number">01</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Principal Amount</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0 }}>
              The initial sum borrowed from the bank or financial institution is taken as the loan principal (P).
            </p>
          </div>

          <div className="process-card" style={{ padding: '1.5rem' }}>
            <div className="process-number">02</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Monthly Rate</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0 }}>
              The annual interest rate is divided by 12 and converted into a monthly interest percentage rate (r).
            </p>
          </div>

          <div className="process-card" style={{ padding: '1.5rem' }}>
            <div className="process-number">03</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Tenure in Months</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0 }}>
              The overall loan duration in years is converted into the total number of monthly payment cycles (n).
            </p>
          </div>

          <div className="process-card" style={{ padding: '1.5rem' }}>
            <div className="process-number">04</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Amortization Formula</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: 0 }}>
              The reducing-balance formula <code>EMI = P × r × (1+r)^n / ((1+r)^n - 1)</code> computes the fixed monthly outflow.
            </p>
          </div>
        </div>

        {/* Before Taking a Loan Tips */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-xl)', padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-900)' }}>
            💡 Smart Tips Before Taking a Loan
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.95rem', color: 'var(--gray-700)' }}>
              <span style={{ color: '#19C3A3', fontWeight: 'bold' }}>✓</span>
              <span><strong>Compare Interest Rates:</strong> A difference of even 0.5% in interest rates can save lakhs in total interest over long tenures.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.95rem', color: 'var(--gray-700)' }}>
              <span style={{ color: '#19C3A3', fontWeight: 'bold' }}>✓</span>
              <span><strong>Choose an Affordable Tenure:</strong> Select a repayment tenure where the monthly EMI does not exceed 40% of your net monthly income.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.95rem', color: 'var(--gray-700)' }}>
              <span style={{ color: '#19C3A3', fontWeight: 'bold' }}>✓</span>
              <span><strong>Look Beyond Monthly EMI:</strong> Always check the Total Interest Payable and total loan outflow before finalizing loan terms.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
