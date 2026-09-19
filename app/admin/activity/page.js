'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminActivityPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [targetFilter, setTargetFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (actionFilter) params.set('action', actionFilter);
      if (targetFilter) params.set('targetType', targetFilter);
      params.set('page', page);

      const res = await fetch(`/api/admin/activity?${params.toString()}`);
      const json = await res.json();

      if (res.ok && json.success) {
        setLogs(json.data.logs || []);
        setPagination(json.data.pagination || { total: 0, totalPages: 1 });
      } else {
        setError(json.message || 'Failed to fetch activity logs.');
      }
    } catch {
      setError('Unable to connect to audit log service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, actionFilter, targetFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  const getActionColor = (act) => {
    if (act.includes('DELETE')) return { bg: '#fee2e2', color: '#991b1b' };
    if (act.includes('CREATE') || act.includes('LOGIN')) return { bg: '#dcfce7', color: '#166534' };
    if (act.includes('UPDATE') || act.includes('CHANGE')) return { bg: '#fef3c7', color: '#92400e' };
    return { bg: '#f1f5f9', color: '#475569' };
  };

  return (
    <AdminLayout title="System Activity Logs">
      {/* Search & Filter Bar */}
      <div style={{ background: '#fff', padding: '1.25rem', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: 260, maxWidth: 420 }}>
          <input
            type="text"
            placeholder="Search by admin, details, or action..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, padding: '0.6rem 1rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none' }}
          />
          <button type="submit" style={{ padding: '0.6rem 1.1rem', background: '#101b3b', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>
            Search
          </button>
        </form>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={actionFilter}
            onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
            style={{ padding: '0.6rem 1rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', background: '#fff' }}
          >
            <option value="">All Actions</option>
            <option value="ADMIN_LOGIN">Admin Login</option>
            <option value="USER_UPDATED">User Updated</option>
            <option value="USER_DELETED">User Deleted</option>
            <option value="ENQUIRY_UPDATED">Enquiry Updated</option>
            <option value="ENQUIRY_DELETED">Enquiry Deleted</option>
            <option value="APPOINTMENT_CREATED">Appointment Created</option>
            <option value="APPOINTMENT_UPDATED">Appointment Updated</option>
            <option value="SERVICE_CREATED">Service Created</option>
            <option value="SERVICE_UPDATED">Service Updated</option>
            <option value="SETTINGS_UPDATED">Settings Updated</option>
          </select>

          <select
            value={targetFilter}
            onChange={(e) => { setTargetFilter(e.target.value); setPage(1); }}
            style={{ padding: '0.6rem 1rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', background: '#fff' }}
          >
            <option value="">All Targets</option>
            <option value="AUTH">AUTH</option>
            <option value="USER">USER</option>
            <option value="ENQUIRY">ENQUIRY</option>
            <option value="APPOINTMENT">APPOINTMENT</option>
            <option value="SERVICE">SERVICE</option>
            <option value="SETTINGS">SETTINGS</option>
          </select>

          {(actionFilter || targetFilter || search) && (
            <button
              onClick={() => { setActionFilter(''); setTargetFilter(''); setSearch(''); setPage(1); }}
              style={{ padding: '0.6rem 0.9rem', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.82rem', cursor: 'pointer' }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Logs Table */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
            <div style={{ width: 36, height: 36, border: '3px solid #d4af37', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
            Loading system audit logs...
          </div>
        ) : error ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#ef4444' }}>
            <p style={{ fontWeight: 600 }}>{error}</p>
            <button onClick={fetchLogs} style={{ padding: '0.5rem 1rem', borderRadius: 6, background: '#101b3b', color: '#fff', border: 'none', cursor: 'pointer', marginTop: 8 }}>
              Try Again
            </button>
          </div>
        ) : logs.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📋</div>
            <h3 style={{ margin: '0 0 0.5rem', color: '#0f172a' }}>No Activity Records Found</h3>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Actions executed by administrators will be recorded here automatically.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Admin</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Action</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Target</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Details</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>IP / Device</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const tag = getActionColor(log.action);
                  return (
                    <tr key={log._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.95rem 1.25rem' }}>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{log.adminName}</div>
                        <div style={{ fontSize: '0.76rem', color: '#64748b' }}>{log.adminEmail}</div>
                      </td>
                      <td style={{ padding: '0.95rem 1.25rem' }}>
                        <span style={{ fontSize: '0.72rem', padding: '3px 9px', borderRadius: 6, fontWeight: 700, background: tag.bg, color: tag.color }}>
                          {log.action}
                        </span>
                      </td>
                      <td style={{ padding: '0.95rem 1.25rem', color: '#475569', fontWeight: 600, fontSize: '0.82rem' }}>
                        {log.targetType}
                      </td>
                      <td style={{ padding: '0.95rem 1.25rem', color: '#334155', maxWidth: 360 }}>
                        {log.details}
                      </td>
                      <td style={{ padding: '0.95rem 1.25rem', color: '#64748b', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                        {log.ip || '127.0.0.1'}
                      </td>
                      <td style={{ padding: '0.95rem 1.25rem', color: '#64748b', fontSize: '0.82rem' }}>
                        {new Date(log.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
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
              Showing Page {page} of {pagination.totalPages} ({pagination.total} events recorded)
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                style={{ padding: '0.35rem 0.85rem', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.82rem', cursor: page <= 1 ? 'not-allowed' : 'pointer', opacity: page <= 1 ? 0.5 : 1 }}
              >
                Previous
              </button>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                style={{ padding: '0.35rem 0.85rem', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.82rem', cursor: page >= pagination.totalPages ? 'not-allowed' : 'pointer', opacity: page >= pagination.totalPages ? 0.5 : 1 }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
