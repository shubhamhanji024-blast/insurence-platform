'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Modals for safe confirmation
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, type: '' }); // 'deactivate' | 'activate' | 'delete'

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '20');
      if (search.trim()) params.set('search', search.trim());
      if (roleFilter) params.set('role', roleFilter);

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const result = await res.json();

      if (res.ok && result.success) {
        setUsers(result.data.users);
        setPagination(result.data.pagination);
      } else {
        setError(result.message || 'Failed to load users.');
      }
    } catch {
      setError('Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleToggleStatus = async (user, targetStatus) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${user._id || user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast(`User account is now ${targetStatus}.`);
        setConfirmModal({ open: false, type: '' });
        setSelectedUser(null);
        fetchUsers(pagination.page);
      } else {
        alert(json.message || 'Status update failed.');
      }
    } catch {
      alert('Error changing user status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${user._id || user.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast(`User ${user.email} permanently deleted.`);
        setConfirmModal({ open: false, type: '' });
        setSelectedUser(null);
        fetchUsers(pagination.page);
      } else {
        alert(json.message || 'Delete operation failed.');
      }
    } catch {
      alert('Error deleting user account.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout title="User Management">
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#0f172a', color: '#fff', padding: '0.85rem 1.4rem', borderRadius: 10, zIndex: 1200, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <span>✓</span> {toastMessage}
        </div>
      )}

      {/* Search & Filter Controls */}
      <div style={{ background: '#fff', padding: '1.25rem', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, minWidth: 260, maxWidth: 450 }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone number..."
            style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ padding: '0.65rem 1rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', background: '#fff' }}
          >
            <option value="">All Roles</option>
            <option value="USER">USER Only</option>
            <option value="ADMIN">ADMIN Only</option>
          </select>

          {(search || roleFilter) && (
            <button
              onClick={() => { setSearch(''); setRoleFilter(''); }}
              style={{ padding: '0.65rem 0.9rem', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.82rem', cursor: 'pointer' }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Users Table */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
            <div style={{ width: 36, height: 36, border: '3px solid #d4af37', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
            Loading registered users from MongoDB...
          </div>
        ) : error ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#ef4444' }}>
            <p style={{ fontWeight: 600 }}>{error}</p>
            <button onClick={() => fetchUsers(1)} style={{ padding: '0.5rem 1rem', borderRadius: 6, background: '#101b3b', color: '#fff', border: 'none', cursor: 'pointer', marginTop: 8 }}>
              Retry
            </button>
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👥</div>
            <h3 style={{ margin: '0 0 0.5rem', color: '#0f172a' }}>No Users Found</h3>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>{search || roleFilter ? 'Try adjusting your search criteria.' : 'No users currently registered.'}</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '0.85rem 1.25rem' }}>User Info</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Phone</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Role</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Status</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Registration Date</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Last Login</th>
                  <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isActive = u.status !== 'INACTIVE';
                  const userId = u._id || u.id;
                  return (
                    <tr key={userId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <Link href={`/admin/users/${userId}`} style={{ fontWeight: 600, color: '#0f172a', textDecoration: 'none' }}>
                          {u.fullName}
                        </Link>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{u.email}</div>
                        <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontFamily: 'monospace' }}>ID: {userId}</div>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: '#475569' }}>
                        {u.phone || '—'}
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            padding: '3px 10px',
                            borderRadius: 100,
                            fontWeight: 700,
                            background: u.role === 'ADMIN' ? '#fef3c7' : '#f1f5f9',
                            color: u.role === 'ADMIN' ? '#92400e' : '#334155',
                            border: u.role === 'ADMIN' ? '1px solid #fde68a' : '1px solid #e2e8f0',
                          }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            padding: '3px 10px',
                            borderRadius: 100,
                            fontWeight: 700,
                            background: isActive ? '#dcfce7' : '#fee2e2',
                            color: isActive ? '#166534' : '#991b1b',
                          }}
                        >
                          {isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.82rem' }}>
                        {new Date(u.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.82rem' }}>
                        {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Never'}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.45rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                          <Link
                            href={`/admin/users/${userId}`}
                            style={{ padding: '0.35rem 0.75rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600, color: '#0f172a', textDecoration: 'none' }}
                          >
                            View
                          </Link>

                          {isActive ? (
                            <button
                              onClick={() => { setSelectedUser(u); setConfirmModal({ open: true, type: 'deactivate' }); }}
                              style={{ padding: '0.35rem 0.65rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600, color: '#92400e', cursor: 'pointer' }}
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => { setSelectedUser(u); setConfirmModal({ open: true, type: 'activate' }); }}
                              style={{ padding: '0.35rem 0.65rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600, color: '#15803d', cursor: 'pointer' }}
                            >
                              Activate
                            </button>
                          )}

                          <button
                            onClick={() => { setSelectedUser(u); setConfirmModal({ open: true, type: 'delete' }); }}
                            style={{ padding: '0.35rem 0.65rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600, color: '#dc2626', cursor: 'pointer' }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Showing {users.length > 0 ? (pagination.page - 1) * 20 + 1 : 0}–{Math.min(pagination.page * 20, pagination.total)} of {pagination.total} users
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchUsers(pagination.page - 1)}
                style={{ padding: '0.35rem 0.85rem', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.82rem', cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer', opacity: pagination.page <= 1 ? 0.5 : 1 }}
              >
                Previous
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchUsers(pagination.page + 1)}
                style={{ padding: '0.35rem 0.85rem', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.82rem', cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer', opacity: pagination.page >= pagination.totalPages ? 0.5 : 1 }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Destructive Actions */}
      {confirmModal.open && selectedUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
          <div style={{ background: '#fff', borderRadius: 14, width: 440, maxWidth: '90vw', padding: '1.75rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '0.5rem' }}>
              {confirmModal.type === 'delete' ? '🗑️' : confirmModal.type === 'deactivate' ? '⚠️' : '✅'}
            </div>
            <h3 style={{ margin: '0 0 0.5rem', color: confirmModal.type === 'delete' ? '#991b1b' : '#0f172a', textAlign: 'center', fontSize: '1.2rem' }}>
              {confirmModal.type === 'delete' && 'Confirm User Account Deletion'}
              {confirmModal.type === 'deactivate' && 'Confirm User Deactivation'}
              {confirmModal.type === 'activate' && 'Confirm User Activation'}
            </h3>
            <p style={{ color: '#475569', fontSize: '0.88rem', textAlign: 'center', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              {confirmModal.type === 'delete' && (
                <>Are you sure you want to permanently delete user <strong>{selectedUser.fullName}</strong> ({selectedUser.email})? This action cannot be reversed.</>
              )}
              {confirmModal.type === 'deactivate' && (
                <>Deactivating <strong>{selectedUser.fullName}</strong> will restrict them from signing into their GrowthNest account until reactivated.</>
              )}
              {confirmModal.type === 'activate' && (
                <>Activate account access for <strong>{selectedUser.fullName}</strong> ({selectedUser.email})?</>
              )}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={() => { setConfirmModal({ open: false, type: '' }); setSelectedUser(null); }}
                style={{ padding: '0.65rem 1.25rem', borderRadius: 8, background: '#f1f5f9', border: '1px solid #cbd5e1', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                disabled={actionLoading}
                onClick={() => {
                  if (confirmModal.type === 'delete') handleDeleteUser(selectedUser);
                  else if (confirmModal.type === 'deactivate') handleToggleStatus(selectedUser, 'INACTIVE');
                  else if (confirmModal.type === 'activate') handleToggleStatus(selectedUser, 'ACTIVE');
                }}
                style={{
                  padding: '0.65rem 1.4rem',
                  borderRadius: 8,
                  background: confirmModal.type === 'delete' ? '#ef4444' : confirmModal.type === 'deactivate' ? '#d97706' : '#10b981',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                }}
              >
                {actionLoading ? 'Processing...' : confirmModal.type === 'delete' ? 'Yes, Delete' : confirmModal.type === 'deactivate' ? 'Yes, Deactivate' : 'Yes, Activate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
