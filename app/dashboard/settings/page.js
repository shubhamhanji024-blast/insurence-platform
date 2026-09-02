'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { checkPasswordStrength } from '@/lib/authUtils';

export default function SettingsPage() {
  const { logout } = useAuth();
  const router = useRouter();

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({});

  const strength = checkPasswordStrength(newPassword);

  // Delete Account modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordErrors({});

    const errors = {};
    if (!currentPassword) errors.currentPassword = 'Current password is required.';
    if (!newPassword) errors.newPassword = 'New password is required.';
    else if (newPassword.length < 8) errors.newPassword = 'New password must be at least 8 characters.';
    else if (!strength.isStrongEnough) errors.newPassword = 'Must contain uppercase, lowercase, and numbers.';

    if (newPassword !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setIsChangingPassword(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setPasswordSuccess('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordErrors(data.errors || { general: data.message || 'Failed to change password.' });
      }
    } catch {
      setPasswordErrors({ general: 'An unexpected error occurred.' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteError('');

    if (confirmText !== 'DELETE') {
      setDeleteError('Please type "DELETE" to confirm.');
      return;
    }

    setIsDeletingAccount(true);

    try {
      const res = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmText }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setDeleteModalOpen(false);
        if (logout) logout();
        router.push('/login');
      } else {
        setDeleteError(data.message || 'Failed to delete account.');
      }
    } catch {
      setDeleteError('An unexpected error occurred.');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <DashboardLayout>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      <div style={{ maxWidth: '680px' }}>
        <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.35rem', color: 'var(--primary-900)', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
          Account Settings
        </h2>
        <p style={{ margin: '0 0 1.75rem', fontSize: '0.9rem', color: 'var(--gray-600)' }}>
          Manage your password, security preferences, and account controls.
        </p>

        {/* Change Password Card */}
        <div className="glass-card" style={{ padding: '2rem', background: '#ffffff', marginBottom: '2rem' }}>
          <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.15rem', color: 'var(--primary-900)', fontWeight: 700 }}>
            🔒 Change Password
          </h3>
          <p style={{ margin: '0 0 1.25rem', fontSize: '0.85rem', color: 'var(--gray-500)' }}>
            Ensure your account uses a strong, unique password.
          </p>

          {passwordSuccess && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              ✓ {passwordSuccess}
            </div>
          )}

          {passwordErrors.general && (
            <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#e11d48', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              ⚠️ {passwordErrors.general}
            </div>
          )}

          <form onSubmit={handleChangePassword} noValidate>
            {/* Current Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="current-pass">
                Current Password *
              </label>
              <input
                id="current-pass"
                type={showPasswords ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`form-input ${passwordErrors.currentPassword ? 'is-invalid' : ''}`}
                placeholder="Enter current password"
              />
              {passwordErrors.currentPassword && <p className="sip-error-msg">{passwordErrors.currentPassword}</p>}
            </div>

            {/* New Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="new-pass">
                New Password *
              </label>
              <input
                id="new-pass"
                type={showPasswords ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`form-input ${passwordErrors.newPassword ? 'is-invalid' : ''}`}
                placeholder="Min 8 chars with upper, lower & number"
              />
              {newPassword && (
                <div style={{ marginTop: '0.4rem', fontSize: '0.78rem', color: strength.isStrongEnough ? '#16a34a' : '#d97706' }}>
                  Strength: <strong>{strength.label}</strong>
                </div>
              )}
              {passwordErrors.newPassword && <p className="sip-error-msg">{passwordErrors.newPassword}</p>}
            </div>

            {/* Confirm New Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="confirm-pass">
                Confirm New Password *
              </label>
              <input
                id="confirm-pass"
                type={showPasswords ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`form-input ${passwordErrors.confirmPassword ? 'is-invalid' : ''}`}
                placeholder="Re-enter new password"
              />
              {passwordErrors.confirmPassword && <p className="sip-error-msg">{passwordErrors.confirmPassword}</p>}
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--gray-700)' }}>
                <input
                  type="checkbox"
                  checked={showPasswords}
                  onChange={(e) => setShowPasswords(e.target.checked)}
                  style={{ accentColor: '#101b3b' }}
                />
                Show passwords
              </label>
            </div>

            <button type="submit" className="btn btn-primary" disabled={isChangingPassword}>
              {isChangingPassword ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Delete Account Card */}
        <div className="glass-card-static" style={{ padding: '1.75rem', background: '#fff1f2', border: '1px solid #fecdd3' }}>
          <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.15rem', color: '#e11d48', fontWeight: 700 }}>
            ⚠️ Danger Zone: Delete Account
          </h3>
          <p style={{ margin: '0 0 1.25rem', fontSize: '0.85rem', color: '#9f1239', lineHeight: 1.5 }}>
            Permanently delete your GrowthNest account, saved calculations, and financial goals. This action cannot be undone.
          </p>

          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="btn btn-primary"
            style={{ background: '#e11d48', borderColor: '#e11d48' }}
          >
            🗑️ Delete Account
          </button>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {deleteModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-card text-center" style={{ background: '#ffffff', maxWidth: '440px', width: '100%', padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚠️</div>
            <h3 style={{ color: '#e11d48', margin: '0 0 0.5rem' }}>Permanently Delete Account?</h3>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.88rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              All your saved goals, calculation history, and profile data will be permanently removed.
            </p>

            <form onSubmit={handleDeleteAccount} noValidate>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label text-center" htmlFor="confirm-del-text" style={{ fontSize: '0.82rem' }}>
                  Type <strong>DELETE</strong> to confirm:
                </label>
                <input
                  id="confirm-del-text"
                  type="text"
                  value={confirmText}
                  onChange={(e) => {
                    setConfirmText(e.target.value);
                    if (deleteError) setDeleteError('');
                  }}
                  className="form-input text-center"
                  placeholder="DELETE"
                />
                {deleteError && <p className="sip-error-msg">{deleteError}</p>}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={() => setDeleteModalOpen(false)} className="btn btn-outline w-full">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  style={{ background: '#e11d48', borderColor: '#e11d48' }}
                  disabled={isDeletingAccount}
                >
                  {isDeletingAccount ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
