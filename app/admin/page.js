'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { formatRelativeTime } from '@/lib/activity';

export default function AdminOverviewPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/dashboard');
      const result = await res.json();

      if (res.ok && result.success) {
        setData(result.data);
      } else {
        setError(result.message || 'Failed to fetch admin stats.');
      }
    } catch {
      setError('Unable to connect to admin API server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <AdminLayout title="Platform Overview">
      {error ? (
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', background: '#ffffff' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚠️</div>
          <h3 style={{ color: '#e11d48', margin: '0 0 0.5rem' }}>{error}</h3>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            We could not retrieve system metrics right now.
          </p>
          <button type="button" onClick={fetchDashboardData} className="btn btn-primary btn-sm">
            🔄 Retry
          </button>
        </div>
      ) : loading ? (
        <div>
          <div className="grid grid-3 gap-md" style={{ marginBottom: '2rem' }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card-static" style={{ padding: '1.5rem', background: '#ffffff', minHeight: '110px' }}>
                <div style={{ width: '40%', height: '12px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '0.75rem', animation: 'pulse 1.5s infinite' }} />
                <div style={{ width: '70%', height: '24px', background: '#cbd5e1', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards Grid */}
          <div className="grid grid-3 gap-md" style={{ marginBottom: '2rem' }}>
            {/* Card 1: Total Users */}
            <div className="glass-card-static" style={{ padding: '1.35rem', background: '#ffffff', borderTop: '4px solid #101b3b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Total Users
                </span>
                <span style={{ fontSize: '1.3rem' }}>👥</span>
              </div>
              <h3 style={{ fontSize: '1.8rem', margin: '0.2rem 0', color: '#101b3b', fontWeight: 800 }}>
                {data?.stats?.totalUsers ?? 0}
              </h3>
              <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>
                +{data?.stats?.newUsersWeek ?? 0} registered this week
              </div>
            </div>

            {/* Card 2: New Users (30d) */}
            <div className="glass-card-static" style={{ padding: '1.35rem', background: '#ffffff', borderTop: '4px solid #3b82f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  New Registrations (30d)
                </span>
                <span style={{ fontSize: '1.3rem' }}>✨</span>
              </div>
              <h3 style={{ fontSize: '1.8rem', margin: '0.2rem 0', color: '#101b3b', fontWeight: 800 }}>
                {data?.stats?.newUsersMonth ?? 0}
              </h3>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                Active growth rate
              </div>
            </div>

            {/* Card 3: Contact Enquiries */}
            <div className="glass-card-static" style={{ padding: '1.35rem', background: '#ffffff', borderTop: '4px solid #d4af37' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Contact Enquiries
                </span>
                <span style={{ fontSize: '1.3rem' }}>✉️</span>
              </div>
              <h3 style={{ fontSize: '1.8rem', margin: '0.2rem 0', color: '#101b3b', fontWeight: 800 }}>
                {data?.stats?.totalEnquiries ?? 0}
              </h3>
              <div style={{ fontSize: '0.8rem', color: data?.stats?.newEnquiries > 0 ? '#d97706' : '#6b7280', fontWeight: 600 }}>
                {data?.stats?.newEnquiries ?? 0} pending (NEW)
              </div>
            </div>

            {/* Card 4: New Enquiries Pending */}
            <div className="glass-card-static" style={{ padding: '1.35rem', background: '#ffffff', borderTop: '4px solid #f59e0b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  New Enquiries
                </span>
                <span style={{ fontSize: '1.3rem' }}>🔔</span>
              </div>
              <h3 style={{ fontSize: '1.8rem', margin: '0.2rem 0', color: '#101b3b', fontWeight: 800 }}>
                {data?.stats?.newEnquiries ?? 0}
              </h3>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                Requires admin review
              </div>
            </div>

            {/* Card 5: Financial Goals */}
            <div className="glass-card-static" style={{ padding: '1.35rem', background: '#ffffff', borderTop: '4px solid #10b981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Financial Goals
                </span>
                <span style={{ fontSize: '1.3rem' }}>🎯</span>
              </div>
              <h3 style={{ fontSize: '1.8rem', margin: '0.2rem 0', color: '#101b3b', fontWeight: 800 }}>
                {data?.stats?.totalGoals ?? 0}
              </h3>
              <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
                {data?.stats?.activeGoals ?? 0} Active goals
              </div>
            </div>

            {/* Card 6: Saved Calculations */}
            <div className="glass-card-static" style={{ padding: '1.35rem', background: '#ffffff', borderTop: '4px solid #8b5cf6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Saved Calculations
                </span>
                <span style={{ fontSize: '1.3rem' }}>💾</span>
              </div>
              <h3 style={{ fontSize: '1.8rem', margin: '0.2rem 0', color: '#101b3b', fontWeight: 800 }}>
                {data?.stats?.totalCalculations ?? 0}
              </h3>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                Across all calculator modules
              </div>
            </div>
          </div>

          {/* Quick Tables: Recent Users & Recent Enquiries */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.75rem' }}>
            {/* Recent Registrations */}
            <div className="glass-card-static" style={{ padding: '1.5rem', background: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0, color: '#101b3b' }}>
                  👥 Recent Registered Users
                </h3>
                <Link href="/admin/users" className="btn btn-sm btn-outline" style={{ fontSize: '0.8rem' }}>
                  View All
                </Link>
              </div>

              {!data?.recentUsers || data.recentUsers.length === 0 ? (
                <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>No user registrations yet.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#6b7280' }}>
                        <th style={{ padding: '0.6rem 0.5rem' }}>User</th>
                        <th style={{ padding: '0.6rem 0.5rem' }}>Role</th>
                        <th style={{ padding: '0.6rem 0.5rem' }}>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentUsers.map((u) => (
                        <tr key={u._id || u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <div style={{ fontWeight: 600, color: '#101b3b' }}>{u.fullName}</div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{u.email}</div>
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <span
                              style={{
                                fontSize: '0.7rem',
                                padding: '2px 8px',
                                borderRadius: '100px',
                                fontWeight: 700,
                                background: u.role === 'ADMIN' ? 'rgba(212,175,55,0.15)' : '#f1f5f9',
                                color: u.role === 'ADMIN' ? '#b45309' : '#475569',
                              }}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem', color: '#6b7280', fontSize: '0.8rem' }}>
                            {formatRelativeTime(u.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recent Enquiries */}
            <div className="glass-card-static" style={{ padding: '1.5rem', background: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0, color: '#101b3b' }}>
                  ✉️ Recent Enquiries
                </h3>
                <Link href="/admin/enquiries" className="btn btn-sm btn-outline" style={{ fontSize: '0.8rem' }}>
                  View All
                </Link>
              </div>

              {!data?.recentEnquiries || data.recentEnquiries.length === 0 ? (
                <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>No enquiries submitted yet.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#6b7280' }}>
                        <th style={{ padding: '0.6rem 0.5rem' }}>Contact</th>
                        <th style={{ padding: '0.6rem 0.5rem' }}>Service</th>
                        <th style={{ padding: '0.6rem 0.5rem' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentEnquiries.map((e) => (
                        <tr key={e._id || e.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <div style={{ fontWeight: 600, color: '#101b3b' }}>{e.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{e.email}</div>
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem', color: '#475569' }}>
                            {e.service}
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <span
                              style={{
                                fontSize: '0.7rem',
                                padding: '2px 8px',
                                borderRadius: '100px',
                                fontWeight: 700,
                                background: e.status === 'NEW' ? '#fef3c7' : '#dcfce7',
                                color: e.status === 'NEW' ? '#92400e' : '#166534',
                              }}
                            >
                              {e.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
