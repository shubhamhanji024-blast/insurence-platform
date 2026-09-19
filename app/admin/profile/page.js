'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Edit fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/profile');
      const json = await res.json();
      if (res.ok && json.success) {
        setProfile(json.data.profile);
        setFullName(json.data.profile.fullName || '');
        setPhone(json.data.profile.phone || '');
      } else {
        setError(json.message || 'Failed to fetch admin profile.');
      }
    } catch {
      setError('Unable to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const payload = { fullName, phone };
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          alert('New passwords do not match.');
          setSaveLoading(false);
          return;
        }
        if (!currentPassword) {
          alert('Please enter your current password to set a new password.');
          setSaveLoading(false);
          return;
        }
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast(json.message || 'Profile saved successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        fetchProfile();
      } else {
        alert(json.message || 'Failed to update profile.');
      }
    } catch {
      alert('Error updating profile.');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <AdminLayout title="Admin Profile & Security">
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#0f172a', color: '#fff', padding: '0.85rem 1.4rem', borderRadius: 10, zIndex: 1200, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <span>✓</span> {toastMessage}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
          <div style={{ width: 36, height: 36, border: '3px solid #d4af37', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          Loading admin profile credentials...
        </div>
      ) : error ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#ef4444', background: '#fff', borderRadius: 12 }}>
          <p style={{ fontWeight: 600 }}>{error}</p>
          <button onClick={fetchProfile} style={{ padding: '0.5rem 1rem', borderRadius: 6, background: '#101b3b', color: '#fff', border: 'none', cursor: 'pointer', marginTop: 8 }}>
            Retry
          </button>
        </div>
      ) : (
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          {/* Identity Header Card */}
          <div style={{ background: 'linear-gradient(135deg, #0b1329 0%, #162447 100%)', borderRadius: 16, padding: '2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.75rem', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37, #f0cc60)', color: '#0b1329', fontWeight: 800, fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {profile?.fullName ? profile.fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'AD'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontFamily: "'Playfair Display', serif" }}>{profile?.fullName}</h2>
                <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 100, background: '#d4af37', color: '#0b1329', fontWeight: 800 }}>
                  {profile?.role}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)' }}>{profile?.email}</div>
              <div style={{ fontSize: '0.75rem', color: '#d4af37', marginTop: '0.4rem' }}>
                Account Active • Last Login: {profile?.lastLoginAt ? new Date(profile.lastLoginAt).toLocaleString() : 'Recent Session'}
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* General Profile Info */}
            <div style={{ background: '#fff', borderRadius: 14, padding: '1.75rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <h3 style={{ margin: '0 0 0.35rem', color: '#0f172a', fontSize: '1.1rem' }}>
                Personal Information
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '0 0 1.25rem' }}>
                Update your administrative display name and phone number.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Contact Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: 4 }}>Registered Email (Primary Login)</label>
                <input
                  type="email"
                  disabled
                  value={profile?.email || ''}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontSize: '0.88rem', cursor: 'not-allowed' }}
                />
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginTop: 4 }}>
                  Email address is locked to master system credentials.
                </span>
              </div>
            </div>

            {/* Change Password */}
            <div style={{ background: '#fff', borderRadius: 14, padding: '1.75rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <h3 style={{ margin: '0 0 0.35rem', color: '#0f172a', fontSize: '1.1rem' }}>
                Security & Password Update
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '0 0 1.25rem' }}>
                To modify your admin credentials, enter your current password followed by your new password.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 8 characters"
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                disabled={saveLoading}
                type="submit"
                style={{
                  padding: '0.75rem 2rem',
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #101b3b 0%, #1e293b 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(16,27,59,0.25)',
                }}
              >
                {saveLoading ? 'Saving Profile...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
