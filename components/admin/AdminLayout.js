'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Users', href: '/admin/users', icon: '👥' },
  { label: 'Enquiries', href: '/admin/enquiries', icon: '✉️' },
  { label: 'Financial Goals', href: '/admin/goals', icon: '🎯' },
  { label: 'Calculations', href: '/admin/calculations', icon: '💾' },
  { label: 'Insights / Blog', href: '/admin/insights', icon: '📝' },
  { label: 'Settings', href: '/admin/settings', icon: '⚙️' },
];

export default function AdminLayout({ children, title = 'Admin Dashboard' }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(`/login?redirectTo=${encodeURIComponent(pathname || '/admin')}`);
      } else if (user.role !== 'ADMIN') {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router, pathname]);

  // Close profile dropdown on outside click
  useEffect(() => {
    if (!profileOpen) return;
    const handler = () => setProfileOpen(false);
    document.addEventListener('click', handler, { passive: true });
    return () => document.removeEventListener('click', handler);
  }, [profileOpen]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 44, height: 44, border: '4px solid #d4af37', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--gray-600)', fontSize: '0.95rem' }}>Loading admin console...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') return null;

  const userInitials = user.fullName
    ? user.fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'AD';
  const firstName = user.fullName?.split(' ')[0] || 'Admin';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      {/* ── Mobile Overlay ─────────────────────── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 98 }}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ────────────────────────────── */}
      <aside
        role="navigation"
        aria-label="Admin sidebar"
        style={{
          width: 260,
          background: 'linear-gradient(180deg, #0d1628 0%, #101b3b 100%)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 99,
          transition: 'transform 0.3s ease',
          transform: mobileOpen ? 'translateX(0)' : undefined,
          boxShadow: '4px 0 24px rgba(0,0,0,0.18)',
        }}
        className={!mobileOpen ? 'admin-sidebar-desktop' : ''}
      >
        {/* Logo */}
        <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none', color: '#fff' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #d4af37 0%, #f0cc60 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
              🌱
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.01em' }}>GrowthNest</div>
              <div style={{ fontSize: '0.68rem', color: '#d4af37', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Admin Console</div>
            </div>
          </Link>
          <button
            className="mobile-only"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '1.4rem', cursor: 'pointer', padding: '0.25rem' }}
          >
            ✕
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1.25rem 0.85rem', overflowY: 'auto' }}>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 0.75rem 0.75rem', fontWeight: 700 }}>
            Management
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {navItems.map(item => {
              const isActive = item.href === '/admin'
                ? pathname === '/admin'
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
                      gap: '0.75rem',
                      padding: '0.72rem 1rem',
                      borderRadius: 8,
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? '#ffffff' : 'rgba(255,255,255,0.7)',
                      background: isActive ? 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(255,255,255,0.05) 100%)' : 'transparent',
                      borderLeft: `3px solid ${isActive ? '#d4af37' : 'transparent'}`,
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ fontSize: '1.05rem', width: 22, textAlign: 'center' }}>{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37, #f0cc60)', color: '#101b3b', fontWeight: 800, fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {userInitials}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.fullName}</div>
              <div style={{ fontSize: '0.7rem', color: '#d4af37', fontWeight: 600 }}>ADMIN</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link
              href="/dashboard"
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.5rem', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, fontSize: '0.78rem', fontWeight: 500, textDecoration: 'none', transition: 'background 0.2s' }}
            >
              👤 User View
            </Link>
            <button
              onClick={logout}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.5rem', background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ──────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, marginLeft: 260 }} className="admin-main-content">
        {/* Top Header */}
        <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '1rem 1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 90, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className="mobile-only"
              onClick={() => setMobileOpen(true)}
              aria-label="Open admin menu"
              style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#101b3b' }}
            >
              ☰
            </button>
            <div>
              <h1 style={{ fontSize: '1.25rem', margin: 0, color: '#101b3b', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
                {title}
              </h1>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#6b7280' }}>GrowthNest Admin Console</p>
            </div>
          </div>

          {/* Profile Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={(e) => { e.stopPropagation(); setProfileOpen(p => !p); }}
              aria-haspopup="true"
              aria-expanded={profileOpen}
              style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.45rem 0.9rem', borderRadius: 100, cursor: 'pointer', transition: 'border-color 0.2s' }}
            >
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37, #f0cc60)', color: '#101b3b', fontWeight: 800, fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {userInitials}
              </div>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#101b3b' }}>{firstName}</span>
              <span style={{ fontSize: '0.65rem', color: '#d4af37', fontWeight: 700 }}>ADMIN</span>
              <span style={{ fontSize: '0.65rem', color: '#6b7280' }}>▼</span>
            </button>

            {profileOpen && (
              <div
                onClick={e => e.stopPropagation()}
                style={{ position: 'absolute', right: 0, top: '110%', width: 220, background: '#fff', borderRadius: 10, boxShadow: '0 10px 40px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0', padding: '0.5rem 0', zIndex: 110 }}
                role="menu"
              >
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#101b3b' }}>{user.fullName}</div>
                  <div style={{ fontSize: '0.73rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                  <span style={{ display: 'inline-block', marginTop: '0.3rem', fontSize: '0.65rem', fontWeight: 700, color: '#d4af37', background: 'rgba(212,175,55,0.1)', padding: '2px 8px', borderRadius: 100, border: '1px solid rgba(212,175,55,0.3)' }}>ADMIN</span>
                </div>
                <Link href="/dashboard/profile" onClick={() => setProfileOpen(false)} role="menuitem" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', fontSize: '0.85rem', color: '#374151', textDecoration: 'none' }}>
                  👤 My Profile
                </Link>
                <Link href="/admin/settings" onClick={() => setProfileOpen(false)} role="menuitem" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', fontSize: '0.85rem', color: '#374151', textDecoration: 'none' }}>
                  ⚙️ Settings
                </Link>
                <div style={{ borderTop: '1px solid #f1f5f9', margin: '0.35rem 0' }} />
                <button onClick={() => { setProfileOpen(false); logout(); }} role="menuitem" style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', fontSize: '0.85rem', color: '#e11d48', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  🚪 Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '2rem 1.75rem', maxWidth: 1320, width: '100%' }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .admin-sidebar-desktop {
            transform: translateX(-100%);
          }
          .admin-main-content {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
