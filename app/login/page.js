'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';
  const isVerified = searchParams.get('verified') === 'true';

  const validate = () => {
    const errs = {};
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      errs.email = 'Please enter your email address.';
    }
    if (!password) {
      errs.password = 'Please enter your password.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setFieldErrors({});

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await login(email, password, rememberMe);
      if (res && res.success) {
        router.push(redirectTo);
      } else {
        setServerError(res?.message || 'Invalid email or password.');
      }
    } catch (err) {
      console.error('[Login Submit Error]:', err);
      setServerError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '2.5rem', background: '#ffffff' }}>
      {isVerified && (
        <div
          style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#15803d',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.88rem',
            marginBottom: '1.5rem',
          }}
        >
          ✓ Email verified successfully! You can now log in.
        </div>
      )}

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
        {/* Email Address */}
        <div className="form-group">
          <label className="form-label" htmlFor="login-email">
            Email Address
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
              if (serverError) setServerError('');
            }}
            className={`form-input ${fieldErrors.email ? 'is-invalid' : ''}`}
            placeholder="you@example.com"
            autoComplete="email"
            aria-required="true"
          />
          {fieldErrors.email && (
            <p className="sip-error-msg" style={{ marginTop: '0.35rem' }}>
              {fieldErrors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label className="form-label" htmlFor="login-password" style={{ margin: 0 }}>
              Password
            </label>
            <Link
              href="/forgot-password"
              style={{ fontSize: '0.82rem', color: 'var(--primary-900)', textDecoration: 'underline' }}
            >
              Forgot Password?
            </Link>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
                if (serverError) setServerError('');
              }}
              className={`form-input ${fieldErrors.password ? 'is-invalid' : ''}`}
              placeholder="Enter your password"
              autoComplete="current-password"
              style={{ paddingRight: '45px' }}
              aria-required="true"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--gray-500)',
                fontSize: '0.85rem',
              }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="sip-error-msg" style={{ marginTop: '0.35rem' }}>
              {fieldErrors.password}
            </p>
          )}
        </div>

        {/* Remember Me Checkbox */}
        <div className="form-group" style={{ marginBottom: '1.75rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--gray-700)' }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: '#101b3b' }}
            />
            Remember me for 30 days
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSubmitting}
          style={{ padding: '0.85rem', fontSize: '1rem', fontWeight: 700 }}
        >
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9', fontSize: '0.9rem', color: 'var(--gray-600)' }}>
        Don&apos;t have an account?{' '}
        <Link href="/register" style={{ color: 'var(--primary-900)', fontWeight: 700 }}>
          Create One →
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <section className="page-hero" style={{ padding: '3.5rem 0 2.5rem' }}>
        <div className="container text-center">
          <span className="hero-badge">ACCOUNT ACCESS</span>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.75rem', color: '#ffffff' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', maxWidth: '480px', margin: '0 auto' }}>
            Sign in to continue to your GrowthNest account.
          </p>
        </div>
      </section>

      <section className="section bg-gray-50" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        <div className="container" style={{ maxWidth: '480px' }}>
          <Suspense fallback={<div className="glass-card text-center" style={{ padding: '2.5rem', color: 'var(--gray-500)' }}>Loading login form...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
