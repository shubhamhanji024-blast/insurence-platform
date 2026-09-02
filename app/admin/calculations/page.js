'use client';
import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminCalculationsPage() {
  const [calculations, setCalculations] = useState([]);
  const [typeStats, setTypeStats] = useState({});
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const fetchCalculations = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '20');
      if (typeFilter) params.set('type', typeFilter);

      const res = await fetch(`/api/admin/calculations?${params.toString()}`);
      const result = await res.json();

      if (res.ok && result.success) {
        setCalculations(result.data.calculations);
        setTypeStats(result.data.typeStats || {});
        setPagination(result.data.pagination);
      } else {
        setError(result.message || 'Failed to load saved calculations.');
      }
    } catch {
      setError('Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  }, [typeFilter]);

  useEffect(() => {
    fetchCalculations(1);
  }, [fetchCalculations]);

  return (
    <AdminLayout title="Saved Calculations Overview">
      {/* Calculator Breakdown Stats */}
      <div className="grid grid-4 gap-md" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card-static" style={{ padding: '1.25rem', background: '#ffffff', borderTop: '4px solid #101b3b' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>SIP Calculations</span>
          <h3 style={{ fontSize: '1.6rem', color: '#101b3b', margin: '0.25rem 0 0', fontWeight: 800 }}>
            {typeStats.SIP || 0}
          </h3>
        </div>
        <div className="glass-card-static" style={{ padding: '1.25rem', background: '#ffffff', borderTop: '4px solid #3b82f6' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>EMI Calculations</span>
          <h3 style={{ fontSize: '1.6rem', color: '#101b3b', margin: '0.25rem 0 0', fontWeight: 800 }}>
            {typeStats.EMI || 0}
          </h3>
        </div>
        <div className="glass-card-static" style={{ padding: '1.25rem', background: '#ffffff', borderTop: '4px solid #d4af37' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Lumpsum Plans</span>
          <h3 style={{ fontSize: '1.6rem', color: '#101b3b', margin: '0.25rem 0 0', fontWeight: 800 }}>
            {typeStats.LUMPSUM || 0}
          </h3>
        </div>
        <div className="glass-card-static" style={{ padding: '1.25rem', background: '#ffffff', borderTop: '4px solid #10b981' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Retirement Plans</span>
          <h3 style={{ fontSize: '1.6rem', color: '#101b3b', margin: '0.25rem 0 0', fontWeight: 800 }}>
            {typeStats.RETIREMENT || 0}
          </h3>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card-static" style={{ padding: '1rem 1.25rem', background: '#ffffff', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#101b3b' }}>Filter by Calculator Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #cbd5e1',
              fontSize: '0.9rem',
              background: '#ffffff',
            }}
          >
            <option value="">All Calculator Types</option>
            <option value="SIP">SIP</option>
            <option value="EMI">EMI</option>
            <option value="LUMPSUM">Lumpsum</option>
            <option value="RETIREMENT">Retirement</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {error ? (
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', background: '#ffffff' }}>
          <p style={{ color: '#e11d48', margin: '0 0 1rem' }}>{error}</p>
          <button type="button" onClick={() => fetchCalculations(1)} className="btn btn-primary btn-sm">
            🔄 Retry
          </button>
        </div>
      ) : loading ? (
        <div className="glass-card-static" style={{ padding: '2rem', textAlign: 'center', background: '#ffffff' }}>
          <div style={{ width: 32, height: 32, border: '3px solid #d4af37', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 0.5rem' }} />
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Loading calculations...</p>
        </div>
      ) : calculations.length === 0 ? (
        <div className="glass-card-static" style={{ padding: '3rem 1.5rem', textAlign: 'center', background: '#ffffff' }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>💾</span>
          <h3 style={{ color: '#101b3b', margin: '0 0 0.5rem' }}>No saved calculations found</h3>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>User calculations will automatically aggregate here as users save SIP, EMI, or Retirement plans.</p>
        </div>
      ) : (
        <div className="glass-card-static" style={{ padding: '1.5rem', background: '#ffffff' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Calculation Name</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Type</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>User</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Saved Date</th>
                </tr>
              </thead>
              <tbody>
                {calculations.map((c) => (
                  <tr key={c.id || c._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: 600, color: '#101b3b' }}>
                      {c.name}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '3px 10px',
                          borderRadius: '100px',
                          fontWeight: 700,
                          background: '#f1f5f9',
                          color: '#334155',
                        }}
                      >
                        {c.calculatorType}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <div style={{ fontWeight: 500, color: '#334155' }}>{c.userId?.fullName || 'Anonymous'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.userId?.email}</div>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                      {new Date(c.createdAt).toLocaleDateString('en-IN', {
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

          {/* Pagination Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Showing {calculations.length > 0 ? (pagination.page - 1) * 20 + 1 : 0}–
              {Math.min(pagination.page * 20, pagination.total)} of {pagination.total} calculations
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => fetchCalculations(pagination.page - 1)}
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
                onClick={() => fetchCalculations(pagination.page + 1)}
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
