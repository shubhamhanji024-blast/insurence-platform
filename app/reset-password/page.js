'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { checkPasswordStrength } from '@/lib/authUtils';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const strength = checkPasswordStrength(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token || !email) {
      setError('Invalid or missing password reset link parameters.');
      return;
    }

    if (!newPassword) {
      setError('Please enter a new password.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!strength.isStrongEnough) {
      setError('Password must contain uppercase, lowercase, and numbers.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword, confirmPassword }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSuccess(true);
      } else {
        setError(data.message || 'Failed to reset password. The link may have expired.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '2.5rem', background: '#ffffff' }}>
      {isSuccess ? (
        <div className="text-center">
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            ✓
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--primary-900)' }}>
            Password Reset Complete!
          </h3>
          <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            Your password has been updated successfully. You can now log in using your new credentials.
          </p>
          <Link href="/login" className="btn btn-primary w-full">
            Sign In Now →
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

          {/* New Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="reset-newpassword">
              New Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="reset-newpassword"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (error) setError('');
                }}
                className="form-input"
                placeholder="Min 8 chars with upper, lower & numbers"
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

            {newPassword && (
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: 'var(--gray-600)' }}>Strength:</span>
                  <strong
                    style={{
                      color:
                        strength.label === 'Strong'
                          ? '#16a34a'
                          : strength.label === 'Medium'
                          ? '#d97706'
                          : '#e11d48',
                    }}
                  >
                    {strength.label}
                  </strong>
                </div>
                <div style={{ height: '5px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${(strength.score / 5) * 100}%`,
                      background:
                        strength.label === 'Strong'
                          ? '#16a34a'
                          : strength.label === 'Medium'
                          ? '#d97706'
                          : '#e11d48',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" htmlFor="reset-confirmpassword">
              Confirm New Password
            </label>
            <input
              id="reset-confirmpassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError('');
              }}
              className="form-input"
              placeholder="Re-enter new password"
              aria-required="true"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSubmitting}
            style={{ padding: '0.85rem', fontSize: '1rem', fontWeight: 700 }}
          >
            {isSubmitting ? 'Updating Password...' : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <section className="page-hero" style={{ padding: '3.5rem 0 2.5rem' }}>
        <div className="container text-center">
          <span className="hero-badge">ACCOUNT RECOVERY</span>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.75rem', color: '#ffffff' }}>
            Set New Password
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', maxWidth: '480px', margin: '0 auto' }}>
            Enter a strong new password to secure your GrowthNest account.
          </p>
        </div>
      </section>

      <section className="section bg-gray-50" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        <div className="container" style={{ maxWidth: '480px' }}>
          <Suspense fallback={<div className="glass-card text-center" style={{ padding: '2.5rem', color: 'var(--gray-500)' }}>Loading reset form...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
