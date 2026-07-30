'use client';
import { useState } from 'react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - var(--nav-height))', background: 'var(--bg-primary)' }}>
      {/* Admin Sidebar */}
      <div style={{ width: '250px', background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-glass)', padding: '2rem 0' }} className="hide-mobile">
        <div style={{ padding: '0 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#dc3545', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
            A
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Admin Console</h4>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Super Admin</span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            { id: 'overview', icon: '📈', label: 'Overview' },
            { id: 'users', icon: '👥', label: 'Manage Advisors' },
            { id: 'leads', icon: '🎯', label: 'Lead Pipeline' },
            { id: 'training', icon: '📚', label: 'Training Content' },
            { id: 'events', icon: '📅', label: 'Events Manager' },
            { id: 'blog', icon: '✍️', label: 'Blog Posts' },
            { id: 'reports', icon: '📊', label: 'Income Reports' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '1rem 1.5rem',
                width: '100%',
                textAlign: 'left',
                background: activeTab === item.id ? 'rgba(220, 53, 69, 0.1)' : 'transparent',
                borderLeft: `4px solid ${activeTab === item.id ? '#dc3545' : 'transparent'}`,
                color: activeTab === item.id ? '#dc3545' : 'var(--text-secondary)',
                transition: 'all 0.2s',
                fontWeight: activeTab === item.id ? 600 : 400,
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ marginBottom: '0.25rem' }}>Platform Overview</h2>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>System-wide statistics and management.</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-secondary btn-sm" style={{ borderColor: '#dc3545', color: '#dc3545' }}>System Settings</button>
              <button className="btn btn-primary btn-sm" style={{ background: '#dc3545', boxShadow: 'none' }}>+ New Broadcast</button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-4 gap-md" style={{ marginBottom: '2.5rem' }}>
            <div className="glass-card-static" style={{ padding: '1.5rem', borderTop: '3px solid var(--primary)' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0, marginBottom: '0.5rem' }}>Total Active Advisors</p>
              <h3 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>5,248</h3>
              <span style={{ fontSize: '0.75rem', color: '#25D366' }}>+124 this week</span>
            </div>
            <div className="glass-card-static" style={{ padding: '1.5rem', borderTop: '3px solid var(--accent)' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0, marginBottom: '0.5rem' }}>Pending Approvals</p>
              <h3 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>42</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Require document check</span>
            </div>
            <div className="glass-card-static" style={{ padding: '1.5rem', borderTop: '3px solid var(--secondary)' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0, marginBottom: '0.5rem' }}>Monthly Premium (Est)</p>
              <h3 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>₹4.2 Cr</h3>
              <span style={{ fontSize: '0.75rem', color: '#25D366' }}>+8% vs last month</span>
            </div>
            <div className="glass-card-static" style={{ padding: '1.5rem', borderTop: '3px solid #ff6384' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0, marginBottom: '0.5rem' }}>New Leads Generated</p>
              <h3 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>1,850</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Across all channels</span>
            </div>
          </div>

          {/* Pending Approvals Table */}
          <div className="glass-card-static" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h4 style={{ margin: 0 }}>Recent Applications (Requires Action)</h4>
              <button className="btn btn-sm btn-glass">View All</button>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <th style={{ padding: '1rem 0.5rem' }}>Applicant Name</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Location</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Experience</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Applied On</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Docs Status</th>
                    <th style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Sanjay Gupta', loc: 'Delhi', exp: '3-5 years', date: 'Today, 10:30 AM', docs: 'Complete' },
                    { name: 'Pooja Desai', loc: 'Ahmedabad', exp: 'Fresher', date: 'Today, 09:15 AM', docs: 'Pending PAN' },
                    { name: 'Mohammed Ali', loc: 'Hyderabad', exp: '1-3 years', date: 'Yesterday', docs: 'Complete' },
                    { name: 'Ritu Sharma', loc: 'Pune', exp: '10+ years', date: 'Yesterday', docs: 'Complete' },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>{row.name}</td>
                      <td style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{row.loc}</td>
                      <td style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{row.exp}</td>
                      <td style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{row.date}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <span style={{ 
                          fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', 
                          background: row.docs === 'Complete' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)', 
                          color: row.docs === 'Complete' ? '#4caf50' : '#ff9800' 
                        }}>
                          {row.docs}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button style={{ padding: '4px 10px', background: 'rgba(76, 175, 80, 0.15)', color: '#4caf50', border: '1px solid #4caf50', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Approve</button>
                          <button style={{ padding: '4px 10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)', borderRadius: '4px', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.8rem' }}>Review</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
