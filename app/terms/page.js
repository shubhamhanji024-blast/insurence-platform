import Link from 'next/link';

export default function TermsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="hero-badge">Legal</span>
          <h1>Terms of Service</h1>
          <p>Last updated: August 2026</p>
        </div>
      </section>

      <section className="section bg-gray-50">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="glass-card" style={{ padding: '2.5rem', background: '#fff', color: 'var(--gray-700)', lineHeight: 1.8 }}>
            <h2 style={{ color: 'var(--primary-900)', fontSize: '1.4rem', marginBottom: '1rem' }}>1. Acceptance of Terms</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              By accessing and using the GrowthNest website, tools, and services, you agree to comply with and be bound by these Terms of Service.
            </p>

            <h2 style={{ color: 'var(--primary-900)', fontSize: '1.4rem', marginBottom: '1rem' }}>2. Advisory Services</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              GrowthNest operates as a SEBI-registered advisory entity. All recommendations are prepared in good faith based on user-provided financial goals and market analysis.
            </p>

            <h2 style={{ color: 'var(--primary-900)', fontSize: '1.4rem', marginBottom: '1rem' }}>3. User Obligations</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              Users agree to provide accurate and updated information required for financial planning assessments and maintain account credential confidentiality.
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
