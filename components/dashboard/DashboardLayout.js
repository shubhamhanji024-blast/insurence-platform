'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const sidebarNavItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Financial Overview', href: '/dashboard#financial-overview', icon: '📈' },
  { label: 'Calculators', href: '/dashboard/calculators', icon: '🧮' },
  { label: 'My Goals', href: '/dashboard/goals', icon: '🎯' },
  { label: 'My Plans', href: '/dashboard/plans', icon: '📋' },
  { label: 'Appointments', href: '/dashboard/appointments', icon: '📅' },
  { label: 'Contact Advisor', href: '/dashboard/support', icon: '💬' },
  { label: 'Insights', href: '/blog', icon: '💡' },
  { label: 'Profile', href: '/dashboard/profile', icon: '👤' },
  { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
];

export default function DashboardLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Authentication guard
  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirectTo=${encodeURIComponent(pathname || '/dashboard')}`);
    }
  }, [user, loading, router, pathname]);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user) return;
    try {
      setLoadingNotifs(true);
      const res = await fetch('/api/user/notifications');
      const data = await res.json();
      if (res.ok && data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // ignore network hiccups
    } finally {
      setLoadingNotifs(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Close dropdowns on route changes
  useEffect(() => {
    setMobileOpen(false);
    setProfileDropdownOpen(false);
    setNotifDropdownOpen(false);
  }, [pathname]);

  // Close on outside clicks
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch('/api/user/notifications', { method: 'PUT' });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('[Mark all read error]:', err);
    }
  };

  const handleMarkSingleRead = async (id, link) => {
    try {
      await fetch(`/api/user/notifications/${id}`, { method: 'PUT' });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      if (link) {
        setNotifDropdownOpen(false);
        router.push(link);
      }
    } catch (err) {
      console.error('[Mark single read error]:', err);
    }
  };

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

  const displayName = user.fullName || 'User';
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
    if (href.startsWith('/dashboard#')) return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  // Quick search filter options
  const searchOptions = [
    { title: 'SIP Calculator', url: '/dashboard/calculators/sip', tag: 'Calculator' },
    { title: 'EMI Calculator', url: '/dashboard/calculators/emi', tag: 'Calculator' },
    { title: 'Lumpsum Calculator', url: '/dashboard/calculators/lumpsum', tag: 'Calculator' },
    { title: 'Retirement Calculator', url: '/dashboard/calculators/retirement', tag: 'Calculator' },
    { title: 'My Financial Goals', url: '/dashboard/goals', tag: 'Goals' },
    { title: 'Appointments', url: '/dashboard/appointments', tag: 'Service' },
    { title: 'Financial Plans', url: '/dashboard/plans', tag: 'Planning' },
    { title: 'Contact Advisor', url: '/dashboard/support', tag: 'Help' },
    { title: 'Profile Settings', url: '/dashboard/profile', tag: 'Account' },
  ].filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase().trim()));

  return (
    <div className="db-wrapper">
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="db-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* LEFT SIDEBAR */}
      <aside className={`db-sidebar${mobileOpen ? ' db-sidebar-open' : ''}`}>
        {/* GrowthNest Logo */}
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

        {/* Sidebar Navigation Items */}
        <nav className="db-sidebar-nav" style={{ flex: 1, overflowY: 'auto' }}>
          <div className="db-nav-section">
            <div className="db-nav-section-label">Navigation</div>
            <ul className="db-nav-list">
              {sidebarNavItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.label}>
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
        </nav>

        {/* Sidebar Footer with Logout */}
        <div className="db-sidebar-footer">
          <div className="db-sidebar-user">
            <div className="db-avatar db-avatar-sm">{userInitials}</div>
            <div className="db-sidebar-user-info">
              <div className="db-sidebar-user-name">{displayName}</div>
              <div className="db-sidebar-user-email">{user.email}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => logout('/')}
            className="db-logout-btn"
            title="Log out and return to home page"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <div className="db-content-wrapper">
        {/* TOP NAVBAR */}
        <header className="db-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.5rem', background: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 50 }}>
          {/* Left: Hamburger & Welcome Message */}
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
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                Welcome back, {displayName}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }} className="hide-mobile">
                Financial Management Portal
              </div>
            </div>
          </div>

          {/* Center / Right: Search, Notifications, Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }} className="hide-mobile">
              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '20px', padding: '0.35rem 0.85rem', width: '220px' }}>
                <span style={{ fontSize: '0.85rem', marginRight: '0.4rem', opacity: 0.6 }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.82rem', width: '100%', color: '#0f172a' }}
                />
              </div>

              {/* Search Dropdown Results */}
              {searchFocused && searchQuery.trim().length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#ffffff', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', borderRadius: '10px', marginTop: '6px', border: '1px solid #e2e8f0', zIndex: 100, overflow: 'hidden' }}>
                  {searchOptions.length === 0 ? (
                    <div style={{ padding: '0.75rem', fontSize: '0.8rem', color: 'var(--gray-500)', textAlign: 'center' }}>
                      No matching tools found
                    </div>
                  ) : (
                    searchOptions.map((opt) => (
                      <Link
                        key={opt.title}
                        href={opt.url}
                        className="search-result-item"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.85rem', fontSize: '0.82rem', color: 'var(--primary-900)', textDecoration: 'none', borderBottom: '1px solid #f1f5f9' }}
                      >
                        <span>{opt.title}</span>
                        <span style={{ fontSize: '0.68rem', background: '#e0f2fe', color: '#0369a1', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                          {opt.tag}
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button
                type="button"
                onClick={() => {
                  setNotifDropdownOpen(!notifDropdownOpen);
                  if (!notifDropdownOpen) fetchNotifications();
                }}
                style={{ position: 'relative', background: '#f1f5f9', border: 'none', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.1rem' }}
                aria-label="Notifications"
              >
                🔔
                {unreadCount > 0 && (
                  <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: '#e11d48', color: '#fff', fontSize: '0.65rem', fontWeight: 700, borderRadius: '10px', padding: '0.1rem 0.35rem', border: '2px solid #fff' }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Popover */}
              {notifDropdownOpen && (
                <div style={{ position: 'absolute', right: 0, top: '48px', width: '320px', maxWidth: '90vw', background: '#ffffff', borderRadius: '12px', boxShadow: '0 12px 30px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0', zIndex: 110, overflow: 'hidden' }}>
                  <div style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--primary-900)' }}>
                      Notifications {unreadCount > 0 && `(${unreadCount})`}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={handleMarkAllRead}
                        style={{ border: 'none', background: 'transparent', color: '#0284c7', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {loadingNotifs ? (
                      <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--gray-500)', fontSize: '0.82rem' }}>
                        Loading updates...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--gray-500)', fontSize: '0.82rem' }}>
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleMarkSingleRead(notif.id, notif.link)}
                          style={{
                            padding: '0.75rem 1rem',
                            borderBottom: '1px solid #f8fafc',
                            background: notif.read ? '#ffffff' : '#f0f9ff',
                            cursor: 'pointer',
                            transition: 'background 0.15s',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: notif.read ? 600 : 700, color: notif.read ? 'var(--gray-700)' : '#0369a1' }}>
                              {notif.title}
                            </span>
                            {!notif.read && (
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7' }} />
                            )}
                          </div>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--gray-600)', lineHeight: 1.4 }}>
                            {notif.message}
                          </p>
                          <div style={{ fontSize: '0.68rem', color: 'var(--gray-400)', marginTop: '0.3rem' }}>
                            {new Date(notif.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Dropdown */}
            <div style={{ position: 'relative' }} ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="db-profile-btn"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.2rem' }}
              >
                <div className="db-avatar db-avatar-header" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #101b3b 0%, #1e3a8a 100%)', color: '#19C3A3', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {userInitials}
                </div>
                <span className="db-profile-name hide-mobile" style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--primary-900)' }}>
                  {displayName}
                </span>
                <span className="db-profile-chevron" style={{ fontSize: '0.7rem', color: 'var(--gray-500)' }}>
                  ▼
                </span>
              </button>

              {profileDropdownOpen && (
                <div className="db-profile-menu" style={{ position: 'absolute', right: 0, top: '48px', width: '220px', background: '#ffffff', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0', zIndex: 110, padding: '0.5rem 0' }}>
                  <div className="db-profile-menu-header" style={{ padding: '0.5rem 1rem', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-900)' }}>{displayName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                  </div>
                  <Link href="/dashboard/profile" onClick={() => setProfileDropdownOpen(false)} className="db-profile-menu-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.82rem', color: 'var(--gray-700)', textDecoration: 'none' }}>
                    👤 Profile
                  </Link>
                  <Link href="/dashboard/goals" onClick={() => setProfileDropdownOpen(false)} className="db-profile-menu-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.82rem', color: 'var(--gray-700)', textDecoration: 'none' }}>
                    🎯 My Goals
                  </Link>
                  <Link href="/dashboard/appointments" onClick={() => setProfileDropdownOpen(false)} className="db-profile-menu-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.82rem', color: 'var(--gray-700)', textDecoration: 'none' }}>
                    📅 Appointments
                  </Link>
                  <Link href="/dashboard/settings" onClick={() => setProfileDropdownOpen(false)} className="db-profile-menu-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.82rem', color: 'var(--gray-700)', textDecoration: 'none' }}>
                    ⚙️ Settings
                  </Link>
                  <Link href="/" onClick={() => setProfileDropdownOpen(false)} className="db-profile-menu-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.82rem', color: 'var(--gray-700)', textDecoration: 'none' }}>
                    🏠 Home Page
                  </Link>
                  <div style={{ borderTop: '1px solid #f1f5f9', margin: '0.35rem 0' }} />
                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout('/');
                    }}
                    className="db-profile-menu-item db-profile-menu-logout"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.82rem', color: '#e11d48', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Page Content */}
        <main className="db-main" style={{ padding: '1.5rem' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
