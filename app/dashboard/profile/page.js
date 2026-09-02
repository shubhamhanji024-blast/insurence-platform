'use client';
import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user, refetchUser } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  if (!user) return null;

  const userInitials = user.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'GN';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setFieldErrors({});

    const errors = {};
    const cleanName = fullName.trim();
    if (!cleanName) {
      errors.fullName = 'Full name is required.';
    } else if (cleanName.length < 2) {
      errors.fullName = 'Full name must be at least 2 characters.';
    }

    if (phone) {
      const numPhone = String(phone).replace(/[\s\-\(\)\+]/g, '');
      if (!/^\d{7,15}$/.test(numPhone)) {
        errors.phone = 'Please enter a valid phone number.';
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: cleanName, phone }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage('Profile updated successfully!');
        if (refetchUser) refetchUser();
      } else {
        setFieldErrors(data.errors || { general: data.message || 'Failed to update profile.' });
      }
    } catch {
      setFieldErrors({ general: 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      <div style={{ maxWidth: '640px' }}>
        <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.35rem', color: 'var(--primary-900)', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
          User Profile
        </h2>
        <p style={{ margin: '0 0 1.75rem', fontSize: '0.9rem', color: 'var(--gray-600)' }}>
          Manage your personal account details and registered contact information.
        </p>

        {/* Profile Info Header Card */}
        <div className="glass-card-static" style={{ padding: '1.75rem', background: '#ffffff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #101b3b 0%, #1e3a8a 100%)', color: '#19C3A3', fontWeight: 800, fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {userInitials}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--primary-900)', fontWeight: 700 }}>
              {user.fullName}
            </h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginTop: '0.15rem' }}>{user.email}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
              Member since {new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Edit Form Card */}
        <div className="glass-card" style={{ padding: '2rem', background: '#ffffff' }}>
          <h4 style={{ margin: '0 0 1.25rem', fontSize: '1.05rem', color: 'var(--primary-900)', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
            Edit Personal Details
          </h4>

          {successMessage && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              ✓ {successMessage}
            </div>
          )}

          {fieldErrors.general && (
            <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#e11d48', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              ⚠️ {fieldErrors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="profile-fullname">
                Full Name *
              </label>
              <input
                id="profile-fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`form-input ${fieldErrors.fullName ? 'is-invalid' : ''}`}
                placeholder="John Doe"
              />
              {fieldErrors.fullName && <p className="sip-error-msg">{fieldErrors.fullName}</p>}
            </div>

            {/* Email (Read-only) */}
            <div className="form-group">
              <label className="form-label" htmlFor="profile-email">
                Email Address (Read-only)
              </label>
              <input
                id="profile-email"
                type="email"
                value={user.email}
                disabled
                className="form-input"
                style={{ background: '#f8fafc', color: 'var(--gray-500)', cursor: 'not-allowed' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.2rem', display: 'block' }}>
                Contact support to request an email address change.
              </span>
            </div>

            {/* Phone Number */}
            <div className="form-group" style={{ marginBottom: '1.75rem' }}>
              <label className="form-label" htmlFor="profile-phone">
                Phone Number
              </label>
              <input
                id="profile-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`form-input ${fieldErrors.phone ? 'is-invalid' : ''}`}
                placeholder="Mobile number"
              />
              {fieldErrors.phone && <p className="sip-error-msg">{fieldErrors.phone}</p>}
            </div>

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
