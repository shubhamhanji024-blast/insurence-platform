'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { formatIndianCurrency } from '@/utils/sipCalculations';
import { formatRelativeTime } from '@/lib/activity';

const calculatorCards = [
  {
    type: 'SIP',
    title: 'SIP Calculator',
    desc: 'Estimate how your monthly investments can grow over time with compound interest.',
    icon: '📈',
    href: '/dashboard/calculators/sip',
    color: '#19C3A3',
    btnLabel: 'Calculate SIP',
  },
  {
    type: 'EMI',
    title: 'EMI Calculator',
    desc: 'Calculate your monthly loan EMI, total interest, and repayment schedule.',
    icon: '🏠',
    href: '/dashboard/calculators/emi',
    color: '#1e3a8a',
    btnLabel: 'Calculate EMI',
  },
  {
    type: 'LUMPSUM',
    title: 'Lumpsum Calculator',
    desc: 'Project how a one-time investment grows with the power of compounding.',
    icon: '💰',
    href: '/dashboard/calculators/lumpsum',
    color: '#d4af37',
    btnLabel: 'Calculate Lumpsum',
  },
  {
    type: 'RETIREMENT',
    title: 'Retirement Calculator',
    desc: 'Plan your retirement corpus needs and estimate future savings growth.',
    icon: '🌴',
    href: '/dashboard/calculators/retirement',
    color: '#101b3b',
    btnLabel: 'Plan Retirement',
  },
];

