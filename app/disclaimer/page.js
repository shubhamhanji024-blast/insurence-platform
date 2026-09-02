import Link from 'next/link';

export default function DisclaimerPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="hero-badge">Regulatory</span>
          <h1>SEBI Statutory Disclaimer</h1>
          <p>Important regulatory disclosure for investors and clients</p>
        </div>
      </section>

      <section className="section bg-gray-50">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="glass-card" style={{ padding: '2.5rem', background: '#fff', color: 'var(--gray-700)', lineHeight: 1.8 }}>
            <h2 style={{ color: 'var(--primary-900)', fontSize: '1.4rem', marginBottom: '1rem' }}>Market Risk Disclosure</h2>
            <p style={{ marginBottom: '1.5rem', fontStyle: 'italic', background: '#fef9c3', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid #d4af37' }}>
              <strong>&ldquo;Investments in securities market are subject to market risks. Read all the related documents carefully before investing.&rdquo;</strong>
            </p>

            <h2 style={{ color: 'var(--primary-900)', fontSize: '1.4rem', marginBottom: '1rem' }}>Registration Details</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              GrowthNest is a registered Investment Advisor with Securities and Exchange Board of India (SEBI). Registration granted by SEBI, membership of BASL and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors.
            </p>

            <h2 style={{ color: 'var(--primary-900)', fontSize: '1.4rem', marginBottom: '1rem' }}>No Guaranteed Returns</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              Past performance of instruments or portfolios does not indicate future results. GrowthNest does not offer any guaranteed return products or speculative trading tips.
            </p>

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--gray-200)' }}>
              <Link href="/" style={{ color: 'var(--primary-700)', fontWeight: 600 }}>← Return to Home</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
