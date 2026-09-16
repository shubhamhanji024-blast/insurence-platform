'use client';
import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/context/AuthContext';

const serviceOptions = [
  'Financial Planning',
  'Investment Planning',
  'Wealth Management',
  'Retirement Planning',
  'Tax Planning',
  'Insurance Planning',
  'Calculator Support',
  'Account Issue',
  'General Enquiry',
  'Other',
];

export default function DashboardSupportPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    service: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.service) errs.service = 'Please select a service or topic.';
    if (!form.message.trim()) errs.message = 'Please enter your message.';
    else if (form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setErrors({});

    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user?.fullName || '',
          email: user?.email || '',
          phone: user?.phone || '',
          service: form.service,
          message: form.message.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setResult({ success: true, message: 'Your message has been sent successfully! Our team will get back to you within 24-48 hours.' });
        setForm({ service: '', message: '' });
      } else {
        setResult({ success: false, message: data.message || 'Failed to send message. Please try again.' });
      }
    } catch {
      setResult({ success: false, message: 'An unexpected error occurred. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-900)', margin: '0 0 0.5rem', fontFamily: "'Playfair Display', serif" }}>
          📞 Contact Support
        </h2>
        <p style={{ color: 'var(--gray-600)', fontSize: '0.92rem', margin: 0 }}>
          Need help? Send us a message and our team will respond within 24-48 hours.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Contact Form */}
        <div className="glass-card-static" style={{ padding: '2rem', background: '#ffffff' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)', margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ✉️ Send a Message
          </h3>

          {result?.success ? (
            <div className="text-center" style={{ padding: '2rem 0' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1rem' }}>✓</div>
              <h4 style={{ margin: '0 0 0.5rem', color: 'var(--primary-900)' }}>Message Sent!</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--gray-600)', marginBottom: '1.5rem' }}>{result.message}</p>
              <button
                type="button"
                onClick={() => setResult(null)}
                className="btn btn-outline"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {result && !result.success && (
                <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#e11d48', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  ⚠️ {result.message}
                </div>
              )}

              {/* Pre-filled user info */}
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <p style={{ margin: '0 0 0.2rem', fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</p>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.88rem', color: 'var(--primary-900)' }}>{user?.fullName || 'N/A'}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 0.2rem', fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</p>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.88rem', color: 'var(--primary-900)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Service Select */}
              <div className="form-group">
                <label className="form-label" htmlFor="support-service">Topic / Service *</label>
                <select
                  id="support-service"
                  value={form.service}
                  onChange={(e) => {
                    setForm({ ...form, service: e.target.value });
                    if (errors.service) setErrors({ ...errors, service: '' });
                  }}
                  className={`form-input ${errors.service ? 'is-invalid' : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="">Select a topic...</option>
                  {serviceOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {errors.service && <p className="sip-error-msg" style={{ marginTop: '0.35rem' }}>{errors.service}</p>}
              </div>

              {/* Message */}
              <div className="form-group">
                <label className="form-label" htmlFor="support-message">Your Message *</label>
                <textarea
                  id="support-message"
                  value={form.message}
                  onChange={(e) => {
                    setForm({ ...form, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: '' });
                  }}
                  className={`form-input ${errors.message ? 'is-invalid' : ''}`}
                  placeholder="Describe your question, concern, or what you need help with..."
                  rows={5}
                  style={{ resize: 'vertical' }}
                />
                {errors.message && <p className="sip-error-msg" style={{ marginTop: '0.35rem' }}>{errors.message}</p>}
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={submitting} style={{ padding: '0.85rem', fontSize: '0.95rem', fontWeight: 700 }}>
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-card-static" style={{ padding: '1.5rem', background: '#ffffff' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-900)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📍 Contact Information
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.1rem' }}>📧</span>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: '0.1rem' }}>Email</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-900)' }}>support@growthnest.com</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.1rem' }}>⏰</span>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: '0.1rem' }}>Response Time</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-900)' }}>Within 24-48 hours</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.1rem' }}>📅</span>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: '0.1rem' }}>Working Hours</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-900)' }}>Mon - Sat, 9:00 AM - 7:00 PM</div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card-static" style={{ padding: '1.5rem', background: '#ffffff' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-900)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              💡 Quick Links
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a href="/faq" style={{ fontSize: '0.88rem', color: 'var(--gray-700)', textDecoration: 'none', padding: '0.5rem 0.75rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', display: 'block', transition: 'background 0.2s' }}>
                📖 Frequently Asked Questions
              </a>
              <a href="/terms" style={{ fontSize: '0.88rem', color: 'var(--gray-700)', textDecoration: 'none', padding: '0.5rem 0.75rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', display: 'block', transition: 'background 0.2s' }}>
                📜 Terms of Service
              </a>
              <a href="/privacy-policy" style={{ fontSize: '0.88rem', color: 'var(--gray-700)', textDecoration: 'none', padding: '0.5rem 0.75rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', display: 'block', transition: 'background 0.2s' }}>
                🔒 Privacy Policy
              </a>
              <a href="/disclaimer" style={{ fontSize: '0.88rem', color: 'var(--gray-700)', textDecoration: 'none', padding: '0.5rem 0.75rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', display: 'block', transition: 'background 0.2s' }}>
                ⚖️ Disclaimer
              </a>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
