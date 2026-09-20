'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { formatRelativeTime } from '@/lib/activity';

export default function AdminDashboardOverview() {
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
        setError(result.message || 'Failed to fetch admin metrics.');
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

  const stats = data?.stats || {};
  const chartData = data?.chartData || [];
  const maxVal = Math.max(
    ...chartData.map((d) => Math.max(d.users || 0, d.enquiries || 0, d.calculations || 0, 1)),
    5
  );

  return (
    <AdminLayout title="Enterprise Overview">
      {error ? (
        <div style={{ padding: '2.5rem', textAlign: 'center', background: '#ffffff', borderRadius: 16, border: '1px solid #fee2e2', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚠️</div>
          <h3 style={{ color: '#ef4444', margin: '0 0 0.5rem', fontSize: '1.25rem' }}>{error}</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Could not load real-time metrics from MongoDB Atlas.
          </p>
          <button
            type="button"
            onClick={fetchDashboardData}
            style={{ padding: '0.65rem 1.4rem', borderRadius: 8, background: '#101b3b', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}
          >
            🔄 Retry Connection
          </button>
        </div>
      ) : loading ? (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={{ padding: '1.5rem', background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0', minHeight: 110 }}>
                <div style={{ width: '45%', height: 12, background: '#e2e8f0', borderRadius: 4, marginBottom: 12 }} />
                <div style={{ width: '70%', height: 28, background: '#cbd5e1', borderRadius: 6 }} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Top Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            {/* 1. Total Users */}
            <div style={{ padding: '1.35rem', background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0', borderTop: '4px solid #101b3b', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                  Total Users
                </span>
                <span style={{ fontSize: '1.35rem' }}>👥</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>
                {stats.totalUsers?.toLocaleString() ?? 0}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span>↑</span> +{stats.newUsersWeek ?? 0} registered this week
              </div>
            </div>

            {/* 2. Active Users */}
            <div style={{ padding: '1.35rem', background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0', borderTop: '4px solid #059669', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                  Active Users
                </span>
                <span style={{ fontSize: '1.35rem' }}>🟢</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>
                {stats.activeUsers?.toLocaleString() ?? 0}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Verified & active status
              </div>
            </div>

            {/* 3. New Users (30d) */}
            <div style={{ padding: '1.35rem', background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0', borderTop: '4px solid #3b82f6', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                  New Users (30d)
                </span>
                <span style={{ fontSize: '1.35rem' }}>✨</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>
                {stats.newUsersMonth?.toLocaleString() ?? 0}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#3b82f6', fontWeight: 600 }}>
                Recent signups
              </div>
            </div>

            {/* 4. Contact Requests */}
            <div style={{ padding: '1.35rem', background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0', borderTop: '4px solid #d4af37', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                  Contact Requests
                </span>
                <span style={{ fontSize: '1.35rem' }}>✉️</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>
                {stats.totalEnquiries?.toLocaleString() ?? 0}
              </div>
              <div style={{ fontSize: '0.78rem', color: stats.newEnquiries > 0 ? '#d97706' : '#64748b', fontWeight: 600 }}>
                {stats.newEnquiries ?? 0} pending review
              </div>
            </div>

            {/* 5. Appointments */}
            <div style={{ padding: '1.35rem', background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0', borderTop: '4px solid #8b5cf6', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                  Appointments
                </span>
                <span style={{ fontSize: '1.35rem' }}>📅</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>
                {stats.totalAppointments?.toLocaleString() ?? 0}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#8b5cf6', fontWeight: 600 }}>
                {stats.pendingAppointments ?? 0} pending
              </div>
            </div>

            {/* 6. Calculator Uses */}
            <div style={{ padding: '1.35rem', background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0', borderTop: '4px solid #f97316', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                  Total Calculations
                </span>
                <span style={{ fontSize: '1.35rem' }}>🧮</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>
                {stats.totalCalculations?.toLocaleString() ?? 0}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                SIP, EMI, Lumpsum, Pension
              </div>
            </div>
          </div>

          {/* Activity Trends & Calculator Breakdown Charts Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Chart: Activity Over Time (Last 7 Days) */}
            <div style={{ background: '#ffffff', borderRadius: 14, padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                    📈 Activity Trends (Past 7 Days)
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    User registrations, enquiries & calculations loaded from MongoDB
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', fontWeight: 600 }}>
                  <span style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: '#3b82f6' }} /> Users
                  </span>
                  <span style={{ color: '#d4af37', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: '#d4af37' }} /> Enquiries
                  </span>
                  <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: '#10b981' }} /> Calcs
                  </span>
                </div>
              </div>

              {/* Bar Chart Visualization */}
              {chartData.length === 0 || chartData.every((d) => (d.users || 0) === 0 && (d.enquiries || 0) === 0 && (d.calculations || 0) === 0) ? (
                <div style={{ height: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: 8, padding: '1rem', border: '1px dashed #cbd5e1' }}>
                  <span style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>📊</span>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#475569' }}>No activity data available yet</div>
                  <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '0.2rem' }}>User registrations, enquiries, and calculations in the past 7 days will display here.</div>
                </div>
              ) : (
                <div style={{ height: 180, display: 'flex', alignItems: 'flex-end', gap: '0.85rem', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
                  {chartData.map((d, idx) => {
                    const uHeight = Math.max(8, (d.users / maxVal) * 150);
                    const eHeight = Math.max(8, (d.enquiries / maxVal) * 150);
                    const cHeight = Math.max(8, (d.calculations / maxVal) * 150);

                    return (
                      <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, width: '100%', justifyContent: 'center' }}>
                          <div
                            title={`Users: ${d.users}`}
                            style={{ width: '28%', height: `${uHeight}px`, background: '#3b82f6', borderRadius: '3px 3px 0 0', transition: 'height 0.3s' }}
                          />
                          <div
                            title={`Enquiries: ${d.enquiries}`}
                            style={{ width: '28%', height: `${eHeight}px`, background: '#d4af37', borderRadius: '3px 3px 0 0', transition: 'height 0.3s' }}
                          />
                          <div
                            title={`Calculations: ${d.calculations}`}
                            style={{ width: '28%', height: `${cHeight}px`, background: '#10b981', borderRadius: '3px 3px 0 0', transition: 'height 0.3s' }}
                          />
                        </div>
                        <span style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '0.4rem', whiteSpace: 'nowrap' }}>
                          {d.date.split(',')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Calculator Distribution */}
            <div style={{ background: '#ffffff', borderRadius: 14, padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                  🧮 Calculator Usage Distribution
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Total saved calculations by financial calculator tool
                </span>
              </div>

              {!stats.totalCalculations || stats.totalCalculations === 0 ? (
                <div style={{ padding: '2.5rem 1rem', textAlign: 'center', background: '#f8fafc', borderRadius: 8, border: '1px dashed #cbd5e1' }}>
                  <span style={{ fontSize: '1.75rem', marginBottom: '0.4rem', display: 'block' }}>🧮</span>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#475569' }}>No calculator usage data available yet</div>
                  <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '0.2rem' }}>Calculations saved and tracked across SIP, EMI, Lumpsum and Retirement will display here.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { label: 'SIP Calculator', count: data?.calculatorBreakdown?.sip || 0, color: '#3b82f6' },
                    { label: 'Loan EMI Calculator', count: data?.calculatorBreakdown?.emi || 0, color: '#10b981' },
                    { label: 'Lumpsum Calculator', count: data?.calculatorBreakdown?.lumpsum || 0, color: '#f59e0b' },
                    { label: 'Retirement Planner', count: data?.calculatorBreakdown?.retirement || 0, color: '#8b5cf6' },
                  ].map((item, i) => {
                    const totalC = stats.totalCalculations || 1;
                    const pct = Math.round((item.count / totalC) * 100);
                    return (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '0.3rem', fontWeight: 600 }}>
                          <span style={{ color: '#334155' }}>{item.label}</span>
                          <span style={{ color: '#0f172a' }}>{item.count} ({pct}%)</span>
                        </div>
                        <div style={{ height: 8, background: '#f1f5f9', borderRadius: 100, overflow: 'hidden' }}>
                          <div style={{ width: `${Math.max(item.count ? 5 : 0, pct)}%`, height: '100%', background: item.color, borderRadius: 100, transition: 'width 0.4s' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Quick Tables: Recent Users, Contact Requests & Activity Logs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.75rem', marginBottom: '2rem' }}>
            {/* Recent Registered Users */}
            <div style={{ background: '#ffffff', borderRadius: 14, padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.05rem', margin: 0, color: '#0f172a', fontWeight: 700 }}>
                  👥 Recent Users
                </h3>
                <Link
                  href="/admin/users"
                  style={{ fontSize: '0.8rem', color: '#101b3b', textDecoration: 'none', fontWeight: 600, padding: '0.35rem 0.75rem', borderRadius: 6, background: '#f1f5f9' }}
                >
                  View All Users →
                </Link>
              </div>

              {!data?.recentUsers || data.recentUsers.length === 0 ? (
                <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>No user registrations recorded.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                        <th style={{ padding: '0.6rem 0.5rem' }}>User</th>
                        <th style={{ padding: '0.6rem 0.5rem' }}>Status</th>
                        <th style={{ padding: '0.6rem 0.5rem' }}>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentUsers.map((u) => (
                        <tr key={u._id || u.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <Link href={`/admin/users/${u._id || u.id}`} style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 600 }}>
                              {u.fullName}
                            </Link>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.email}</div>
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <span
                              style={{
                                fontSize: '0.7rem',
                                padding: '2px 8px',
                                borderRadius: 100,
                                fontWeight: 700,
                                background: u.status === 'INACTIVE' ? '#fee2e2' : '#dcfce7',
                                color: u.status === 'INACTIVE' ? '#991b1b' : '#166534',
                              }}
                            >
                              {u.status || 'ACTIVE'}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem', color: '#64748b', fontSize: '0.8rem' }}>
                            {formatRelativeTime(u.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recent Contact Enquiries */}
            <div style={{ background: '#ffffff', borderRadius: 14, padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.05rem', margin: 0, color: '#0f172a', fontWeight: 700 }}>
                  ✉️ Recent Contact Requests
                </h3>
                <Link
                  href="/admin/enquiries"
                  style={{ fontSize: '0.8rem', color: '#101b3b', textDecoration: 'none', fontWeight: 600, padding: '0.35rem 0.75rem', borderRadius: 6, background: '#f1f5f9' }}
                >
                  Manage Requests →
                </Link>
              </div>

              {!data?.recentEnquiries || data.recentEnquiries.length === 0 ? (
                <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>No enquiries submitted.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                        <th style={{ padding: '0.6rem 0.5rem' }}>Client</th>
                        <th style={{ padding: '0.6rem 0.5rem' }}>Service</th>
                        <th style={{ padding: '0.6rem 0.5rem' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentEnquiries.map((e) => (
                        <tr key={e._id || e.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{e.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{e.email}</div>
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem', color: '#334155' }}>
                            {e.service || 'Advisory'}
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <span
                              style={{
                                fontSize: '0.7rem',
                                padding: '2px 8px',
                                borderRadius: 100,
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

          {/* Recent Admin Audit Logs */}
          <div style={{ background: '#ffffff', borderRadius: 14, padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', margin: 0, color: '#0f172a', fontWeight: 700 }}>
                  📋 Recent Admin Activity & Audit Trail
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Real-time security log of administrator actions and modifications
                </span>
              </div>
              <Link
                href="/admin/activity"
                style={{ fontSize: '0.8rem', color: '#101b3b', textDecoration: 'none', fontWeight: 600, padding: '0.35rem 0.75rem', borderRadius: 6, background: '#f1f5f9' }}
              >
                Full Activity Logs →
              </Link>
            </div>

            {!data?.recentActivity || data.recentActivity.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>No recent admin actions recorded.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                      <th style={{ padding: '0.6rem 0.5rem' }}>Admin</th>
                      <th style={{ padding: '0.6rem 0.5rem' }}>Action</th>
                      <th style={{ padding: '0.6rem 0.5rem' }}>Target</th>
                      <th style={{ padding: '0.6rem 0.5rem' }}>Details</th>
                      <th style={{ padding: '0.6rem 0.5rem' }}>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentActivity.map((log) => (
                      <tr key={log._id} style={{ borderBottom: '1px solid #f8fafc' }}>
                        <td style={{ padding: '0.7rem 0.5rem', fontWeight: 600, color: '#0f172a' }}>
                          {log.adminName}
                        </td>
                        <td style={{ padding: '0.7rem 0.5rem' }}>
                          <span style={{ fontSize: '0.72rem', background: '#f1f5f9', color: '#334155', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                            {log.action}
                          </span>
                        </td>
                        <td style={{ padding: '0.7rem 0.5rem', color: '#64748b' }}>
                          {log.targetType}
                        </td>
                        <td style={{ padding: '0.7rem 0.5rem', color: '#334155', maxWidth: 280, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {log.details}
                        </td>
                        <td style={{ padding: '0.7rem 0.5rem', color: '#64748b', fontSize: '0.78rem' }}>
                          {new Date(log.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
