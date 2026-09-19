'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const { refetchUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get('redirectTo') || searchParams.get('redirect');
  const redirectTo =
    rawRedirect && rawRedirect !== '/' && rawRedirect !== '/login' && rawRedirect !== '/admin/login'
      ? rawRedirect
      : '/admin/dashboard';

  const validate = () => {
    const errs = {};
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      errs.email = 'Please enter your administrator email.';
    }
    if (!password) {
      errs.password = 'Please enter your administrative password.';
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
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (refetchUser) await refetchUser();
        router.replace(redirectTo);
      } else {
        setServerError(data.message || 'Invalid administrator credentials.');
      }
    } catch (err) {
      console.error('[Admin Login Submit Error]:', err);
      setServerError('Unable to connect to administration server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '2.5rem',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(212, 175, 55, 0.25)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #d4af37 0%, #f0cc60 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            marginBottom: '1rem',
            boxShadow: '0 8px 16px rgba(212,175,55,0.3)',
          }}
        >
          🌱
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', color: '#101b3b', margin: '0 0 0.4rem' }}>
          Admin Console Login
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.88rem', margin: 0 }}>
          Authorized personnel only. All access attempts are logged.
        </p>
      </div>

      {serverError && (
        <div
          role="alert"
          style={{
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            color: '#e11d48',
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span>⚠️</span>
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Email */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label
            htmlFor="admin-email"
            style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}
          >
            Admin Email Address
          </label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
              if (serverError) setServerError('');
            }}
            placeholder="admin@growthnest.com"
            autoComplete="email"
            style={{
              width: '100%',
              padding: '0.8rem 1rem',
              borderRadius: '8px',
              border: `1px solid ${fieldErrors.email ? '#e11d48' : '#d1d5db'}`,
              fontSize: '0.95rem',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
          />
          {fieldErrors.email && (
            <p style={{ color: '#e11d48', fontSize: '0.78rem', marginTop: '0.3rem', margin: '0.3rem 0 0' }}>
              {fieldErrors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label
            htmlFor="admin-password"
            style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}
          >
            Master Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
                if (serverError) setServerError('');
              }}
              placeholder="Enter admin password"
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '0.8rem 2.8rem 0.8rem 1rem',
                borderRadius: '8px',
                border: `1px solid ${fieldErrors.password ? '#e11d48' : '#d1d5db'}`,
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6b7280',
                fontSize: '0.85rem',
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {fieldErrors.password && (
            <p style={{ color: '#e11d48', fontSize: '0.78rem', marginTop: '0.3rem', margin: '0.3rem 0 0' }}>
              {fieldErrors.password}
            </p>
          )}
        </div>

        {/* Remember */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.82rem', color: '#4b5563' }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: '#101b3b' }}
            />
            Keep active session for 30 days
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '0.9rem',
            background: 'linear-gradient(135deg, #101b3b 0%, #1e3a8a 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(16,27,59,0.3)',
            transition: 'opacity 0.2s',
            opacity: isSubmitting ? 0.75 : 1,
          }}
        >
          {isSubmitting ? 'Verifying Credentials...' : 'Sign In to Admin Console'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9', fontSize: '0.85rem' }}>
        <Link href="/" style={{ color: '#6b7280', textDecoration: 'none' }}>
          ← Back to GrowthNest Platform
        </Link>
      </div>
    </div>
  );
}

function AdminRedirectWatcher() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get('redirectTo') || searchParams.get('redirect');
  const target =
    rawRedirect && rawRedirect !== '/' && rawRedirect !== '/login' && rawRedirect !== '/admin/login'
      ? rawRedirect
      : '/admin/dashboard';

  useEffect(() => {
    if (!loading && user && user.role === 'ADMIN') {
      router.replace(target);
    }
  }, [user, loading, router, target]);

  return null;
}

export default function AdminLoginPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d1628' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 44, height: 44, border: '4px solid #d4af37', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Checking administration privileges...</p>
        </div>
      </div>
    );
  }

  if (user && user.role === 'ADMIN') {
    return (
      <Suspense fallback={null}>
        <AdminRedirectWatcher />
      </Suspense>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at top, #1a294d 0%, #0d1628 70%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}
    >
      <Suspense fallback={null}>
        <AdminRedirectWatcher />
      </Suspense>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <Suspense fallback={<div style={{ color: '#fff', textAlign: 'center' }}>Loading admin console...</div>}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
