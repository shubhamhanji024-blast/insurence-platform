'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Users', href: '/admin/users', icon: '👥' },
  { label: 'Contact Requests', href: '/admin/enquiries', icon: '✉️' },
  { label: 'Appointments', href: '/admin/appointments', icon: '📅' },
  { label: 'Services', href: '/admin/services', icon: '💼' },
  { label: 'Calculators', href: '/admin/calculations', icon: '🧮' },
  { label: 'Content / Insights', href: '/admin/insights', icon: '📝' },
  { label: 'Activity Logs', href: '/admin/activity', icon: '📋' },
  { label: 'Settings', href: '/admin/settings', icon: '⚙️' },
];

export default function AdminLayout({ children, title = 'Admin Dashboard' }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // RBAC Client Guard
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace(`/admin/login?redirectTo=${encodeURIComponent(pathname || '/admin')}`);
      } else if (user.role !== 'ADMIN') {
        router.replace('/dashboard');
      }
    }
  }, [user, loading, router, pathname]);

  // Load notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/admin/notifications');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setNotifications(json.data.notifications || []);
          setUnreadCount(json.data.unreadCount || 0);
        }
      }
    } catch {
      // Background fetch error silenced
    }
  };

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 45000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Outside click listener for menus
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markNotificationRead = async (id) => {
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, read: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      }
    } catch {}
  };

  const markAllNotificationsRead = async () => {
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch {}
  };

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/admin/users?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b1329' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '4px solid #d4af37', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.9s linear infinite', margin: '0 auto 1.25rem' }} />
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', fontWeight: 500 }}>Validating Admin Session...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') return null;

  const userInitials = user.fullName
    ? user.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'AD';
  const adminName = user.fullName || 'Administrator';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* ── Mobile Overlay ─────────────────────── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', zIndex: 998 }}
          aria-hidden="true"
        />
      )}

      {/* ── Left Sidebar ───────────────────────── */}
      <aside
        role="navigation"
        aria-label="Admin Navigation"
        className={`admin-sidebar ${mobileOpen ? 'admin-sidebar-open' : ''}`}
        style={{
          width: 270,
          background: 'linear-gradient(185deg, #0b1329 0%, #0d1a38 60%, #081024 100%)',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 999,
          boxShadow: '4px 0 28px rgba(0,0,0,0.25)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Brand Header */}
        <div style={{ padding: '1.5rem 1.4rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: '#fff' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #d4af37 0%, #f0cc60 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', boxShadow: '0 4px 12px rgba(212,175,55,0.35)' }}>
              🌱
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.01em', color: '#ffffff' }}>
                GrowthNest
              </div>
              <div style={{ fontSize: '0.68rem', color: '#d4af37', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Admin Portal
              </div>
            </div>
          </Link>
          <button
            className="mobile-close-btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '1.4rem', cursor: 'pointer', display: 'none', padding: '0.3rem' }}
          >
            ✕
          </button>
        </div>

        {/* Navigation List */}
        <nav style={{ flex: 1, padding: '1.25rem 0.9rem', overflowY: 'auto' }}>
          <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em', padding: '0 0.75rem 0.85rem', fontWeight: 700 }}>
            Core Management
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {navItems.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin' || pathname === '/admin/dashboard'
                  : pathname?.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={isActive ? 'page' : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      padding: '0.75rem 1rem',
                      borderRadius: 10,
                      fontSize: '0.92rem',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? '#ffffff' : 'rgba(255,255,255,0.72)',
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(212,175,55,0.22) 0%, rgba(255,255,255,0.06) 100%)'
                        : 'transparent',
                      borderLeft: `3px solid ${isActive ? '#d4af37' : 'transparent'}`,
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span style={{ fontSize: '1.15rem', width: 24, textAlign: 'center' }}>{item.icon}</span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer / Admin Summary */}
        <div style={{ padding: '1.15rem 1rem', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.9rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37, #f0cc60)', color: '#0b1329', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {userInitials}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {adminName}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#d4af37', fontWeight: 700, letterSpacing: '0.04em' }}>
                ROLE: MASTER ADMIN
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link
              href="/admin/profile"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                padding: '0.55rem',
                background: 'rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.85)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 8,
                fontSize: '0.78rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'background 0.2s',
              }}
            >
              👤 Profile
            </Link>
            <button
              onClick={logout}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                padding: '0.55rem',
                background: 'rgba(239,68,68,0.18)',
                color: '#fca5a5',
                border: '1px solid rgba(239,68,68,0.28)',
                borderRadius: 8,
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Panel ─────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, marginLeft: 270 }} className="admin-main">
        {/* Top Navbar */}
        <header
          style={{
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            padding: '0.85rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 900,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            gap: '1.25rem',
          }}
        >
          {/* Left: Mobile Toggle + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className="mobile-hamburger"
              onClick={() => setMobileOpen(true)}
              aria-label="Open sidebar navigation"
              style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                width: 38,
                height: 38,
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                cursor: 'pointer',
                color: '#0f172a',
              }}
            >
              ☰
            </button>
            <div>
              <h1 style={{ fontSize: '1.25rem', margin: 0, color: '#0f172a', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
                {title}
              </h1>
              <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
                GrowthNest Enterprise Administration
              </span>
            </div>
          </div>

          {/* Center: Search Bar */}
          <form
            onSubmit={handleGlobalSearch}
            className="admin-search-form"
            style={{ flex: 1, maxWidth: 420, display: 'flex', position: 'relative' }}
          >
            <input
              type="text"
              placeholder="Search users by name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 1rem 0.55rem 2.4rem',
                borderRadius: 100,
                border: '1px solid #cbd5e1',
                fontSize: '0.88rem',
                outline: 'none',
                background: '#f8fafc',
                color: '#0f172a',
                transition: 'border-color 0.2s',
              }}
            />
            <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.95rem' }}>
              🔍
            </span>
          </form>

          {/* Right: Notification Bell + Profile Menu + Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {/* Notification Bell */}
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button
                onClick={() => setNotifOpen((p) => !p)}
                aria-label="View notifications"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: notifOpen ? '#f1f5f9' : '#ffffff',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.15rem',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background 0.2s',
                }}
              >
                🔔
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      background: '#ef4444',
                      color: '#ffffff',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      minWidth: 18,
                      height: 18,
                      borderRadius: 9,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 4px',
                      border: '2px solid #ffffff',
                    }}
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {notifOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: -10,
                    top: '115%',
                    width: 360,
                    maxWidth: '90vw',
                    background: '#ffffff',
                    borderRadius: 12,
                    boxShadow: '0 12px 36px rgba(15,23,42,0.15)',
                    border: '1px solid #e2e8f0',
                    zIndex: 1050,
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ padding: '0.85rem 1.15rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafafa' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>
                      Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        style={{ background: 'none', border: 'none', color: '#d4af37', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div style={{ maxHeight: 340, overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.88rem' }}>
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.slice(0, 15).map((n) => (
                        <div
                          key={n._id}
                          onClick={() => {
                            if (!n.read) markNotificationRead(n._id);
                            if (n.link) router.push(n.link);
                          }}
                          style={{
                            padding: '0.85rem 1.15rem',
                            borderBottom: '1px solid #f8fafc',
                            cursor: 'pointer',
                            background: n.read ? '#ffffff' : '#fefce8',
                            transition: 'background 0.15s',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                            <span style={{ fontSize: '0.84rem', fontWeight: n.read ? 600 : 700, color: '#0f172a' }}>
                              {n.title}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                              {new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div style={{ position: 'relative' }} ref={profileRef}>
              <button
                onClick={() => setProfileOpen((p) => !p)}
                aria-haspopup="true"
                aria-expanded={profileOpen}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 100,
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
              >
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37, #f0cc60)', color: '#0b1329', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {userInitials}
                </div>
                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }} className="admin-profile-name">
                  <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.1 }}>
                    {adminName.split(' ')[0]}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: '#d4af37', fontWeight: 700 }}>
                    ADMIN
                  </span>
                </div>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginLeft: 2 }}>▼</span>
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '115%',
                    width: 240,
                    background: '#ffffff',
                    borderRadius: 12,
                    boxShadow: '0 12px 36px rgba(15,23,42,0.14)',
                    border: '1px solid #e2e8f0',
                    padding: '0.5rem 0',
                    zIndex: 1050,
                  }}
                >
                  <div style={{ padding: '0.85rem 1.15rem', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{user.fullName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                    <span style={{ display: 'inline-block', marginTop: '0.35rem', fontSize: '0.65rem', fontWeight: 700, color: '#b45309', background: '#fef3c7', padding: '2px 8px', borderRadius: 100 }}>
                      SYSTEM ADMINISTRATOR
                    </span>
                  </div>
                  <Link
                    href="/admin/profile"
                    onClick={() => setProfileOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 1.15rem', fontSize: '0.86rem', color: '#334155', textDecoration: 'none' }}
                  >
                    👤 Admin Profile & Security
                  </Link>
                  <Link
                    href="/admin/settings"
                    onClick={() => setProfileOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 1.15rem', fontSize: '0.86rem', color: '#334155', textDecoration: 'none' }}
                  >
                    ⚙️ Platform Settings
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setProfileOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 1.15rem', fontSize: '0.86rem', color: '#334155', textDecoration: 'none' }}
                  >
                    🔄 Switch to User View
                  </Link>
                  <div style={{ borderTop: '1px solid #f1f5f9', margin: '0.35rem 0' }} />
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                    }}
                    style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 1.15rem', fontSize: '0.86rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Direct Logout Icon Button */}
            <button
              onClick={logout}
              title="Logout from Admin Console"
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              🚪
            </button>
          </div>
        </header>

        {/* Page Content View */}
        <main style={{ flex: 1, padding: '2rem', maxWidth: 1400, width: '100%' }}>
          {children}
        </main>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 992px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          .admin-sidebar-open {
            transform: translateX(0) !important;
          }
          .admin-main {
            margin-left: 0 !important;
          }
          .mobile-hamburger {
            display: flex !important;
          }
          .mobile-close-btn {
            display: block !important;
          }
          .admin-search-form {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          .admin-profile-name {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
