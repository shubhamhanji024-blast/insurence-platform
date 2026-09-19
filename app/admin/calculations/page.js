'use client';
import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminCalculationsPage() {
  const [calculations, setCalculations] = useState([]);
  const [metrics, setMetrics] = useState({ total: 0, today: 0, week: 0, month: 0 });
  const [typeStats, setTypeStats] = useState({});
  const [timeline, setTimeline] = useState([]);
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
        setCalculations(result.data.calculations || []);
        setMetrics(result.data.metrics || { total: 0, today: 0, week: 0, month: 0 });
        setTypeStats(result.data.typeStats || {});
        setTimeline(result.data.timeline || []);
        setPagination(result.data.pagination || { page: 1, totalPages: 1, total: 0 });
      } else {
        setError(result.message || 'Failed to load calculator analytics.');
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

  const maxTimeline = Math.max(...timeline.map((t) => t.count), 5);

  return (
    <AdminLayout title="Calculator Usage Analytics">
      {/* Top 4 Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: 12, border: '1px solid #e2e8f0', borderTop: '4px solid #101b3b', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total Calculations</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>{metrics.total?.toLocaleString() ?? 0}</div>
          <span style={{ fontSize: '0.76rem', color: '#64748b' }}>All time calculations</span>
        </div>

        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: 12, border: '1px solid #e2e8f0', borderTop: '4px solid #10b981', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Calculations Today</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#047857', margin: '0.2rem 0' }}>{metrics.today?.toLocaleString() ?? 0}</div>
          <span style={{ fontSize: '0.76rem', color: '#16a34a', fontWeight: 600 }}>Active session volume</span>
        </div>

        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: 12, border: '1px solid #e2e8f0', borderTop: '4px solid #3b82f6', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>This Week (7 Days)</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1d4ed8', margin: '0.2rem 0' }}>{metrics.week?.toLocaleString() ?? 0}</div>
          <span style={{ fontSize: '0.76rem', color: '#64748b' }}>Weekly projection runs</span>
        </div>

        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: 12, border: '1px solid #e2e8f0', borderTop: '4px solid #d4af37', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>This Month (30 Days)</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#b45309', margin: '0.2rem 0' }}>{metrics.month?.toLocaleString() ?? 0}</div>
          <span style={{ fontSize: '0.76rem', color: '#64748b' }}>Monthly utilization</span>
        </div>
      </div>

      {/* Chart & Tool Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Usage Over Time Chart */}
        <div style={{ background: '#ffffff', borderRadius: 14, padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
              📈 Calculator Usage Over Time (Past 7 Days)
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Daily calculation events executed by visitors and registered users
            </span>
          </div>

          <div style={{ height: 160, display: 'flex', alignItems: 'flex-end', gap: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
            {timeline.map((item, idx) => {
              const h = Math.max(10, (item.count / maxTimeline) * 130);
              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div
                    title={`${item.date}: ${item.count} calculations`}
                    style={{ width: '45%', height: `${h}px`, background: 'linear-gradient(180deg, #d4af37 0%, #101b3b 100%)', borderRadius: '4px 4px 0 0', transition: 'height 0.3s' }}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.4rem', whiteSpace: 'nowrap' }}>
                    {item.date.split(',')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Breakdown by Module */}
        <div style={{ background: '#ffffff', borderRadius: 14, padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
              📊 Calculator Distribution by Tool
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Share of calculations performed across financial planners
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {[
              { label: 'SIP Calculator', count: typeStats.SIP || 0, color: '#3b82f6' },
              { label: 'Loan EMI Calculator', count: typeStats.EMI || 0, color: '#10b981' },
              { label: 'Lumpsum Calculator', count: typeStats.LUMPSUM || 0, color: '#f59e0b' },
              { label: 'Retirement Planner', count: typeStats.RETIREMENT || 0, color: '#8b5cf6' },
            ].map((tool, i) => {
              const total = metrics.total || 1;
              const pct = Math.round((tool.count / total) * 100);
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                    <span style={{ color: '#334155' }}>{tool.label}</span>
                    <span style={{ color: '#0f172a' }}>{tool.count} ({pct}%)</span>
                  </div>
                  <div style={{ height: 8, background: '#f1f5f9', borderRadius: 100, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.max(tool.count ? 5 : 0, pct)}%`, height: '100%', background: tool.color, borderRadius: 100, transition: 'width 0.4s' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter Bar & Table */}
      <div style={{ background: '#fff', padding: '1rem 1.25rem', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Filter Saved Runs:</span>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.88rem', background: '#ffffff', outline: 'none' }}
        >
          <option value="">All Calculators</option>
          <option value="SIP">SIP</option>
          <option value="EMI">EMI</option>
          <option value="LUMPSUM">Lumpsum</option>
          <option value="RETIREMENT">Retirement</option>
        </select>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
            <div style={{ width: 36, height: 36, border: '3px solid #d4af37', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
            Loading calculations...
          </div>
        ) : error ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#ef4444' }}>
            <p style={{ fontWeight: 600 }}>{error}</p>
            <button onClick={() => fetchCalculations(1)} style={{ padding: '0.5rem 1rem', borderRadius: 6, background: '#101b3b', color: '#fff', border: 'none', cursor: 'pointer', marginTop: 8 }}>
              Try Again
            </button>
          </div>
        ) : calculations.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🧮</div>
            <h3 style={{ margin: '0 0 0.5rem', color: '#0f172a' }}>No Saved Calculations</h3>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>When users calculate and save plans, they appear here.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Plan Title</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Calculator Type</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>User</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Date Created</th>
                </tr>
              </thead>
              <tbody>
                {calculations.map((c) => (
                  <tr key={c.id || c._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#0f172a' }}>
                      {c.name}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: 100, fontWeight: 700, background: '#f1f5f9', color: '#334155' }}>
                        {c.calculatorType}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 500, color: '#0f172a' }}>{c.userId?.fullName || 'Anonymous Member'}</div>
                      <div style={{ fontSize: '0.76rem', color: '#64748b' }}>{c.userId?.email || '—'}</div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.82rem' }}>
                      {new Date(c.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Showing {calculations.length > 0 ? (pagination.page - 1) * 20 + 1 : 0}–{Math.min(pagination.page * 20, pagination.total)} of {pagination.total} calculations
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchCalculations(pagination.page - 1)}
                style={{ padding: '0.35rem 0.85rem', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.82rem', cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer', opacity: pagination.page <= 1 ? 0.5 : 1 }}
              >
                Previous
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchCalculations(pagination.page + 1)}
                style={{ padding: '0.35rem 0.85rem', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.82rem', cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer', opacity: pagination.page >= pagination.totalPages ? 0.5 : 1 }}
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
