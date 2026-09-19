'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form states
  const [form, setForm] = useState({
    siteName: 'GrowthNest',
    tagline: 'Smarter Financial Decisions for a Confident Future',
    supportEmail: 'support@growthnest.com',
    supportPhone: '+91 (800) 476-9840',
    officeAddress: 'GrowthNest Towers, Financial District, Bengaluru, Karnataka, India',
    emailNotifications: true,
    maintenanceMode: false,
    allowRegistrations: true,
    defaultCurrency: 'INR (₹)',
    maxCalculationsPerDay: 50,
    autoConfirmAppointments: false,
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const fetchSettings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/settings');
      const json = await res.json();
      if (res.ok && json.success) {
        setSettings(json.data.settings);
        setForm(json.data.settings);
      } else {
        setError(json.message || 'Failed to load settings.');
      }
    } catch {
      setError('Unable to load platform configuration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('Platform settings saved successfully.');
        setSettings(json.data.settings);
      } else {
        alert(json.message || 'Failed to save settings.');
      }
    } catch {
      alert('Error updating settings.');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <AdminLayout title="Platform Settings">
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#0f172a', color: '#fff', padding: '0.85rem 1.4rem', borderRadius: 10, zIndex: 1200, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <span>✓</span> {toastMessage}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
          <div style={{ width: 36, height: 36, border: '3px solid #d4af37', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          Loading platform configuration...
        </div>
      ) : error ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#ef4444', background: '#fff', borderRadius: 12 }}>
          <p style={{ fontWeight: 600 }}>{error}</p>
          <button onClick={fetchSettings} style={{ padding: '0.5rem 1rem', borderRadius: 6, background: '#101b3b', color: '#fff', border: 'none', cursor: 'pointer', marginTop: 8 }}>
            Try Again
          </button>
        </div>
      ) : (
        <form onSubmit={handleSaveSettings} style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Website Branding */}
          <div style={{ background: '#fff', borderRadius: 14, padding: '1.75rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <h3 style={{ margin: '0 0 0.35rem', color: '#0f172a', fontSize: '1.15rem' }}>
              General Platform Information
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '0 0 1.25rem' }}>
              Public-facing identity and contact coordinates.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Platform Name</label>
                <input
                  type="text"
                  required
                  value={form.siteName}
                  onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Currency Format</label>
                <select
                  value={form.defaultCurrency}
                  onChange={(e) => setForm({ ...form, defaultCurrency: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem', background: '#fff' }}
                >
                  <option value="INR (₹)">INR (₹)</option>
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                  <option value="GBP (£)">GBP (£)</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Tagline</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Customer Support Email</label>
                <input
                  type="email"
                  required
                  value={form.supportEmail}
                  onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Helpline Phone</label>
                <input
                  type="text"
                  value={form.supportPhone}
                  onChange={(e) => setForm({ ...form, supportPhone: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Physical Headquarters Address</label>
              <input
                type="text"
                value={form.officeAddress}
                onChange={(e) => setForm({ ...form, officeAddress: e.target.value })}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          {/* Access & Platform Controls */}
          <div style={{ background: '#fff', borderRadius: 14, padding: '1.75rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <h3 style={{ margin: '0 0 0.35rem', color: '#0f172a', fontSize: '1.15rem' }}>
              Platform Controls & Toggles
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '0 0 1.25rem' }}>
              Manage registration status, advisory automation, and notifications.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '0.75rem', background: '#f8fafc', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>Public User Registrations</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Allow new visitors to register accounts on GrowthNest</div>
                </div>
                <input
                  type="checkbox"
                  checked={form.allowRegistrations}
                  onChange={(e) => setForm({ ...form, allowRegistrations: e.target.checked })}
                  style={{ width: 18, height: 18, accentColor: '#101b3b', cursor: 'pointer' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '0.75rem', background: '#f8fafc', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>Admin Email Notifications</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Trigger alerts for contact requests and appointments</div>
                </div>
                <input
                  type="checkbox"
                  checked={form.emailNotifications}
                  onChange={(e) => setForm({ ...form, emailNotifications: e.target.checked })}
                  style={{ width: 18, height: 18, accentColor: '#101b3b', cursor: 'pointer' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '0.75rem', background: '#f8fafc', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>Auto-Confirm Appointments</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Automatically set incoming client bookings to CONFIRMED status</div>
                </div>
                <input
                  type="checkbox"
                  checked={form.autoConfirmAppointments}
                  onChange={(e) => setForm({ ...form, autoConfirmAppointments: e.target.checked })}
                  style={{ width: 18, height: 18, accentColor: '#101b3b', cursor: 'pointer' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '0.75rem', background: '#fef2f2', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#991b1b' }}>Platform Maintenance Mode</div>
                  <div style={{ fontSize: '0.78rem', color: '#b91c1c' }}>Show maintenance notice banner to normal visitors</div>
                </div>
                <input
                  type="checkbox"
                  checked={form.maintenanceMode}
                  onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })}
                  style={{ width: 18, height: 18, accentColor: '#ef4444', cursor: 'pointer' }}
                />
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
              {saveLoading ? 'Saving...' : 'Save All Settings'}
            </button>
          </div>
        </form>
      )}
    </AdminLayout>
  );
}
