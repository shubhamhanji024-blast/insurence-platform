'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

const STATUS_COLORS = {
  NEW: { bg: '#fef3c7', color: '#92400e', border: '#fde68a' },
  READ: { bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' },
  IN_PROGRESS: { bg: '#fef9c3', color: '#854d0e', border: '#fef08a' },
  RESPONDED: { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' },
  CLOSED: { bg: '#f3f4f6', color: '#4b5563', border: '#e5e7eb' },
};

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  const fetchEnquiries = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '20');
      if (search.trim()) params.set('search', search.trim());
      if (statusFilter) params.set('status', statusFilter);
      if (sortOrder) params.set('sort', sortOrder);

      const res = await fetch(`/api/admin/enquiries?${params.toString()}`);
      const result = await res.json();

      if (res.ok && result.success) {
        setEnquiries(result.data.enquiries);
        setPagination(result.data.pagination);
      } else {
        setError(result.message || 'Failed to load contact enquiries.');
      }
    } catch {
      setError('Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, sortOrder]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEnquiries(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchEnquiries]);

  return (
    <AdminLayout title="Contact Enquiries">
      {/* Search & Filter Bar */}
      <div className="glass-card-static" style={{ padding: '1.25rem', background: '#ffffff', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search by name, email, phone, or message..."
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
              }}
            />
          </div>
          <div style={{ minWidth: '160px' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                background: '#ffffff',
              }}
            >
              <option value="">All Statuses</option>
              <option value="NEW">NEW</option>
              <option value="READ">READ</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESPONDED">RESPONDED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
          <div style={{ minWidth: '140px' }}>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                background: '#ffffff',
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      {error ? (
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', background: '#ffffff' }}>
          <p style={{ color: '#e11d48', margin: '0 0 1rem' }}>{error}</p>
          <button type="button" onClick={() => fetchEnquiries(1)} className="btn btn-primary btn-sm">
            🔄 Retry
          </button>
        </div>
      ) : loading ? (
        <div className="glass-card-static" style={{ padding: '2rem', textAlign: 'center', background: '#ffffff' }}>
          <div style={{ width: 32, height: 32, border: '3px solid #d4af37', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 0.5rem' }} />
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Loading enquiries...</p>
        </div>
      ) : enquiries.length === 0 ? (
        <div className="glass-card-static" style={{ padding: '3rem 1.5rem', textAlign: 'center', background: '#ffffff' }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>✉️</span>
          <h3 style={{ color: '#101b3b', margin: '0 0 0.5rem' }}>No enquiries found</h3>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
            {search || statusFilter ? 'Try clearing your search filters.' : 'No contact form enquiries stored in MongoDB yet.'}
          </p>
        </div>
      ) : (
        <div className="glass-card-static" style={{ padding: '1.5rem', background: '#ffffff' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Sender</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Service Requested</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Message Preview</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Submitted Date</th>
                  <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((e) => {
                  const style = STATUS_COLORS[e.status] || STATUS_COLORS.NEW;
                  return (
                    <tr key={e.id || e._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        <div style={{ fontWeight: 600, color: '#101b3b' }}>{e.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{e.email}</div>
                        {e.phone && <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>📞 {e.phone}</div>}
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', color: '#334155', fontWeight: 500 }}>
                        {e.service}
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', color: '#64748b', maxWidth: '240px' }}>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={e.message}>
                          {e.message}
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            padding: '3px 10px',
                            borderRadius: '100px',
                            fontWeight: 700,
                            background: style.bg,
                            color: style.color,
                            border: `1px solid ${style.border}`,
                          }}
                        >
                          {e.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                        {new Date(e.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>
                        <Link
                          href={`/admin/enquiries/${e.id || e._id}`}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                        >
                          View &amp; Status
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Showing {enquiries.length > 0 ? (pagination.page - 1) * 20 + 1 : 0}–
              {Math.min(pagination.page * 20, pagination.total)} of {pagination.total} enquiries
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => fetchEnquiries(pagination.page - 1)}
                className="btn btn-outline btn-sm"
              >
                Previous
              </button>
              <span style={{ display: 'flex', alignItems: 'center', padding: '0 0.75rem', fontSize: '0.85rem', fontWeight: 600, color: '#101b3b' }}>
                Page {pagination.page} of {pagination.totalPages || 1}
              </span>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchEnquiries(pagination.page + 1)}
                className="btn btn-outline btn-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
