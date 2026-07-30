'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { events } from '@/data/events';

export default function UserDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [time, setTime] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const now = new Date();
    const hr = now.getHours();
    const greeting = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
    setTime(greeting);
    setDateStr(now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  const navItems = [
    { id: 'overview', icon: '📊', label: 'Dashboard' },
    { id: 'leads', icon: '👥', label: 'My Leads' },
    { id: 'training', icon: '🎓', label: 'Training Portal' },
    { id: 'certificates', icon: '📜', label: 'Certificates' },
    { id: 'earnings', icon: '💰', label: 'Earnings' },
    { id: 'appointments', icon: '📅', label: 'Appointments' },
  ];

  const quickStats = [
    { icon: '👥', label: 'Active Leads', value: '24', delta: '+12%', deltaColor: '#25D366', color: 'var(--primary)', sparkline: [30, 45, 40, 60, 55, 75, 90] },
    { icon: '💰', label: "This Month's Income", value: '₹45,200', delta: '+5.2%', deltaColor: '#25D366', color: 'var(--accent)', sparkline: [40, 50, 45, 65, 70, 80, 95] },
    { icon: '🎓', label: 'Training Progress', value: '85%', delta: '2 Pending', deltaColor: 'var(--text-muted)', color: 'var(--secondary)', sparkline: [60, 65, 70, 72, 75, 80, 85] },
    { icon: '📅', label: 'Appointments', value: '3', delta: 'Today', deltaColor: 'var(--text-muted)', color: '#ff6384', sparkline: [5, 3, 6, 4, 7, 5, 3] },
  ];

  const recentLeads = [
    { name: 'Amit Kumar', policy: 'Term Life', status: 'Interested', color: '#ffc107' },
    { name: 'Priya Singh', policy: 'Health Ins.', status: 'Meeting Set', color: '#2196f3' },
    { name: 'Rahul Sharma', policy: 'ULIP', status: 'Converted', color: '#4caf50' },
    { name: 'Neha Gupta', policy: 'Term Life', status: 'New', color: '#9e9e9e' },
    { name: 'Suresh Yadav', policy: 'Endowment', status: 'Follow-up', color: '#ff9800' },
  ];

  const activityFeed = [
    { dot: '', msg: 'New lead Priya Singh added via referral', time: '10 min ago' },
    { dot: 'yellow', msg: 'Commission ₹3,200 credited for LIC Term policy', time: '1 hr ago' },
    { dot: 'purple', msg: 'Training Module 3 completed — 85% overall', time: '3 hrs ago' },
    { dot: 'red', msg: 'Appointment rescheduled — Amit Kumar at 4PM', time: 'Yesterday' },
    { dot: '', msg: 'New event: Insurance Sales Masterclass — Aug 15', time: 'Yesterday' },
  ];

  const quickActions = [
    { icon: '➕', label: 'Add Lead', bg: 'rgba(0,212,170,0.15)' },
    { icon: '📅', label: 'Schedule Call', bg: 'rgba(108,99,255,0.15)' },
    { icon: '🎓', label: 'Continue Training', bg: 'rgba(255,215,0,0.15)' },
    { icon: '📄', label: 'Generate Quote', bg: 'rgba(255,99,132,0.15)' },
    { icon: '🔗', label: 'Share Referral', bg: 'rgba(37,211,102,0.15)' },
    { icon: '📊', label: 'View Report', bg: 'rgba(0,212,170,0.1)' },
  ];

  const upcomingEvents = events.slice(0, 2);

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - var(--nav-height))', background: 'var(--bg-primary)' }}>
      {/* ---- Sidebar ---- */}
      <aside className="dashboard-sidebar hide-mobile">
        <div className="sidebar-user">
          <div className="sidebar-avatar">S</div>
          <div>
            <div className="sidebar-name">Shubham K.</div>
            <span className="badge badge-accent" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>🥇 Gold Advisor</span>
          </div>
        </div>

        <div className="sidebar-progress-wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Profile Complete</span>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>92%</span>
          </div>
          <div className="progress-bar-container" style={{ height: '6px' }}>
            <div className="progress-bar-fill" style={{ width: '92%' }} />
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              {item.label}
              {item.id === 'leads' && <span className="sidebar-badge">24</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link href="/" className="sidebar-nav-item" style={{ color: 'var(--text-muted)' }}>
            <span className="sidebar-nav-icon">🏠</span>
            Back to Site
          </Link>
        </div>
      </aside>

      {/* ---- Main Content ---- */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', maxWidth: 'calc(100% - 250px)' }}>
        {/* Header */}
        <div className="dash-header">
          <div>
            <h2 style={{ marginBottom: '0.25rem' }}>
              {time || 'Welcome back'}, Shubham! 👋
            </h2>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
              {dateStr}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary btn-sm">📄 Generate Quote</button>
            <button className="btn btn-primary btn-sm">➕ New Lead</button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-grid" style={{ marginBottom: '2rem' }}>
          {quickActions.map((a, i) => (
            <button key={i} className="quick-action-btn">
              <div className="quick-action-icon" style={{ background: a.bg }}>{a.icon}</div>
              <span>{a.label}</span>
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="dash-stats-grid" style={{ marginBottom: '2rem' }}>
          {quickStats.map((stat, i) => (
            <div key={i} className="glass-card-static dash-stat-card card-hover-glow">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div className="quick-action-icon" style={{ background: `${stat.color}15`, color: stat.color }}>{stat.icon}</div>
                <span style={{ fontSize: '0.8rem', color: stat.deltaColor, fontWeight: 600 }}>{stat.delta}</span>
              </div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '0.25rem', fontFamily: 'var(--font-display)' }}>{stat.value}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>{stat.label}</p>
              <div className="sparkline" style={{ marginTop: '0.75rem' }}>
                {stat.sparkline.map((h, j) => (
                  <div key={j} className={`sparkline-bar ${j === 6 ? 'highlight' : ''}`}
                    style={{ height: `${h}%`, background: j === 6 ? stat.color : undefined }} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="dash-main-grid">
          {/* Recent Leads */}
          <div className="glass-card-static" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h4 style={{ margin: 0 }}>Recent Leads</h4>
              <a href="#" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 500 }}>View All →</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {recentLeads.map((lead, i) => (
                <div key={i} className="lead-row">
                  <div className="lead-dot" style={{ background: lead.color }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 500, fontSize: '0.9rem' }}>{lead.name}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lead.policy}</p>
                  </div>
                  <span className="lead-status-chip" style={{ background: `${lead.color}20`, color: lead.color, borderColor: `${lead.color}40` }}>
                    {lead.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Performance Chart */}
            <div className="glass-card-static" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h4 style={{ margin: 0 }}>Weekly Performance</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>This Week</span>
              </div>
              <div style={{ height: '120px', display: 'flex', alignItems: 'flex-end', gap: '6px', padding: '0 4px', position: 'relative' }}>
                {/* Y-axis guide lines */}
                {[25, 50, 75, 100].map(pct => (
                  <div key={pct} style={{
                    position: 'absolute', left: 0, right: 0,
                    bottom: `${pct}%`, height: '1px',
                    background: 'var(--border-glass)',
                    zIndex: 0,
                  }} />
                ))}
                {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                  <div key={i} style={{ flex: 1, position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{
                      width: '100%',
                      height: `${h}%`,
                      background: i === 5 ? 'linear-gradient(to top, var(--primary), rgba(0,212,170,0.4))' : 'var(--bg-tertiary)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.5s ease',
                    }} />
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Referral Link */}
            <div className="glass-card-static" style={{ padding: '1.5rem', borderLeft: '3px solid var(--accent)' }}>
              <h4 style={{ margin: 0, marginBottom: '0.4rem', color: 'var(--accent)' }}>🔗 Your Referral Link</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Earn ₹2,000 for every advisor who joins through your link.</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" readOnly value="growthnest.com/join?ref=SHUB123" className="form-input" style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.82rem' }} />
                <button className="btn btn-secondary btn-sm">Copy</button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid: Activity + Upcoming Events */}
        <div className="dash-bottom-grid" style={{ marginTop: '1.5rem' }}>
          {/* Activity Feed */}
          <div className="glass-card-static" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h4 style={{ margin: 0 }}>Recent Activity</h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Last 24 hours</span>
            </div>
            {activityFeed.map((a, i) => (
              <div key={i} className="activity-item">
                <div className={`activity-dot ${a.dot}`} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{a.msg}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming Events */}
          <div className="glass-card-static" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h4 style={{ margin: 0 }}>Upcoming Events</h4>
              <Link href="/events" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 500 }}>View All →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {upcomingEvents.map((ev, i) => (
                <div key={i} className="event-mini-card">
                  <div className="event-mini-emoji">{ev.image}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{ev.title}</p>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      📅 {new Date(ev.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} &nbsp;·&nbsp; {ev.mode}
                    </p>
                  </div>
                  <span className={`badge ${ev.mode === 'Online' ? 'badge-secondary' : 'badge-primary'}`} style={{ fontSize: '0.65rem' }}>
                    {ev.spotsLeft} left
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        /* Sidebar */
        .dashboard-sidebar {
          width: 250px;
          flex-shrink: 0;
          background: var(--bg-secondary);
          border-right: 1px solid var(--border-glass);
          padding: 2rem 0;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 1.5rem 1.5rem;
          border-bottom: 1px solid var(--border-glass);
          margin-bottom: 1rem;
        }

        .sidebar-avatar {
          width: 44px; height: 44px;
          border-radius: 50%;
          background: var(--gradient-primary);
          color: var(--bg-primary);
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 1.2rem;
          flex-shrink: 0;
        }

        .sidebar-name { font-weight: 600; font-size: 0.95rem; margin-bottom: 4px; }

        .sidebar-progress-wrap {
          padding: 0 1.5rem;
          margin-bottom: 1rem;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          padding: 0 0.75rem;
          flex: 1;
        }

        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0.75rem 0.75rem;
          width: 100%;
          text-align: left;
          background: transparent;
          border: none;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          transition: all 0.2s;
          font-weight: 400;
          font-size: 0.9rem;
          cursor: pointer;
          font-family: inherit;
          text-decoration: none;
          position: relative;
        }

        .sidebar-nav-item:hover {
          background: rgba(255,255,255,0.04);
          color: var(--text-primary);
        }

        .sidebar-nav-item.active {
          background: rgba(0,212,170,0.1);
          color: var(--primary);
          font-weight: 600;
          border-left: 3px solid var(--primary);
          padding-left: calc(0.75rem - 3px);
        }

        .sidebar-nav-icon { font-size: 1.1rem; width: 22px; text-align: center; flex-shrink: 0; }

        .sidebar-badge {
          margin-left: auto;
          background: var(--primary);
          color: var(--bg-primary);
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 100px;
        }

        .sidebar-footer {
          padding: 0.75rem;
          border-top: 1px solid var(--border-glass);
          margin-top: auto;
        }

        /* Dashboard Layout */
        .dash-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 0.75rem;
        }

        .dash-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        .dash-stat-card {
          padding: 1.25rem;
        }

        .dash-main-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .dash-bottom-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        /* Lead Row */
        .lead-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0.6rem 0.75rem;
          background: var(--bg-tertiary);
          border-radius: var(--radius-sm);
          transition: background var(--transition-fast);
        }

        .lead-row:hover { background: rgba(255,255,255,0.04); }

        .lead-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .lead-status-chip {
          font-size: 0.7rem;
          padding: 2px 8px;
          border-radius: 4px;
          border: 1px solid;
          font-weight: 600;
          white-space: nowrap;
        }

        /* Event Mini Card */
        .event-mini-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0.75rem;
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
          transition: background var(--transition-fast);
        }
        .event-mini-card:hover { background: rgba(0,212,170,0.05); }

        .event-mini-emoji {
          width: 40px; height: 40px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-sm);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem;
          flex-shrink: 0;
        }

        @media (max-width: 1024px) {
          .quick-actions-grid { grid-template-columns: repeat(3, 1fr); }
          .dash-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .dash-main-grid { grid-template-columns: 1fr; }
          .dash-bottom-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
