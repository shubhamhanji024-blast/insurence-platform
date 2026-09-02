import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="hero-badge">Legal</span>
          <h1>Privacy Policy</h1>
          <p>Last updated: August 2026</p>
        </div>
      </section>

      <section className="section bg-gray-50">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="glass-card" style={{ padding: '2.5rem', background: '#fff', color: 'var(--gray-700)', lineHeight: 1.8 }}>
            <h2 style={{ color: 'var(--primary-900)', fontSize: '1.4rem', marginBottom: '1rem' }}>1. Information We Collect</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              GrowthNest collects personal information such as name, contact details, financial goals, and portfolio details provided voluntarily when you register, request financial advice, or interact with our platform.
            </p>

            <h2 style={{ color: 'var(--primary-900)', fontSize: '1.4rem', marginBottom: '1rem' }}>2. How We Use Your Information</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              We use your information solely to deliver personalized financial planning services, process requested transactions, send account notifications, and ensure SEBI regulatory compliance. We never sell your personal data to third parties.
            </p>

            <h2 style={{ color: 'var(--primary-900)', fontSize: '1.4rem', marginBottom: '1rem' }}>3. Data Protection &amp; Security</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              We employ bank-grade SSL encryption and security protocols to safeguard your financial data against unauthorized access, loss, or alteration.
            </p>

            <h2 style={{ color: 'var(--primary-900)', fontSize: '1.4rem', marginBottom: '1rem' }}>4. Contact Us</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              If you have questions about this Privacy Policy, please email us at <a href="mailto:privacy@growthnest.com" style={{ color: 'var(--primary-700)', fontWeight: 600 }}>privacy@growthnest.com</a>.
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
