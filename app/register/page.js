'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { checkPasswordStrength } from '@/lib/authUtils';

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register } = useAuth();
  const router = useRouter();

  const strength = checkPasswordStrength(form.password);

  const validate = () => {
    const errs = {};
    const cleanName = form.fullName.trim();
    const cleanEmail = form.email.trim();
    const cleanPhone = form.phone.trim();

    if (!cleanName) {
      errs.fullName = 'Please enter your full name.';
    } else if (cleanName.length < 2) {
      errs.fullName = 'Full name must contain at least 2 characters.';
    } else if (cleanName.length > 100) {
      errs.fullName = 'Full name cannot exceed 100 characters.';
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

    if (!form.password) {
      errs.password = 'Please enter a password.';
    } else if (form.password.length < 8) {
      errs.password = 'Password must be at least 8 characters long.';
    } else if (!strength.isStrongEnough) {
      errs.password = 'Password must contain uppercase, lowercase, and numbers.';
    }

    if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    if (!form.agreeTerms) {
      errs.agreeTerms = 'You must agree to the Terms of Service and Privacy Policy.';
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setForm((prev) => ({ ...prev, [name]: val }));
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
      const res = await register(form);
      if (res && res.success) {
        router.push('/dashboard');
      } else if (res && res.errors) {
        setErrors(res.errors);
        setServerError(res.message || 'Please fix the validation errors below.');
      } else {
        setServerError(res?.message || 'Failed to create account. Please try again.');
      }
    } catch (err) {
      console.error('[Register Page Submit Error]:', err);
      setServerError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="page-hero" style={{ padding: '3.5rem 0 2.5rem' }}>
        <div className="container text-center">
          <span className="hero-badge">GET STARTED</span>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.75rem', color: '#ffffff' }}>
            Create Your GrowthNest Account
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto' }}>
            Start organizing your financial goals and planning your future.
          </p>
        </div>
      </section>

      <section className="section bg-gray-50" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        <div className="container" style={{ maxWidth: '560px' }}>
          <div className="glass-card" style={{ padding: '2.5rem', background: '#ffffff' }}>
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
              {/* Full Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="register-fullname">
                  Full Name *
                </label>
                <input
                  id="register-fullname"
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleChange}
                  className={`form-input ${errors.fullName ? 'is-invalid' : ''}`}
                  placeholder="John Doe"
                  aria-required="true"
                  aria-describedby={errors.fullName ? 'fullname-error' : undefined}
                />
                {errors.fullName && (
                  <p id="fullname-error" className="sip-error-msg" style={{ marginTop: '0.35rem' }}>
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="form-group">
                <label className="form-label" htmlFor="register-email">
                  Email Address *
                </label>
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="john@example.com"
                  aria-required="true"
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="sip-error-msg" style={{ marginTop: '0.35rem' }}>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="form-group">
                <label className="form-label" htmlFor="register-phone">
                  Phone Number
                </label>
                <input
                  id="register-phone"
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

              {/* Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="register-password">
                  Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="register-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    className={`form-input ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="Min 8 chars with upper, lower & numbers"
                    style={{ paddingRight: '45px' }}
                    aria-required="true"
                    aria-describedby={errors.password ? 'password-error' : undefined}
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

                {/* Password Strength Indicator */}
                {form.password && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: 'var(--gray-600)' }}>Password Strength:</span>
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

                {errors.password && (
                  <p id="password-error" className="sip-error-msg" style={{ marginTop: '0.35rem' }}>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="register-confirmpassword">
                  Confirm Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="register-confirmpassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className={`form-input ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    placeholder="Re-enter password"
                    style={{ paddingRight: '45px' }}
                    aria-required="true"
                    aria-describedby={errors.confirmPassword ? 'confirmpassword-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
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
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p id="confirmpassword-error" className="sip-error-msg" style={{ marginTop: '0.35rem' }}>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--gray-700)', lineHeight: 1.5 }}>
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={form.agreeTerms}
                    onChange={handleChange}
                    style={{ marginTop: '0.2rem', accentColor: '#101b3b' }}
                  />
                  <span>
                    I agree to the <Link href="/terms" style={{ color: 'var(--primary-900)', textDecoration: 'underline' }}>Terms of Service</Link> and <Link href="/privacy-policy" style={{ color: 'var(--primary-900)', textDecoration: 'underline' }}>Privacy Policy</Link>. *
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="sip-error-msg" style={{ marginTop: '0.35rem' }}>
                    {errors.agreeTerms}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-secondary w-full"
                disabled={isSubmitting}
                style={{ padding: '0.85rem', fontSize: '1rem', fontWeight: 700 }}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9', fontSize: '0.9rem', color: 'var(--gray-600)' }}>
              Already have a GrowthNest account?{' '}
              <Link href="/login" style={{ color: 'var(--primary-900)', fontWeight: 700 }}>
                Sign In →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
