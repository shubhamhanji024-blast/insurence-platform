'use client';
import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminGoalsPage() {
  const [goals, setGoals] = useState([]);
  const [stats, setStats] = useState({});
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchGoals = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '20');
      if (statusFilter) params.set('status', statusFilter);

      const res = await fetch(`/api/admin/goals?${params.toString()}`);
      const result = await res.json();

      if (res.ok && result.success) {
        setGoals(result.data.goals);
        setStats(result.data.stats || {});
        setPagination(result.data.pagination);
      } else {
        setError(result.message || 'Failed to load financial goals.');
      }
    } catch {
      setError('Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchGoals(1);
  }, [fetchGoals]);

  return (
    <AdminLayout title="Financial Goals Aggregate">
      {/* Aggregate Cards */}
      <div className="grid grid-4 gap-md" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card-static" style={{ padding: '1.25rem', background: '#ffffff', borderTop: '4px solid #10b981' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Active Goals</span>
          <h3 style={{ fontSize: '1.6rem', color: '#101b3b', margin: '0.25rem 0 0', fontWeight: 800 }}>
            {stats.ACTIVE || 0}
          </h3>
        </div>
        <div className="glass-card-static" style={{ padding: '1.25rem', background: '#ffffff', borderTop: '4px solid #3b82f6' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Achieved Goals</span>
          <h3 style={{ fontSize: '1.6rem', color: '#101b3b', margin: '0.25rem 0 0', fontWeight: 800 }}>
            {stats.ACHIEVED || 0}
          </h3>
        </div>
        <div className="glass-card-static" style={{ padding: '1.25rem', background: '#ffffff', borderTop: '4px solid #f59e0b' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Paused Goals</span>
          <h3 style={{ fontSize: '1.6rem', color: '#101b3b', margin: '0.25rem 0 0', fontWeight: 800 }}>
            {stats.PAUSED || 0}
          </h3>
        </div>
        <div className="glass-card-static" style={{ padding: '1.25rem', background: '#ffffff', borderTop: '4px solid #d4af37' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Total Goals</span>
          <h3 style={{ fontSize: '1.6rem', color: '#101b3b', margin: '0.25rem 0 0', fontWeight: 800 }}>
            {pagination.total}
          </h3>
        </div>
      </div>

      {/* Filter */}
      <div className="glass-card-static" style={{ padding: '1rem 1.25rem', background: '#ffffff', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#101b3b' }}>Filter by Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #cbd5e1',
              fontSize: '0.9rem',
              background: '#ffffff',
            }}
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="ACHIEVED">ACHIEVED</option>
            <option value="PAUSED">PAUSED</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {error ? (
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', background: '#ffffff' }}>
          <p style={{ color: '#e11d48', margin: '0 0 1rem' }}>{error}</p>
          <button type="button" onClick={() => fetchGoals(1)} className="btn btn-primary btn-sm">
            🔄 Retry
          </button>
        </div>
      ) : loading ? (
        <div className="glass-card-static" style={{ padding: '2rem', textAlign: 'center', background: '#ffffff' }}>
          <div style={{ width: 32, height: 32, border: '3px solid #d4af37', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 0.5rem' }} />
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Loading goals...</p>
        </div>
      ) : goals.length === 0 ? (
        <div className="glass-card-static" style={{ padding: '3rem 1.5rem', textAlign: 'center', background: '#ffffff' }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>🎯</span>
          <h3 style={{ color: '#101b3b', margin: '0 0 0.5rem' }}>No financial goals found</h3>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>User goal data will automatically aggregate here as users set goals.</p>
        </div>
      ) : (
        <div className="glass-card-static" style={{ padding: '1.5rem', background: '#ffffff' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Goal Name</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>User</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Category</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Target Amount</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Created Date</th>
                </tr>
              </thead>
              <tbody>
                {goals.map((g) => (
                  <tr key={g.id || g._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: 600, color: '#101b3b' }}>
                      {g.name}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <div style={{ fontWeight: 500, color: '#334155' }}>{g.userId?.fullName || 'Anonymous'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{g.userId?.email}</div>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', color: '#64748b' }}>
                      {g.goalType}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700, color: '#101b3b' }}>
                      ₹{g.targetAmount ? g.targetAmount.toLocaleString('en-IN') : 0}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '3px 10px',
                          borderRadius: '100px',
                          fontWeight: 700,
                          background: g.status === 'ACTIVE' ? '#dcfce7' : '#f1f5f9',
                          color: g.status === 'ACTIVE' ? '#15803d' : '#475569',
                        }}
                      >
                        {g.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                      {new Date(g.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Showing {goals.length > 0 ? (pagination.page - 1) * 20 + 1 : 0}–
              {Math.min(pagination.page * 20, pagination.total)} of {pagination.total} goals
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => fetchGoals(pagination.page - 1)}
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
                onClick={() => fetchGoals(pagination.page + 1)}
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
