'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json();
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="page-hero" style={{ padding: '3.5rem 0 2.5rem' }}>
        <div className="container text-center">
          <span className="hero-badge">ACCOUNT RECOVERY</span>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.75rem', color: '#ffffff' }}>
            Forgot Password
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', maxWidth: '480px', margin: '0 auto' }}>
            Enter your registered email address to receive password reset instructions.
          </p>
        </div>
      </section>

      <section className="section bg-gray-50" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        <div className="container" style={{ maxWidth: '480px' }}>
          <div className="glass-card" style={{ padding: '2.5rem', background: '#ffffff' }}>
            {submitted ? (
              <div className="text-center">
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  📩
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--primary-900)' }}>
                  Instructions Sent
                </h3>
                <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                  If an account exists for <strong>{email}</strong>, a password reset link has been sent. Please check your inbox and spam folder.
                </p>
                <Link href="/login" className="btn btn-outline w-full">
                  ← Back to Sign In
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {error && (
                  <div
                    role="alert"
                    aria-live="polite"
                    style={{
                      background: '#fff1f2',
                      border: '1px solid #fecdd3',
                      color: '#e11d48',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.88rem',
                      marginBottom: '1.25rem',
                    }}
                  >
                    ⚠️ {error}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" htmlFor="forgot-email">
                    Email Address
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    className="form-input"
                    placeholder="you@example.com"
                    aria-required="true"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isSubmitting}
                  style={{ padding: '0.85rem', fontSize: '1rem', fontWeight: 700 }}
                >
                  {isSubmitting ? 'Sending Request...' : 'Send Reset Link'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
                  <Link href="/login" style={{ color: 'var(--gray-600)' }}>
                    ← Remembered your password? Sign In
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
