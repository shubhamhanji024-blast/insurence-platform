'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { formatIndianCurrency } from '@/utils/sipCalculations';
import { formatRelativeTime } from '@/lib/activity';

export default function DashboardOverviewPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/dashboard');
      const result = await res.json();

      if (res.ok && result.success) {
        setData(result.data);
      } else {
        setError(result.message || 'Unable to load dashboard data.');
      }
    } catch {
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      {error ? (
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', background: '#ffffff' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚠️</div>
          <h3 style={{ color: '#e11d48', margin: '0 0 0.5rem' }}>{error}</h3>
          <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            We could not retrieve your activity metrics right now.
          </p>
          <button type="button" onClick={fetchDashboardData} className="btn btn-primary btn-sm">
            🔄 Retry
          </button>
        </div>
      ) : loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card-static" style={{ padding: '1.5rem', background: '#ffffff', minHeight: '110px' }}>
              <div style={{ width: '40%', height: '12px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '0.75rem', animation: 'pulse 1.5s infinite' }} />
              <div style={{ width: '70%', height: '24px', background: '#cbd5e1', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Summary Overview Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}
          >
            {/* Card 1: Financial Goals */}
            <div className="glass-card-static" style={{ padding: '1.35rem', background: '#ffffff', borderTop: '4px solid #19C3A3' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Financial Goals
                </span>
                <span style={{ fontSize: '1.3rem' }}>🎯</span>
              </div>
              <h3 style={{ fontSize: '1.6rem', margin: '0.2rem 0', color: 'var(--primary-900)', fontWeight: 800 }}>
                {data.goalCount > 0 ? `${data.goalCount} ${data.goalCount === 1 ? 'Goal' : 'Goals'}` : '0 Goals'}
              </h3>
              <div style={{ fontSize: '0.8rem', color: data.activeGoalCount > 0 ? '#16a34a' : 'var(--gray-500)', fontWeight: 600 }}>
                {data.activeGoalCount > 0 ? `● ${data.activeGoalCount} Active` : 'No active goals'}
              </div>
            </div>

            {/* Card 2: Saved Calculations */}
            <div className="glass-card-static" style={{ padding: '1.35rem', background: '#ffffff', borderTop: '4px solid #1e3a8a' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Saved Calculations
                </span>
                <span style={{ fontSize: '1.3rem' }}>💾</span>
              </div>
              <h3 style={{ fontSize: '1.6rem', margin: '0.2rem 0', color: 'var(--primary-900)', fontWeight: 800 }}>
                {data.savedCalculationCount > 0 ? `${data.savedCalculationCount} Saved` : '0 Saved'}
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                SIP, EMI &amp; Wealth Plans
              </div>
            </div>

            {/* Card 3: Latest Activity */}
            <div className="glass-card-static" style={{ padding: '1.35rem', background: '#ffffff', borderTop: '4px solid #f59e0b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Latest Activity
                </span>
                <span style={{ fontSize: '1.3rem' }}>📋</span>
              </div>
              <h4
                style={{
                  fontSize: '1rem',
                  margin: '0.2rem 0',
                  color: 'var(--primary-900)',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={data.recentActivities?.[0]?.description || 'No recent activity'}
              >
                {data.recentActivities?.[0]?.description || 'No recent activity'}
              </h4>
              <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                {data.recentActivities?.[0] ? formatRelativeTime(data.recentActivities[0].createdAt) : 'Start exploring'}
              </div>
            </div>

            {/* Card 4: Account Status */}
            <div className="glass-card-static" style={{ padding: '1.35rem', background: '#ffffff', borderTop: '4px solid #101b3b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Account Status
                </span>
                <span style={{ fontSize: '1.3rem' }}>🛡️</span>
              </div>
              <h3 style={{ fontSize: '1.4rem', margin: '0.2rem 0', color: 'var(--primary-900)', fontWeight: 800 }}>
                Active User
              </h3>
              <div style={{ fontSize: '0.8rem', color: data.user?.emailVerified ? '#16a34a' : '#d97706', fontWeight: 600 }}>
                {data.user?.emailVerified ? '✓ Email Verified' : '● Account Active'}
              </div>
            </div>
          </div>

          {/* Quick Actions & Feed Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem', marginBottom: '2rem' }}>
            {/* Quick Actions Card */}
            <div className="glass-card-static" style={{ padding: '1.5rem', background: '#ffffff' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ⚡ Quick Actions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link
                  href="/dashboard/goals"
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem' }}
                >
                  🎯 Create New Financial Goal
                </Link>
                <Link
                  href="/calculators/sip"
                  className="btn btn-outline"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem' }}
                >
                  📊 Open SIP Calculator
                </Link>
                <Link
                  href="/calculators"
                  className="btn btn-outline"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem' }}
                >
                  💡 Explore All Calculators
                </Link>
              </div>
            </div>

            {/* Recent Activity Stream */}
            <div className="glass-card-static" style={{ padding: '1.5rem', background: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)', margin: 0 }}>
                  🕒 Recent Activity
                </h3>
              </div>

              {!data.recentActivities || data.recentActivities.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px dashed #cbd5e1' }}>
                  <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🍃</span>
                  <p style={{ margin: '0 0 0.5rem', fontWeight: 600, color: 'var(--primary-900)' }}>
                    No recent activity yet.
                  </p>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                    Activities will automatically appear here as you save calculations or manage financial goals.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {data.recentActivities.map((act) => (
                    <div
                      key={act.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        padding: '0.75rem 0.85rem',
                        background: '#f8fafc',
                        borderRadius: 'var(--radius-md)',
                        borderLeft: '3px solid #19C3A3',
                      }}
                    >
                      <span style={{ fontSize: '1.1rem', marginTop: '0.1rem' }}>⚡</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--primary-900)' }}>
                          {act.description}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.15rem' }}>
                          {formatRelativeTime(act.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
