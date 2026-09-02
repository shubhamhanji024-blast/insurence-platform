'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminUserDetailPage({ params }) {
  const resolvedParams = use(params);
  const userId = resolvedParams.id;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState({ text: '', isError: false });

  const fetchUserDetail = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/users/${userId}`);
      const result = await res.json();

      if (res.ok && result.success) {
        setData(result.data);
        setNewRole(result.data.user.role);
      } else {
        setError(result.message || 'Unable to load user details.');
      }
    } catch {
      setError('Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserDetail();
    }
  }, [userId]);

  const handleRoleChange = async () => {
    if (!newRole || newRole === data?.user?.role) return;

    setUpdating(true);
    setUpdateMsg({ text: '', isError: false });

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      const result = await res.json();

      if (res.ok && result.success) {
        setUpdateMsg({ text: `Role updated to ${newRole} successfully!`, isError: false });
        setData((prev) => ({
          ...prev,
          user: { ...prev.user, role: newRole },
        }));
        setRoleModalOpen(false);
      } else {
        setUpdateMsg({ text: result.message || 'Failed to update role.', isError: true });
      }
    } catch {
      setUpdateMsg({ text: 'Error connecting to server.', isError: true });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <AdminLayout title="User Account Detail">
      <div style={{ marginBottom: '1rem' }}>
        <Link href="/admin/users" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
          ← Back to Users List
        </Link>
      </div>

      {updateMsg.text && (
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            background: updateMsg.isError ? '#fef2f2' : '#f0fdf4',
            color: updateMsg.isError ? '#b91c1c' : '#15803d',
            border: `1px solid ${updateMsg.isError ? '#fca5a5' : '#86efac'}`,
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          {updateMsg.isError ? '⚠️ ' : '✅ '}
          {updateMsg.text}
        </div>
      )}

      {error ? (
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', background: '#ffffff' }}>
          <p style={{ color: '#e11d48', margin: '0 0 1rem' }}>{error}</p>
          <button type="button" onClick={fetchUserDetail} className="btn btn-primary btn-sm">
            🔄 Retry
          </button>
        </div>
      ) : loading ? (
        <div className="glass-card-static" style={{ padding: '2rem', textAlign: 'center', background: '#ffffff' }}>
          <div style={{ width: 32, height: 32, border: '3px solid #d4af37', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 0.5rem' }} />
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Loading user metrics...</p>
        </div>
      ) : !data?.user ? (
        <div className="glass-card-static" style={{ padding: '2rem', textAlign: 'center', background: '#ffffff' }}>
          <p style={{ color: '#6b7280' }}>User not found.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Left Column: Account Info */}
          <div className="glass-card-static" style={{ padding: '1.75rem', background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: '#101b3b', margin: '0 0 0.25rem' }}>
                  {data.user.fullName}
                </h2>
                <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>{data.user.email}</p>
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '4px 12px',
                  borderRadius: '100px',
                  fontWeight: 700,
                  background: data.user.role === 'ADMIN' ? 'rgba(212,175,55,0.15)' : '#e2e8f0',
                  color: data.user.role === 'ADMIN' ? '#92400e' : '#334155',
                  border: data.user.role === 'ADMIN' ? '1px solid rgba(212,175,55,0.4)' : 'none',
                }}
              >
                {data.user.role}
              </span>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '1rem 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Phone Number</span>
                <span style={{ fontWeight: 600, color: '#101b3b' }}>{data.user.phone || 'Not provided'}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Email Verification</span>
                <span style={{ fontWeight: 600, color: data.user.emailVerified ? '#16a34a' : '#d97706' }}>
                  {data.user.emailVerified ? '✓ Verified Account' : 'Unverified'}
                </span>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Account Created</span>
                <span style={{ fontWeight: 600, color: '#101b3b' }}>
                  {new Date(data.user.createdAt).toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Last Sign In</span>
                <span style={{ fontWeight: 600, color: '#101b3b' }}>
                  {data.user.lastLoginAt ? new Date(data.user.lastLoginAt).toLocaleString('en-IN') : 'Never'}
                </span>
              </div>
            </div>

            <div style={{ marginTop: '1.75rem' }}>
              <button
                type="button"
                onClick={() => setRoleModalOpen(true)}
                className="btn btn-outline"
                style={{ width: '100%', padding: '0.65rem' }}
              >
                ⚙️ Change User Role
              </button>
            </div>
          </div>

          {/* Right Column: Platform Activity & Goal Metrics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-card-static" style={{ padding: '1.5rem', background: '#ffffff' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#101b3b', margin: '0 0 1rem' }}>
                📊 Platform Usage Summary
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Financial Goals</span>
                  <h4 style={{ fontSize: '1.6rem', color: '#101b3b', margin: '0.25rem 0 0', fontWeight: 800 }}>
                    {data.stats.goalCount}
                  </h4>
                </div>
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Saved Calculations</span>
                  <h4 style={{ fontSize: '1.6rem', color: '#101b3b', margin: '0.25rem 0 0', fontWeight: 800 }}>
                    {data.stats.calcCount}
                  </h4>
                </div>
              </div>
            </div>

            <div className="glass-card-static" style={{ padding: '1.5rem', background: '#ffffff', flex: 1 }}>
              <h3 style={{ fontSize: '1.1rem', color: '#101b3b', margin: '0 0 1rem' }}>
                🎯 Recent Financial Goals
              </h3>
              {!data.recentGoals || data.recentGoals.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>User has not created any financial goals yet.</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {data.recentGoals.map((g) => (
                    <li
                      key={g._id || g.id}
                      style={{
                        padding: '0.75rem',
                        background: '#f8fafc',
                        borderRadius: 'var(--radius-md)',
                        borderLeft: '3px solid #10b981',
                        display: 'flex',
                        justify: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, color: '#101b3b', fontSize: '0.9rem' }}>{g.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{g.goalType}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, color: '#101b3b', fontSize: '0.9rem' }}>
                          ₹{g.targetAmount ? g.targetAmount.toLocaleString('en-IN') : 0}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>{g.status}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Role Change Modal */}
      {roleModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            padding: '1rem',
          }}
        >
          <div
            className="glass-card-static"
            style={{
              background: '#ffffff',
              maxWidth: '440px',
              width: '100%',
              padding: '1.75rem',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            }}
          >
            <h3 style={{ color: '#101b3b', margin: '0 0 0.5rem' }}>⚠️ Change User Role</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Are you sure you want to change role for <strong>{data?.user?.fullName}</strong>?
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#101b3b', marginBottom: '0.5rem' }}>
                Select Role:
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.95rem',
                  background: '#ffffff',
                }}
              >
                <option value="USER">USER (Standard Member)</option>
                <option value="ADMIN">ADMIN (Full Administrative Access)</option>
              </select>
            </div>

            {newRole === 'USER' && data?.user?.role === 'ADMIN' && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  background: '#fffbeb',
                  border: '1px solid #fcd34d',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.82rem',
                  color: '#92400e',
                  marginBottom: '1.25rem',
                }}
              >
                ⚠️ <strong>Warning:</strong> Demoting an ADMIN will revoke all admin panel access. Note that the system prevents removing the last administrator.
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                disabled={updating}
                onClick={() => setRoleModalOpen(false)}
                className="btn btn-outline btn-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updating || newRole === data?.user?.role}
                onClick={handleRoleChange}
                className="btn btn-primary btn-sm"
              >
                {updating ? 'Updating...' : 'Confirm Role Change'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
