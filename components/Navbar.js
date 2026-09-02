'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { href: '/', label: 'Home' },
  {
    href: '/services',
    label: 'Services',
    dropdown: [
      { href: '/services', label: '🛠️ All Services' },
      { href: '/services/stock-analysis', label: '📈 Stock Analysis' },
      { href: '/services/investment-planning', label: '💼 Investment Planning' },
      { href: '/services/retirement-planning', label: '🌴 Retirement Planning' },
      { href: '/services/insurance', label: '🛡️ Insurance Advisory' },
    ],
  },
  {
    href: '/calculators',
    label: 'Calculators',
    dropdown: [
      { href: '/calculators', label: '📊 All Calculators Hub' },
      { href: '/calculators/sip', label: '📈 SIP Calculator' },
      { href: '/calculators/emi', label: '🏠 EMI Calculator' },
      { href: '/calculators/lumpsum', label: '💰 Lumpsum Calculator' },
      { href: '/calculators/retirement', label: '🌴 Retirement Calculator' },
    ],
  },
  { href: '/blog', label: 'Insights' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [userDropdown, setUserDropdown] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
    setUserDropdown(false);
  }, [pathname]);

  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'User';
  const userInitials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'GN';

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="main-nav">
        <div className="container navbar-inner">
          {/* GrowthNest Logo */}
          <Logo href="/" className="navbar-logo" />

          {/* Desktop Nav Links */}
          <ul className="navbar-links" role="navigation" aria-label="Main navigation">
            {navLinks.map((link) =>
              link.dropdown ? (
                <li
                  key={link.label}
                  className="nav-dropdown"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={`nav-link${pathname.startsWith(link.href) ? ' active' : ''}`}
                    aria-expanded={openDropdown === link.label}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    {link.label}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        transition: 'transform 0.2s',
                        transform: openDropdown === link.label ? 'rotate(180deg)' : 'none',
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </Link>
                  <div
                    className="dropdown-panel"
                    style={{
                      opacity: openDropdown === link.label ? 1 : 0,
                      visibility: openDropdown === link.label ? 'visible' : 'hidden',
                      pointerEvents: openDropdown === link.label ? 'all' : 'none',
                      minWidth: '220px',
                    }}
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {link.dropdown.map((sub) => (
                      <Link key={sub.href} href={sub.href} className="dropdown-item">
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </li>
              ) : (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`nav-link${pathname === link.href ? ' active' : ''}`}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            )}
          </ul>

          {/* CTA & User Menu */}
          <div className="navbar-cta" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {user ? (
              <div
                className="nav-dropdown"
                style={{ position: 'relative' }}
                onMouseEnter={() => setUserDropdown(true)}
                onMouseLeave={() => setUserDropdown(false)}
              >
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '20px',
                    borderColor: 'var(--primary-900)',
                    background: '#ffffff',
                  }}
                  aria-expanded={userDropdown}
                  aria-label="User account menu"
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: '#101b3b',
                      color: '#19C3A3',
                      fontSize: '0.72rem',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {userInitials}
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--primary-900)', fontSize: '0.88rem' }}>
                    {firstName}
                  </span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      transition: 'transform 0.2s',
                      transform: userDropdown ? 'rotate(180deg)' : 'none',
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* User Dropdown Menu */}
                <div
                  className="dropdown-panel"
                  style={{
                    right: 0,
                    left: 'auto',
                    minWidth: '180px',
                    opacity: userDropdown ? 1 : 0,
                    visibility: userDropdown ? 'visible' : 'hidden',
                    pointerEvents: userDropdown ? 'all' : 'none',
                  }}
                >
                  <div style={{ padding: '0.5rem 0.85rem', borderBottom: '1px solid #f1f5f9' }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary-900)' }}>
                      {user.fullName}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                      {user.email}
                    </p>
                  </div>
                  <Link href="/dashboard" className="dropdown-item">
                    Dashboard
                  </Link>
                  <Link href="/dashboard/profile" className="dropdown-item">
                    Profile
                  </Link>
                  <Link href="/dashboard/settings" className="dropdown-item">
                    Settings
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="dropdown-item"
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      color: '#e11d48',
                      borderTop: '1px solid #f1f5f9',
                      marginTop: '0.25rem',
                      paddingTop: '0.5rem',
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link href="/login" className="nav-link hide-mobile" id="nav-login-btn">
                  Sign In
                </Link>
                <Link href="/register" className="btn btn-secondary btn-sm" id="nav-getstarted-btn">
                  Get Started
                </Link>
              </>
            )}

            <button
              className="hamburger"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileOpen}
            >
              <span
                className="hamburger-line"
                style={{ transform: mobileOpen ? 'rotate(45deg) translate(5px,5px)' : 'none' }}
              />
              <span className="hamburger-line" style={{ opacity: mobileOpen ? 0 : 1 }} />
              <span
                className="hamburger-line"
                style={{ transform: mobileOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`} id="mobile-menu">
        {navLinks.map((link) =>
          link.dropdown ? (
            <div key={link.label} style={{ marginBottom: '0.5rem' }}>
              <Link
                href={link.href}
                className="mobile-nav-link"
                style={{ fontWeight: 700, color: 'var(--accent-teal)' }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
              <div style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {link.dropdown.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className="mobile-nav-link"
                    style={{ fontSize: '0.9rem', opacity: 0.9, padding: '0.25rem 0.5rem' }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link
              key={link.label}
              href={link.href}
              className="mobile-nav-link"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          )
        )}

        <div style={{ marginTop: '0.75rem', padding: '0 0.5rem' }}>
          {user ? (
            <>
              <div style={{ padding: '0.5rem', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={{ margin: 0, fontWeight: 700, color: '#ffffff' }}>{user.fullName}</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>{user.email}</p>
              </div>
              <Link
                href="/dashboard"
                className="btn btn-secondary w-full"
                style={{ marginBottom: '0.5rem' }}
                onClick={() => setMobileOpen(false)}
              >
                Go to Dashboard
              </Link>
              <button
                type="button"
                className="btn btn-outline w-full"
                style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link
                href="/login"
                className="btn btn-outline w-full"
                style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="btn btn-secondary w-full"
                onClick={() => setMobileOpen(false)}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
