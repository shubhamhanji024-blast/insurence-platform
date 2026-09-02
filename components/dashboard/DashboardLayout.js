'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function DashboardLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?redirectTo=${encodeURIComponent(pathname || '/dashboard')}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center">
          <div style={{ width: 44, height: 44, border: '4px solid #19C3A3', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
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

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Financial Goals', href: '/dashboard/goals', icon: '🎯' },
    { label: 'Saved Calculations', href: '/dashboard/calculations', icon: '💾' },
    { label: 'Profile', href: '/dashboard/profile', icon: '👤' },
    { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', background: '#f8fafc' }}>
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 99,
          }}
        />
      )}

      {/* Sidebar (Desktop Persistent & Mobile Drawer) */}
      <aside
        style={{
          width: '260px',
          background: '#101b3b',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          position: 'relative',
          zIndex: 100,
          transition: 'transform 0.3s ease',
          ...(typeof window !== 'undefined' && window.innerWidth <= 992
            ? {
                position: 'fixed',
                top: 0,
                bottom: 0,
                left: 0,
                transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
              }
            : {}),
        }}
      >
        {/* Sidebar Header Logo & Close */}
        <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#ffffff', textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'linear-gradient(135deg, #19C3A3 0%, #101b3b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', color: '#ffffff' }}>
              🌱
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
              GrowthNest
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="mobile-only"
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '1.5rem', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* Sidebar Navigation Items */}
        <nav style={{ padding: '1.25rem 0.75rem', flex: 1 }}>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 0.75rem 0.5rem' }}>
            Main Menu
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.92rem',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? '#ffffff' : 'rgba(255,255,255,0.75)',
                      background: isActive ? 'linear-gradient(135deg, rgba(25,195,163,0.2) 0%, rgba(30,58,138,0.3) 100%)' : 'transparent',
                      borderLeft: isActive ? '3px solid #19C3A3' : '3px solid transparent',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer User Info & Logout */}
        <div style={{ padding: '1.25rem 1rem', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#19C3A3', color: '#101b3b', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {userInitials}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.fullName}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.email}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '0.5rem',
              padding: '0.6rem',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Right Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Dashboard Top Header Bar */}
        <header
          style={{
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            padding: '1.25rem 1.75rem',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 90,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open mobile menu"
              className="mobile-only"
              style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--primary-900)' }}
            >
              ☰
            </button>
            <div>
              <h1 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--primary-900)', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
                Welcome back, {firstName} 👋
              </h1>
              <p style={{ margin: 0, fontSize: '0.83rem', color: 'var(--gray-600)' }}>
                Here is an overview of your financial planning activity.
              </p>
            </div>
          </div>

          {/* User Profile Dropdown Badge */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
            >
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#101b3b', color: '#19C3A3', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {userInitials}
              </div>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--primary-900)' }}>
                {firstName}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--gray-500)' }}>▼</span>
            </button>

            {profileDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  width: '200px',
                  background: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid #e2e8f0',
                  padding: '0.5rem 0',
                  zIndex: 110,
                }}
              >
                <div style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-900)' }}>{user.fullName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                </div>

                <Link
                  href="/dashboard/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  style={{ display: 'block', padding: '0.6rem 1rem', fontSize: '0.85rem', color: 'var(--gray-700)', textDecoration: 'none' }}
                >
                  👤 Profile Details
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  style={{ display: 'block', padding: '0.6rem 1rem', fontSize: '0.85rem', color: 'var(--gray-700)', textDecoration: 'none' }}
                >
                  ⚙️ Account Settings
                </Link>
                <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '0.35rem' }} />
                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                  }}
                  style={{ width: '100%', textAlign: 'left', padding: '0.6rem 1rem', fontSize: '0.85rem', color: '#e11d48', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                >
                  🚪 Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main style={{ flex: 1, padding: '2rem 1.75rem', maxWidth: '1280px', width: '100%', margin: '0 auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
