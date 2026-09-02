'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Financial Planning',
    message: '',
    website_hp: '', // Honeypot field
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const [enquiryId, setEnquiryId] = useState('');

  const servicesList = [
    'Financial Planning',
    'Investment Planning',
    'Retirement Planning',
    'Tax Planning',
    'Insurance Guidance',
    'General Enquiry',
    'Other',
  ];

  const validate = () => {
    const errs = {};
    const cleanName = form.name.trim();
    const cleanEmail = form.email.trim();
    const cleanPhone = form.phone.trim();
    const cleanMessage = form.message.trim();

    if (!cleanName) {
      errs.name = 'Please enter your full name.';
    } else if (cleanName.length < 2) {
      errs.name = 'Full name must contain at least 2 characters.';
    } else if (cleanName.length > 100) {
      errs.name = 'Full name cannot exceed 100 characters.';
    }

    if (!cleanEmail) {
      errs.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (cleanPhone) {
      const numericPhone = cleanPhone.replace(/[\s\-\(\)\+]/g, '');
      if (!/^\d{7,15}$/.test(numericPhone)) {
        errs.phone = 'Please enter a valid phone number.';
      }
    }

    if (!cleanMessage) {
      errs.message = 'Please enter your message.';
    } else if (cleanMessage.length < 10) {
      errs.message = 'Message must contain at least 10 characters.';
    } else if (cleanMessage.length > 2000) {
      errs.message = 'Message cannot exceed 2000 characters.';
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSuccess(true);
        setEnquiryId(data.data?.id || '');
        setForm({
          name: '',
          email: '',
          phone: '',
          service: 'Financial Planning',
          message: '',
          website_hp: '',
        });
        setErrors({});
      } else if (res.status === 400 && data.errors) {
        setErrors(data.errors);
        setServerError(data.message || 'Please check the submitted information.');
      } else {
        setServerError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('[Contact Submit Error]:', err);
      setServerError('Unable to submit your enquiry at the moment. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="section" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <div className="container text-center">
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 style={{ marginBottom: '1rem', color: 'var(--primary-900)' }}>
            Thank you! Your enquiry has been received.
          </h2>
          <p style={{ maxWidth: '480px', margin: '0 auto 1.5rem', color: 'var(--gray-600)', lineHeight: 1.6 }}>
            We have securely received your enquiry. Our senior financial advisor will review your message and get back to you soon.
          </p>

          {enquiryId && (
            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '2rem' }}>
              Reference ID: <code>{enquiryId}</code>
            </p>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => setIsSuccess(false)}
              className="btn btn-outline"
            >
              Send Another Enquiry
            </button>
            <Link href="/" className="btn btn-primary">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <span className="hero-badge">Get In Touch</span>
          <h1>Contact GrowthNest</h1>
          <p>
            Have a question about financial planning, investment strategies, or wealth management? Our expert team is here to help.
          </p>
        </div>
      </section>

      <section className="section bg-gray-50">
        <div className="container">
          <div className="split-grid" style={{ alignItems: 'start' }}>
            {/* Contact Info */}
            <div>
              <span className="section-label">Reach Out</span>
              <h2 className="section-title" style={{ textAlign: 'left' }}>We&apos;re Here to Help</h2>
              <p style={{ color: 'var(--gray-600)', marginBottom: '2rem', lineHeight: 1.7 }}>
                Schedule a consultation, ask a question, or visit our office. We look forward to connecting with you.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                {[
                  {
                    title: 'Email Us',
                    val: 'hello@growthnest.com',
                    sub: 'We reply within 24 hours',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    ),
                  },
                  {
                    title: 'Call Us',
                    val: '+91 98765 43210',
                    sub: 'Mon–Fri, 9:00 AM – 7:00 PM IST',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    ),
                  },
                  {
                    title: 'Office Location',
                    val: 'GrowthNest Tower, Bandra Kurla Complex',
                    sub: 'Mumbai, Maharashtra 400051',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    ),
                  },
                  {
                    title: 'Business Hours',
                    val: 'Monday – Saturday',
                    sub: '9:00 AM – 7:00 PM IST',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    ),
                  },
                ].map((item, i) => (
                  <div key={i} className="trust-item" style={{ background: '#fff' }}>
                    <div className="trust-icon">{item.icon}</div>
                    <div className="trust-text">
                      <h4>{item.title}</h4>
                      <p style={{ fontWeight: 600, color: 'var(--primary-900)', fontSize: '0.9rem' }}>{item.val}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Container */}
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary-900)' }}>Send Us a Message</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--gray-500)', marginBottom: '1.75rem' }}>
                Fill in the form below and our financial advisor will connect with you.
              </p>

              {serverError && (
                <div
                  role="alert"
                  aria-live="polite"
                  style={{
                    background: '#fff1f2',
                    border: '1px solid #fecdd3',
                    color: '#e11d48',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.88rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  ⚠️ {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Honeypot Spam Field (Hidden from human visitors) */}
                <div style={{ display: 'none' }} aria-hidden="true">
                  <label htmlFor="website_hp">Do not fill this field</label>
                  <input
                    id="website_hp"
                    name="website_hp"
                    type="text"
                    value={form.website_hp}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Full Name */}
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">
                    Full Name *
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    className={`form-input ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="Your full name"
                    aria-required="true"
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="sip-error-msg" style={{ marginTop: '0.35rem' }}>
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email & Phone Grid */}
                <div className="grid grid-2" style={{ gap: '1rem' }}>
                  {/* Email */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-email">
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className={`form-input ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="you@example.com"
                      aria-required="true"
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                      <p id="email-error" className="sip-error-msg" style={{ marginTop: '0.35rem' }}>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-phone">
                      Phone Number
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      className={`form-input ${errors.phone ? 'is-invalid' : ''}`}
                      placeholder="10-digit mobile number"
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                    />
                    {errors.phone && (
                      <p id="phone-error" className="sip-error-msg" style={{ marginTop: '0.35rem' }}>
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Service Interested In */}
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-service">
                    Service Interested In
                  </label>
                  <select
                    id="contact-service"
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className="form-select"
                  >
                    {servicesList.map((svc) => (
                      <option key={svc} value={svc}>
                        {svc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-message">
                    Your Message *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    className={`form-input ${errors.message ? 'is-invalid' : ''}`}
                    rows={4}
                    placeholder="Tell us about your financial goals or questions…"
                    style={{ resize: 'vertical' }}
                    aria-required="true"
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  />
                  {errors.message && (
                    <p id="message-error" className="sip-error-msg" style={{ marginTop: '0.35rem' }}>
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isSubmitting}
                  style={{ padding: '0.85rem' }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
