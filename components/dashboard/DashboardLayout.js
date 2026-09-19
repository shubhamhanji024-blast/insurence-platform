'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const navSections = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    ],
  },
  {
    label: 'Calculators',
    items: [
      { label: 'All Calculators', href: '/dashboard/calculators', icon: '🧮' },
      { label: 'SIP Calculator', href: '/dashboard/calculators/sip', icon: '📈' },
      { label: 'EMI Calculator', href: '/dashboard/calculators/emi', icon: '🏠' },
      { label: 'Lumpsum Calculator', href: '/dashboard/calculators/lumpsum', icon: '💰' },
      { label: 'Retirement Calculator', href: '/dashboard/calculators/retirement', icon: '🌴' },
    ],
  },
  {
    label: 'Financial',
    items: [
      { label: 'Financial Services', href: '/dashboard/services', icon: '💼' },
      { label: 'Investment Planning', href: '/dashboard/services#investment-planning', icon: '📊' },
      { label: 'Financial Goals', href: '/dashboard/goals', icon: '🎯' },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'My Profile', href: '/dashboard/profile', icon: '👤' },
      { label: 'Saved Calculations', href: '/dashboard/calculations', icon: '💾' },
      { label: 'Contact Support', href: '/dashboard/support', icon: '📞' },
    ],
  },
];

export default function DashboardLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirectTo=${encodeURIComponent(pathname || '/dashboard')}`);
    }
  }, [user, loading, router, pathname]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileDropdownOpen(false);
  }, [pathname]);

  // Close profile dropdown on outside click
  useEffect(() => {
    if (!profileDropdownOpen) return;
    const handler = (e) => {
      if (!e.target.closest('.db-profile-dropdown')) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [profileDropdownOpen]);

  if (loading) {
    return (
      <div className="db-loading-screen">
        <div className="text-center">
          <div className="db-spinner" />
          <p style={{ color: 'var(--gray-600)', fontSize: '0.95rem' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const firstName = user.fullName ? user.fullName.split(' ')[0] : 'User';
  const userInitials = user.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'GN';

  const isActive = (href) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    if (href.includes('#')) return pathname === href.split('#')[0];
    return pathname.startsWith(href);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="db-wrapper">
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="db-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`db-sidebar${mobileOpen ? ' db-sidebar-open' : ''}`}>
        {/* Sidebar Header */}
        <div className="db-sidebar-header">
          <Link href="/dashboard" className="db-sidebar-logo">
            <div className="db-sidebar-logo-icon">🌱</div>
            <span className="db-sidebar-logo-text">GrowthNest</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="db-sidebar-close mobile-only"
          >
            ✕
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="db-sidebar-nav">
          {navSections.map((section) => (
            <div key={section.label} className="db-nav-section">
              <div className="db-nav-section-label">{section.label}</div>
              <ul className="db-nav-list">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`db-nav-item${active ? ' db-nav-item-active' : ''}`}
                      >
                        <span className="db-nav-icon">{item.icon}</span>
                        <span className="db-nav-label">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="db-sidebar-footer">
          <div className="db-sidebar-user">
            <div className="db-avatar db-avatar-sm">{userInitials}</div>
            <div className="db-sidebar-user-info">
              <div className="db-sidebar-user-name">{user.fullName}</div>
              <div className="db-sidebar-user-email">{user.email}</div>
            </div>
          </div>
          <button type="button" onClick={() => logout()} className="db-logout-btn">
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Right Content Area */}
      <div className="db-content-wrapper">
        {/* Top Header */}
        <header className="db-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open mobile menu"
              className="db-hamburger mobile-only"
            >
              ☰
            </button>
            <div>
              <h1 className="db-header-title">
                {getGreeting()}, {firstName} 👋
              </h1>
              <p className="db-header-subtitle">
                Here is an overview of your financial planning activity.
              </p>
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="db-profile-dropdown" style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="db-profile-btn"
            >
              <div className="db-avatar db-avatar-header">{userInitials}</div>
              <span className="db-profile-name hide-mobile">{firstName}</span>
              <span className="db-profile-chevron">▼</span>
            </button>

            {profileDropdownOpen && (
              <div className="db-profile-menu">
                <div className="db-profile-menu-header">
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-900)' }}>{user.fullName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                </div>
                <Link href="/dashboard/profile" onClick={() => setProfileDropdownOpen(false)} className="db-profile-menu-item">
                  👤 Profile Details
                </Link>
                <Link href="/dashboard/calculations" onClick={() => setProfileDropdownOpen(false)} className="db-profile-menu-item">
                  💾 Saved Calculations
                </Link>
                <Link href="/" onClick={() => setProfileDropdownOpen(false)} className="db-profile-menu-item">
                  🏠 Back to Website
                </Link>
                <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '0.35rem' }} />
                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                  }}
                  className="db-profile-menu-item db-profile-menu-logout"
                >
                  🚪 Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="db-main">
          {children}
        </main>
      </div>
    </div>
  );
}
