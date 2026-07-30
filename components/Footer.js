'use client';
import Link from 'next/link';

const footerLinks = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Success Stories', href: '/success-stories' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
  services: [
    { label: 'Become an Advisor', href: '/become-advisor' },
    { label: 'Insurance Partners', href: '/partners' },
    { label: 'Training Portal', href: '/training' },
    { label: 'Income Calculator', href: '/calculator' },
    { label: 'Events', href: '/events' },
  ],
  support: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Refund Policy', href: '#' },
  ],
};

export default function Footer() {
  return (
    <>
      {/* Social Proof Strip above footer */}
      <div className="social-proof-strip">
        <div className="container">
          <div className="social-proof-items">
            <div className="social-proof-item">
              <span style={{ fontSize: '1.6rem' }}>👥</span>
              <div>
                <div className="sp-num">5,000+</div>
                <div className="sp-label">Active Advisors</div>
              </div>
            </div>
            <div className="sp-divider" />
            <div className="social-proof-item">
              <span style={{ fontSize: '1.6rem' }}>🏢</span>
              <div>
                <div className="sp-num">20+</div>
                <div className="sp-label">Insurance Partners</div>
              </div>
            </div>
            <div className="sp-divider" />
            <div className="social-proof-item">
              <span style={{ fontSize: '1.6rem' }}>💰</span>
              <div>
                <div className="sp-num">₹50Cr+</div>
                <div className="sp-label">Business Generated</div>
              </div>
            </div>
            <div className="sp-divider" />
            <div className="social-proof-item">
              <span style={{ fontSize: '1.6rem' }}>📅</span>
              <div>
                <div className="sp-num">10+</div>
                <div className="sp-label">Years of Excellence</div>
              </div>
            </div>
            <div className="sp-divider" />
            <div className="social-proof-item">
              <span style={{ fontSize: '1.6rem' }}>⭐</span>
              <div>
                <div className="sp-num">4.9/5</div>
                <div className="sp-label">Advisor Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer" id="footer">
        <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              <span className="logo-icon">🌱</span>
              <span className="logo-text">Growth<span className="text-accent">Nest</span></span>
            </Link>
            <p className="footer-desc">
              Empowering insurance advisors across India with world-class training, technology, and support to build successful careers.
            </p>
            <div className="footer-social">
              <a href="#" className="social-icon" aria-label="Facebook" id="social-fb">📘</a>
              <a href="#" className="social-icon" aria-label="Instagram" id="social-ig">📷</a>
              <a href="#" className="social-icon" aria-label="LinkedIn" id="social-li">💼</a>
              <a href="#" className="social-icon" aria-label="YouTube" id="social-yt">▶️</a>
              <a href="#" className="social-icon" aria-label="Twitter" id="social-tw">🐦</a>
            </div>
          </div>

          {/* Company Links */}
          <div className="footer-column">
            <h4 className="footer-heading">Company</h4>
            {footerLinks.company.map(link => (
              <Link key={link.href + link.label} href={link.href} className="footer-link">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Services Links */}
          <div className="footer-column">
            <h4 className="footer-heading">Services</h4>
            {footerLinks.services.map(link => (
              <Link key={link.href + link.label} href={link.href} className="footer-link">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Contact Info */}
          <div className="footer-column">
            <h4 className="footer-heading">Contact</h4>
            <div className="footer-contact">
              <p>📍 123, Business Tower, Andheri West, Mumbai - 400053</p>
              <p>📞 +91 98765 43210</p>
              <p>✉️ info@growthnest.com</p>
              <p>⏰ Mon - Sat: 9 AM - 7 PM</p>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="footer-newsletter">
          <div className="newsletter-content">
            <h4>Subscribe to our Newsletter</h4>
            <p>Get the latest insurance tips, career advice, and industry updates.</p>
          </div>
          <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="newsletter-input"
              id="newsletter-email"
            />
            <button type="submit" className="btn btn-primary btn-sm" id="newsletter-submit">
              Subscribe
            </button>
          </form>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p>© 2026 GrowthNest. All rights reserved.</p>
          <p>IRDAI Registration: GN/CORP/2014/001</p>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-glass);
          padding-top: 4rem;
          margin-top: 4rem;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
          gap: 2.5rem;
          padding-bottom: 3rem;
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 800;
          text-decoration: none;
          color: var(--text-primary);
        }

        .logo-icon { font-size: 1.8rem; }

        .footer-desc {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.6;
        }

        .footer-social {
          display: flex;
          gap: 12px;
          margin-top: 0.5rem;
        }

        .social-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-glass);
          border-radius: 50%;
          font-size: 1.1rem;
          transition: all var(--transition-base);
          text-decoration: none;
        }

        .social-icon:hover {
          background: rgba(0, 212, 170, 0.15);
          border-color: var(--primary);
          transform: translateY(-3px);
        }

        .footer-column {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .footer-heading {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .footer-link {
          font-size: 0.9rem;
          color: var(--text-muted);
          text-decoration: none;
          transition: color var(--transition-base);
          padding: 2px 0;
        }

        .footer-link:hover {
          color: var(--primary);
        }

        .footer-contact p {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.8;
        }

        .footer-newsletter {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          padding: 2rem 0;
          border-top: 1px solid var(--border-glass);
          border-bottom: 1px solid var(--border-glass);
        }

        .newsletter-content h4 {
          font-size: 1.1rem;
          margin-bottom: 0.3rem;
        }

        .newsletter-content p {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .newsletter-form {
          display: flex;
          gap: 8px;
        }

        .newsletter-input {
          padding: 0.6rem 1rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-full);
          color: var(--text-primary);
          font-size: 0.9rem;
          min-width: 250px;
          transition: all var(--transition-base);
        }

        .newsletter-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--primary-glow);
          outline: none;
        }

        .newsletter-input::placeholder {
          color: var(--text-muted);
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 0;
        }

        .footer-bottom p {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .footer-newsletter {
            flex-direction: column;
            text-align: center;
          }
          .newsletter-form {
            flex-direction: column;
            width: 100%;
          }
          .newsletter-input {
            min-width: unset;
            width: 100%;
          }
          .footer-bottom {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }
        }
      `}</style>
    </footer>
    </>
  );
}
