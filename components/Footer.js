import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <Logo href="/" />
            <p style={{ marginTop: '1rem' }}>
              Helping you grow, plan, and build a stronger financial future.
            </p>
            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              {[
                {
                  label: 'LinkedIn',
                  href: 'https://linkedin.com',
                  icon: <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />,
                },
                {
                  label: 'Twitter',
                  href: 'https://twitter.com',
                  icon: <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />,
                },
                {
                  label: 'YouTube',
                  href: 'https://youtube.com',
                  icon: <><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" /></>,
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,0.6)', transition: 'all 0.3s',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {s.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="footer-heading">Services</p>
            <ul className="footer-links">
              <li><Link href="/services/stock-analysis">Stock Analysis</Link></li>
              <li><Link href="/services/investment-planning">Investment Planning</Link></li>
              <li><Link href="/services/retirement-planning">Retirement Planning</Link></li>
              <li><Link href="/services/insurance">Insurance Advisory</Link></li>
              <li><Link href="/services/tax-planning">Tax Planning</Link></li>
              <li><Link href="/services/mutual-funds">Mutual Funds</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="footer-heading">Company</p>
            <ul className="footer-links">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/blog">Blog &amp; Insights</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/partners">Our Partners</Link></li>
              <li><Link href="/events">Events</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="footer-heading">Resources</p>
            <ul className="footer-links">
              <li><Link href="/calculators">Calculators</Link></li>
              <li><Link href="/dashboard">Dashboard Login</Link></li>
              <li><Link href="/training">Training Center</Link></li>
              <li><Link href="/faq">FAQs</Link></li>
              <li><Link href="/success-stories">Success Stories</Link></li>
            </ul>

            {/* Contact Info */}
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a
                href="https://wa.me/919876543210"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                WhatsApp Us
              </a>
              <a
                href="mailto:hello@growthnest.com"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                hello@growthnest.com
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {year} GrowthNest. All rights reserved. SEBI Registered Investment Advisor.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Link href="/privacy-policy" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }}>Terms of Service</Link>
            <Link href="/disclaimer" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }}>Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
