'use client';
import { useState } from 'react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - var(--nav-height))', background: 'var(--gray-50)' }}>
      {/* Admin Sidebar */}
      <div style={{ width: '250px', background: 'var(--primary-900)', padding: '2rem 0' }} className="hide-mobile">
        <div style={{ padding: '0 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--accent-500)', color: 'var(--primary-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
            FV
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#ffffff' }}>GrowthNest</h4>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>Admin Console</span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            { id: 'overview', icon: '📊', label: 'Overview' },
            { id: 'users', icon: '👥', label: 'Clients & Users' },
            { id: 'plans', icon: '📋', label: 'Financial Plans' },
            { id: 'services', icon: '💼', label: 'Services' },
            { id: 'appointments', icon: '📅', label: 'Appointments' },
            { id: 'reports', icon: '📑', label: 'Revenue & Reports' },
            { id: 'settings', icon: '⚙️', label: 'Settings' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '0.85rem 1.5rem',
                width: '100%',
                textAlign: 'left',
                background: activeTab === item.id ? 'rgba(212,175,55,0.15)' : 'transparent',
                borderLeft: `4px solid ${activeTab === item.id ? 'var(--accent-500)' : 'transparent'}`,
                color: activeTab === item.id ? 'var(--accent-500)' : 'rgba(255,255,255,0.7)',
                transition: 'all 0.2s',
                fontWeight: activeTab === item.id ? 600 : 400,
                borderTop: 'none', borderRight: 'none', borderBottom: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem'
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
              <h2 style={{ marginBottom: '0.25rem', color: 'var(--primary-900)' }}>Platform Overview</h2>
              <p style={{ color: 'var(--gray-500)', margin: 0 }}>System-wide statistics and client management.</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-outline btn-sm">Export Data</button>
              <button className="btn btn-primary btn-sm">+ New Client Plan</button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-4 gap-md" style={{ marginBottom: '2.5rem' }}>
            <div className="glass-card-static" style={{ padding: '1.5rem', borderTop: '3px solid var(--primary-700)' }}>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem', margin: 0, marginBottom: '0.5rem' }}>Total Users</p>
              <h3 style={{ fontSize: '2rem', marginBottom: '0.25rem', color: 'var(--primary-900)' }}>10,248</h3>
              <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>+184 this week</span>
            </div>
            <div className="glass-card-static" style={{ padding: '1.5rem', borderTop: '3px solid var(--accent-500)' }}>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem', margin: 0, marginBottom: '0.5rem' }}>Active Customers</p>
              <h3 style={{ fontSize: '2rem', marginBottom: '0.25rem', color: 'var(--primary-900)' }}>5,120</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>85% Active SIPs</span>
            </div>
            <div className="glass-card-static" style={{ padding: '1.5rem', borderTop: '3px solid #16a34a' }}>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem', margin: 0, marginBottom: '0.5rem' }}>Financial Plans</p>
              <h3 style={{ fontSize: '2rem', marginBottom: '0.25rem', color: 'var(--primary-900)' }}>3,840</h3>
              <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>+12% vs last month</span>
            </div>
            <div className="glass-card-static" style={{ padding: '1.5rem', borderTop: '3px solid #8b5cf6' }}>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem', margin: 0, marginBottom: '0.5rem' }}>AUM Managed</p>
              <h3 style={{ fontSize: '2rem', marginBottom: '0.25rem', color: 'var(--primary-900)' }}>₹100 Cr+</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Across all asset classes</span>
            </div>
          </div>

          {/* Table */}
          <div className="glass-card-static" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h4 style={{ margin: 0, color: 'var(--primary-900)' }}>Recent Client Registrations &amp; Inquiries</h4>
              <button className="btn btn-sm btn-outline">View All Clients</button>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--gray-200)', color: 'var(--gray-500)', fontSize: '0.85rem' }}>
                    <th style={{ padding: '1rem 0.5rem' }}>Client Name</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Service Requested</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Location</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Registered Date</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Status</th>
                    <th style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Sanjay Gupta', service: 'Wealth Management', loc: 'Delhi', date: 'Today, 10:30 AM', status: 'Completed' },
                    { name: 'Pooja Desai', service: 'Tax Planning', loc: 'Ahmedabad', date: 'Today, 09:15 AM', status: 'In Review' },
                    { name: 'Mohammed Ali', service: 'Retirement Planning', loc: 'Hyderabad', date: 'Yesterday', status: 'Completed' },
                    { name: 'Ritu Sharma', service: 'Financial Planning', loc: 'Pune', date: 'Yesterday', status: 'In Review' },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: 600, color: 'var(--primary-900)' }}>{row.name}</td>
                      <td style={{ padding: '1rem 0.5rem', color: 'var(--gray-700)', fontSize: '0.9rem' }}>{row.service}</td>
                      <td style={{ padding: '1rem 0.5rem', color: 'var(--gray-500)', fontSize: '0.9rem' }}>{row.loc}</td>
                      <td style={{ padding: '1rem 0.5rem', color: 'var(--gray-500)', fontSize: '0.9rem' }}>{row.date}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <span style={{ 
                          fontSize: '0.75rem', padding: '4px 10px', borderRadius: 'var(--radius-full)', 
                          background: row.status === 'Completed' ? '#dcfce7' : '#fef9c3', 
                          color: row.status === 'Completed' ? '#15803d' : '#854d0e',
                          fontWeight: 600
                        }}>
                          {row.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button style={{ padding: '4px 10px', background: 'eef2ff', color: 'var(--primary-700)', border: '1px solid var(--primary-700)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Review Plan</button>
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
