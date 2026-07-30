'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'Join as Advisor', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => { setIsSubmitting(false); setIsSuccess(true); }, 1500);
  };

  if (isSuccess) {
    return (
      <section className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container text-center">
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem', animation: 'float 2s ease-in-out infinite' }}>✅</div>
          <h2 style={{ marginBottom: '1rem' }}>Message <span className="text-gradient">Received!</span></h2>
          <p style={{ maxWidth: '480px', margin: '0 auto 1.5rem', color: 'var(--text-secondary)' }}>
            Thank you, <strong>{form.name}</strong>! We'll get back to you within <strong>24 hours</strong>.
          </p>
          <Link href="/" className="btn btn-primary">← Back to Home</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="contact-hero">
        <div className="contact-hero-bg" />
        <div className="container text-center">
          <span className="label">Get In Touch</span>
          <h1 style={{ marginTop: '1rem', marginBottom: '0.75rem' }}>
            We're Here to <span className="text-gradient">Help You</span>
          </h1>
          <p style={{ maxWidth: '500px', margin: '0 auto', color: 'var(--text-secondary)' }}>
            Have a question, a partnership idea, or just want to know more? Reach out to us.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-layout">
            {/* Info Panel */}
            <div className="contact-info">
              <h3 style={{ marginBottom: '1.5rem' }}>Contact Information</h3>
              {[
                { icon: '📞', label: 'Call Us', value: '+91 98765 43210', sub: 'Mon–Sat, 9 AM – 7 PM' },
                { icon: '📧', label: 'Email Us', value: 'support@growthnest.in', sub: 'We reply within 24 hours' },
                { icon: '💬', label: 'WhatsApp', value: '+91 98765 43210', sub: 'Quick support for advisors' },
                { icon: '🏢', label: 'Head Office', value: '4th Floor, Sunrise Tower, Mumbai – 400001', sub: 'Maharashtra, India' },
              ].map((c, i) => (
                <div key={i} className="contact-info-item">
                  <div className="contact-info-icon">{c.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{c.label}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '2px' }}>{c.value}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.sub}</div>
                  </div>
                </div>
              ))}

              {/* Office Hours */}
              <div className="contact-hours">
                <h5 style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Office Hours</h5>
                {[
                  { day: 'Monday – Friday', time: '9:00 AM – 7:00 PM' },
                  { day: 'Saturday', time: '10:00 AM – 5:00 PM' },
                  { day: 'Sunday', time: 'Closed' },
                ].map((h, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.83rem', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{h.day}</span>
                    <span style={{ color: h.time === 'Closed' ? 'var(--text-muted)' : 'var(--primary)', fontWeight: 500 }}>{h.time}</span>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div style={{ marginTop: '1.5rem' }}>
                <h5 style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Follow Us</h5>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['LinkedIn', 'Instagram', 'YouTube', 'Facebook'].map((s, i) => (
                    <a key={i} href="#" className="social-btn">
                      {s === 'LinkedIn' ? '💼' : s === 'Instagram' ? '📷' : s === 'YouTube' ? '▶️' : '👍'}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="glass-card contact-form-card">
              <h3 style={{ marginBottom: '0.5rem' }}>Send Us a Message</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Fill in the form and we'll reach out within 24 hours.</p>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required className="form-input" placeholder="Your name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required className="form-input" placeholder="you@email.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input name="phone" type="tel" value={form.phone} onChange={handleChange} className="form-input" placeholder="10-digit number" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject *</label>
                    <select name="subject" value={form.subject} onChange={handleChange} className="form-select" required>
                      <option value="Join as Advisor">Join as Advisor</option>
                      <option value="Career Enquiry">Career Enquiry</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Your Message *</label>
                    <textarea name="message" value={form.message} onChange={handleChange} required className="form-input" rows={5} placeholder="Tell us how we can help you…" style={{ resize: 'vertical' }} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={isSubmitting}>
                  {isSubmitting ? '⏳ Sending…' : '📤 Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .contact-hero {
          padding: calc(var(--nav-height) + 3rem) 0 3rem;
          position: relative; overflow: hidden;
          background: var(--bg-secondary); border-bottom: 1px solid var(--border-glass);
        }
        .contact-hero-bg {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(0,212,170,0.06), transparent 60%);
        }
        .contact-layout {
          display: grid; grid-template-columns: 380px 1fr; gap: 4rem; align-items: start;
        }
        .contact-info { display: flex; flex-direction: column; gap: 1.25rem; }
        .contact-info-item {
          display: flex; gap: 0.875rem; align-items: flex-start;
          padding: 0.875rem; background: var(--bg-card); border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
        }
        .contact-info-icon {
          width: 40px; height: 40px; background: var(--bg-tertiary);
          border-radius: var(--radius-sm); display: flex; align-items: center;
          justify-content: center; font-size: 1.2rem; flex-shrink: 0;
        }
        .contact-hours {
          padding: 1rem; background: var(--bg-tertiary);
          border-radius: var(--radius-md); border: 1px solid var(--border-glass);
        }
        .contact-form-card { padding: 2.5rem; }
        .social-btn {
          width: 36px; height: 36px; background: var(--bg-tertiary);
          border: 1px solid var(--border-glass); border-radius: var(--radius-sm);
          display: flex; align-items: center; justify-content: center;
          text-decoration: none; font-size: 1rem; transition: all 0.2s;
        }
        .social-btn:hover { border-color: var(--primary); background: rgba(0,212,170,0.08); }
        @media (max-width: 900px) {
          .contact-layout { grid-template-columns: 1fr; gap: 2.5rem; }
        }
        @media (max-width: 600px) {
          .contact-form-card { padding: 1.5rem; }
        }
      `}</style>
    </>
  );
}