const serviceCards = [
  {
    title: 'Financial Planning',
    desc: 'Goal-based wealth planning, cash flow structuring, and emergency fund strategy.',
    icon: '📊',
    href: '/services/financial-planning',
  },
  {
    title: 'Investment Planning',
    desc: 'Asset allocation, mutual fund curation, and portfolio rebalancing.',
    icon: '💹',
    href: '/services/investment-planning',
  },
  {
    title: 'Wealth Management',
    desc: 'HNI portfolio management, estate planning, and alternative investments.',
    icon: '🏦',
    href: '/services/wealth-management',
  },
  {
    title: 'Retirement Planning',
    desc: 'Corpus estimation, pension advisory, and tax-efficient withdrawal.',
    icon: '🛡️',
    href: '/services/retirement-planning',
  },
  {
    title: 'Tax Planning',
    desc: 'Section 80C optimization, capital gains management, and filing support.',
    icon: '📋',
    href: '/services/tax-planning',
  },
  {
    title: 'Insurance Planning',
    desc: 'Term life analysis, health insurance, and critical illness cover.',
    icon: '❤️',
    href: '/services/insurance-planning',
  },
];

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
        <DashboardSkeleton />
      ) : (
        <div className="db-dashboard-content">
          {/* Welcome Banner */}
          <div className="db-welcome-banner">
            <div className="db-welcome-left">
              <h2 className="db-welcome-title">Welcome to your Financial Dashboard</h2>
              <p className="db-welcome-text">
                Track your financial goals, run calculations, explore services, and manage your GrowthNest account — all in one place.
              </p>
              <div className="db-welcome-actions">
                <Link href="/dashboard/calculators/sip" className="btn btn-secondary btn-sm">
                  📈 Calculate SIP
                </Link>
                <Link href="/dashboard/calculators/emi" className="btn btn-outline btn-sm" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
                  🏠 Calculate EMI
                </Link>
                <Link href="/dashboard/services" className="btn btn-outline btn-sm" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
                  💼 Explore Services
                </Link>
                <Link href="/dashboard/goals" className="btn btn-outline btn-sm" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
                  🎯 Set Financial Goal
                </Link>
              </div>
            </div>
          </div>

          {/* Summary Overview Cards */}
          <div className="db-stats-grid">
            <div className="db-stat-card" style={{ borderTop: '4px solid #19C3A3' }}>
              <div className="db-stat-header">
                <span className="db-stat-label">Financial Goals</span>
                <span className="db-stat-icon">🎯</span>
              </div>
              <h3 className="db-stat-value">
                {data.goalCount > 0 ? `${data.goalCount} ${data.goalCount === 1 ? 'Goal' : 'Goals'}` : '0 Goals'}
              </h3>
              <div className="db-stat-sub" style={{ color: data.activeGoalCount > 0 ? '#16a34a' : 'var(--gray-500)' }}>
                {data.activeGoalCount > 0 ? `● ${data.activeGoalCount} Active` : 'No active goals'}
              </div>
            </div>

            <div className="db-stat-card" style={{ borderTop: '4px solid #1e3a8a' }}>
              <div className="db-stat-header">
                <span className="db-stat-label">Saved Calculations</span>
                <span className="db-stat-icon">💾</span>
              </div>
              <h3 className="db-stat-value">
                {data.savedCalculationCount > 0 ? `${data.savedCalculationCount} Saved` : '0 Saved'}
              </h3>
              <div className="db-stat-sub">SIP, EMI &amp; Wealth Plans</div>
            </div>

            <div className="db-stat-card" style={{ borderTop: '4px solid #f59e0b' }}>
              <div className="db-stat-header">
                <span className="db-stat-label">Latest Activity</span>
                <span className="db-stat-icon">📋</span>
              </div>
              <h4 className="db-stat-activity" title={data.recentActivities?.[0]?.description || 'No recent activity'}>
                {data.recentActivities?.[0]?.description || 'No recent activity'}
              </h4>
              <div className="db-stat-sub">
                {data.recentActivities?.[0] ? formatRelativeTime(data.recentActivities[0].createdAt) : 'Start exploring'}
              </div>
            </div>

            <div className="db-stat-card" style={{ borderTop: '4px solid #101b3b' }}>
              <div className="db-stat-header">
                <span className="db-stat-label">Account Status</span>
                <span className="db-stat-icon">🛡️</span>
              </div>
              <h3 className="db-stat-value" style={{ fontSize: '1.4rem' }}>Active User</h3>
              <div className="db-stat-sub" style={{ color: data.user?.emailVerified ? '#16a34a' : '#d97706', fontWeight: 600 }}>
                {data.user?.emailVerified ? '✓ Email Verified' : '● Account Active'}
              </div>
            </div>
          </div>

          {/* Profile Summary Card */}
          <div className="db-section-row">
            <div className="db-section-card" style={{ flex: '1 1 320px' }}>
              <h3 className="db-section-title">👤 Profile Summary</h3>
              <div className="db-profile-summary">
                <div className="db-profile-avatar-lg">
                  {data.user?.fullName
                    ? data.user.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
                    : 'GN'}
                </div>
                <div className="db-profile-details">
                  <div className="db-profile-detail-row">
                    <span className="db-profile-detail-label">Name</span>
                    <span className="db-profile-detail-value">{data.user?.fullName || 'N/A'}</span>
                  </div>
                  <div className="db-profile-detail-row">
                    <span className="db-profile-detail-label">Email</span>
                    <span className="db-profile-detail-value">{data.user?.email || 'N/A'}</span>
                  </div>
                  <div className="db-profile-detail-row">
                    <span className="db-profile-detail-label">Member Since</span>
                    <span className="db-profile-detail-value">
                      {data.user?.createdAt
                        ? new Date(data.user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="db-profile-detail-row">
                    <span className="db-profile-detail-label">Phone</span>
                    <span className="db-profile-detail-value">{data.user?.phone || 'Not provided'}</span>
                  </div>
                </div>
                <Link href="/dashboard/profile" className="btn btn-outline btn-sm" style={{ marginTop: '0.75rem', width: '100%', justifyContent: 'center' }}>
                  View Full Profile →
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="db-section-card" style={{ flex: '1 1 320px' }}>
              <h3 className="db-section-title">🕒 Recent Activity</h3>
              {!data.recentActivities || data.recentActivities.length === 0 ? (
                <div className="db-empty-state">
                  <span className="db-empty-icon">🍃</span>
                  <p className="db-empty-title">No recent activity yet.</p>
                  <p className="db-empty-desc">
                    Activities will appear here as you save calculations or manage financial goals.
                  </p>
                </div>
              ) : (
                <div className="db-activity-list">
                  {data.recentActivities.map((act) => (
                    <div key={act.id} className="db-activity-item">
                      <span className="db-activity-dot">⚡</span>
                      <div style={{ flex: 1 }}>
                        <div className="db-activity-desc">{act.description}</div>
                        <div className="db-activity-time">{formatRelativeTime(act.createdAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Financial Calculators */}
          <div className="db-section">
            <div className="db-section-header">
              <h3 className="db-section-title" style={{ margin: 0 }}>🧮 Financial Calculators</h3>
              <Link href="/dashboard/calculators" className="db-section-link">View All →</Link>
            </div>
            <div className="db-calculator-grid">
              {calculatorCards.map((calc) => (
                <div key={calc.type} className="db-calculator-card" style={{ borderLeft: `4px solid ${calc.color}` }}>
                  <div className="db-calculator-header">
                    <span className="db-calculator-icon">{calc.icon}</span>
                    <h4 className="db-calculator-title">{calc.title}</h4>
                  </div>
                  <p className="db-calculator-desc">{calc.desc}</p>
                  <Link href={calc.href} className="btn btn-outline btn-sm db-calculator-btn">
                    {calc.btnLabel} →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Services Overview */}
          <div className="db-section">
            <div className="db-section-header">
              <h3 className="db-section-title" style={{ margin: 0 }}>💼 Financial Services</h3>
              <Link href="/dashboard/services" className="db-section-link">Explore All →</Link>
            </div>
            <div className="db-services-grid">
              {serviceCards.map((svc) => (
                <div key={svc.title} className="db-service-card">
                  <span className="db-service-icon">{svc.icon}</span>
                  <h4 className="db-service-title">{svc.title}</h4>
                  <p className="db-service-desc">{svc.desc}</p>
                  <Link href={svc.href} className="db-service-link">
                    Learn More →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Goals Summary */}
          <div className="db-section-row">
            <div className="db-section-card" style={{ flex: '1 1 320px' }}>
              <div className="db-section-header">
                <h3 className="db-section-title" style={{ margin: 0 }}>🎯 Financial Goals</h3>
                <Link href="/dashboard/goals" className="db-section-link">Manage →</Link>
              </div>
              {data.goalCount === 0 ? (
                <div className="db-empty-state">
                  <span className="db-empty-icon">🎯</span>
                  <p className="db-empty-title">No financial goals yet</p>
                  <p className="db-empty-desc">Set your first goal to start tracking your financial progress.</p>
                  <Link href="/dashboard/goals" className="btn btn-primary btn-sm">Create Your First Goal</Link>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-900)' }}>{data.goalCount}</div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--gray-600)' }}>
                    Total {data.goalCount === 1 ? 'Goal' : 'Goals'} · {data.activeGoalCount} Active
                  </div>
                  <Link href="/dashboard/goals" className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>
                    View All Goals →
                  </Link>
                </div>
              )}
            </div>

            <div className="db-section-card" style={{ flex: '1 1 320px' }}>
              <div className="db-section-header">
                <h3 className="db-section-title" style={{ margin: 0 }}>💾 Saved Calculations</h3>
                <Link href="/dashboard/calculations" className="db-section-link">View All →</Link>
              </div>
              {data.savedCalculationCount === 0 ? (
                <div className="db-empty-state">
                  <span className="db-empty-icon">💾</span>
                  <p className="db-empty-title">No saved calculations yet</p>
                  <p className="db-empty-desc">Run a calculator and save results to view them here anytime.</p>
                  <Link href="/dashboard/calculators" className="btn btn-primary btn-sm">Open Calculators</Link>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-900)' }}>{data.savedCalculationCount}</div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--gray-600)' }}>
                    Saved {data.savedCalculationCount === 1 ? 'Calculation' : 'Calculations'}
                  </div>
                  <Link href="/dashboard/calculations" className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>
                    View Saved Calculations →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Financial Planning Tips */}
          <div className="db-section">
            <h3 className="db-section-title">💡 Financial Planning Tips</h3>
            <div className="db-tips-grid">
              <div className="db-tip-card">
                <div className="db-tip-number">01</div>
                <h4 className="db-tip-title">Start SIP Early</h4>
                <p className="db-tip-desc">Even ₹500/month through SIP can grow significantly over 15-20 years thanks to compounding. The earlier you start, the more time your money has to grow.</p>
              </div>
              <div className="db-tip-card">
                <div className="db-tip-number">02</div>
                <h4 className="db-tip-title">Emergency Fund First</h4>
                <p className="db-tip-desc">Build a 6-12 month emergency fund in liquid assets before investing aggressively. This protects your long-term investments from forced withdrawals.</p>
              </div>
              <div className="db-tip-card">
                <div className="db-tip-number">03</div>
                <h4 className="db-tip-title">Diversify Investments</h4>
                <p className="db-tip-desc">Don&apos;t put all your money in one asset class. Spread across equity, debt, and gold to reduce risk while maintaining growth potential.</p>
              </div>
              <div className="db-tip-card">
                <div className="db-tip-number">04</div>
                <h4 className="db-tip-title">Review Goals Annually</h4>
                <p className="db-tip-desc">Life changes — and so should your financial plan. Review your goals, insurance coverage, and investment allocation at least once a year.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function DashboardSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Welcome banner skeleton */}
      <div style={{ height: '160px', background: 'linear-gradient(135deg, #101b3b 0%, #1e3a8a 100%)', borderRadius: 'var(--radius-xl)', animation: 'pulse 1.5s infinite' }} />
      {/* Stats skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card-static" style={{ padding: '1.5rem', background: '#ffffff', minHeight: '110px' }}>
            <div style={{ width: '40%', height: '12px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '0.75rem', animation: 'pulse 1.5s infinite' }} />
            <div style={{ width: '70%', height: '24px', background: '#cbd5e1', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
          </div>
        ))}
      </div>
      {/* Cards skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {[1, 2].map((i) => (
          <div key={i} className="glass-card-static" style={{ padding: '1.5rem', background: '#ffffff', minHeight: '200px', animation: 'pulse 1.5s infinite' }} />
        ))}
      </div>
    </div>
  );
}
