'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navGroups = [
  {
    label: 'Platform',
    links: [
      { href: '/about', label: 'About Us', icon: '🌱', desc: 'Our story & team' },
      { href: '/partners', label: 'Insurance Partners', icon: '🏢', desc: '20+ top companies' },
      { href: '/training', label: 'Training Academy', icon: '🎓', desc: 'Free skill courses' },
      { href: '/become-advisor', label: 'Become Advisor', icon: '🚀', desc: 'Start your journey' },
    ],
  },
  {
    label: 'Community',
    links: [
      { href: '/success-stories', label: 'Success Stories', icon: '🏆', desc: 'Advisor journeys' },
      { href: '/events', label: 'Events', icon: '📅', desc: 'Upcoming seminars', badge: '3' },
      { href: '/blog', label: 'Blog', icon: '📝', desc: 'Tips & insights' },
    ],
  },
  {
    label: 'Tools',
    links: [
      { href: '/calculator', label: 'Income Calculator', icon: '💰', desc: 'Estimate earnings' },
      { href: '/faq', label: 'FAQ', icon: '💬', desc: 'Common questions' },
      { href: '/contact', label: 'Contact', icon: '📞', desc: 'Get in touch' },
    ],
  },
];

export default function Navbar() {
  const [openGroup, setOpenGroup] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileGroup, setMobileGroup] = useState(null);
  const pathname = usePathname();
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setOpenGroup(null);
  }, [pathname]);

  useEffect(() => {
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenGroup(null);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const isGroupActive = (group) =>
    group.links.some((l) => l.href === pathname);

  return (
    <>
      <nav
        ref={navRef}
        className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
        id="main-nav"
      >
        <div className="container navbar-inner">
          <Link href="/" className="navbar-logo" id="nav-logo">
            <span className="logo-icon">🌱</span>
            <span className="logo-text">Growth<span className="text-accent">Nest</span></span>
          </Link>

          {/* Desktop: Grouped Dropdown Nav */}
          <div className="navbar-links hide-mobile" id="nav-links-desktop">
            {navGroups.map((group) => (
              <div
                key={group.label}
                className="nav-group"
                onMouseEnter={() => setOpenGroup(group.label)}
                onMouseLeave={() => setOpenGroup(null)}
              >
                <button
                  className={`navbar-link group-trigger ${isGroupActive(group) ? 'active' : ''}`}
                  id={`nav-group-${group.label.toLowerCase()}`}
                >
                  {group.label}
                  <span className="chevron" style={{ fontSize: '0.65rem', marginLeft: '4px', transition: 'transform 0.2s', transform: openGroup === group.label ? 'rotate(180deg)' : 'none' }}>▼</span>
                </button>

                <div className={`dropdown-menu ${openGroup === group.label ? 'open' : ''}`}>
                  <div className="dropdown-inner">
                    {group.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`dropdown-item ${pathname === link.href ? 'active' : ''}`}
                        id={`nav-${link.href.replace(/\//g, '') || 'home'}`}
                      >
                        <span className="dropdown-icon">{link.icon}</span>
                        <span className="dropdown-text">
                          <span className="dropdown-label">
                            {link.label}
                            {link.badge && (
                              <span className="nav-badge">{link.badge}</span>
                            )}
                          </span>
                          <span className="dropdown-desc">{link.desc}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Direct link for Careers */}
            <Link
              href="/careers"
              className={`navbar-link ${pathname === '/careers' ? 'active' : ''}`}
              id="nav-careers"
            >
              Careers
            </Link>
          </div>

          <div className="navbar-actions">
            <Link href="/dashboard" className="btn btn-sm btn-glass hide-mobile" id="nav-login-btn">
              Dashboard
            </Link>
            <Link href="/careers" className="btn btn-sm btn-primary hide-mobile" id="nav-join-btn">
              🚀 Join Free
            </Link>
            <button
              className="hamburger hide-desktop"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              id="nav-hamburger"
            >
              <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
              <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
              <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`} id="mobile-menu">
        <div className="mobile-menu-inner">
          {navGroups.map((group) => (
            <div key={group.label} className="mobile-group">
              <button
                className="mobile-group-trigger"
                onClick={() => setMobileGroup(mobileGroup === group.label ? null : group.label)}
              >
                <span>{group.label}</span>
                <span style={{ fontSize: '0.7rem', transition: 'transform 0.2s', transform: mobileGroup === group.label ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>▼</span>
              </button>
              {mobileGroup === group.label && (
                <div className="mobile-sublinks">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`mobile-link ${pathname === link.href ? 'active' : ''}`}
                    >
                      <span style={{ marginRight: '8px' }}>{link.icon}</span>
                      {link.label}
                      {link.badge && <span className="nav-badge" style={{ marginLeft: '6px' }}>{link.badge}</span>}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Link
            href="/careers"
            className={`mobile-link ${pathname === '/careers' ? 'active' : ''}`}
          >
            🚀 Careers
          </Link>

          <div className="mobile-menu-actions">
            <Link href="/dashboard" className="btn btn-glass" style={{ width: '100%' }}>📊 Dashboard</Link>
            <Link href="/careers" className="btn btn-primary" style={{ width: '100%' }}>Join Free — It&apos;s Free</Link>
          </div>
        </div>
      </div>

      {isOpen && <div className="mobile-overlay" onClick={() => setIsOpen(false)} />}

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          height: var(--nav-height);
          display: flex;
          align-items: center;
          transition: all var(--transition-base);
          background: transparent;
        }

        .navbar-scrolled {
          background: rgba(10, 22, 40, 0.92);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid var(--border-glass);
          box-shadow: var(--shadow-md);
        }

        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: var(--container-max);
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 800;
          text-decoration: none;
          color: var(--text-primary);
          flex-shrink: 0;
        }

        .logo-icon { font-size: 1.8rem; }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        /* Nav Groups */
        .nav-group {
          position: relative;
        }

        .navbar-link {
          padding: 0.45rem 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all var(--transition-base);
          text-decoration: none;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
        }

        .group-trigger {
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
        }

        .navbar-link:hover,
        .group-trigger:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }

        .navbar-link.active,
        .group-trigger.active {
          color: var(--primary);
          background: rgba(0, 212, 170, 0.1);
        }

        /* Dropdown */
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          min-width: 260px;
          background: rgba(10, 22, 40, 0.96);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-lg);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04);
          opacity: 0;
          pointer-events: none;
          transform: translateX(-50%) translateY(-8px);
          transition: all 0.2s ease;
          z-index: 200;
          overflow: hidden;
        }

        .dropdown-menu.open {
          opacity: 1;
          pointer-events: all;
          transform: translateX(-50%) translateY(0);
        }

        .dropdown-inner {
          padding: 0.5rem;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          text-decoration: none;
          transition: all var(--transition-base);
          color: var(--text-secondary);
        }

        .dropdown-item:hover,
        .dropdown-item.active {
          background: rgba(0, 212, 170, 0.08);
          color: var(--text-primary);
        }

        .dropdown-icon {
          width: 36px;
          height: 36px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .dropdown-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .dropdown-label {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .dropdown-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        /* Notification badge in nav */
        .nav-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 18px;
          height: 18px;
          padding: 0 4px;
          background: var(--primary);
          color: var(--bg-primary);
          font-size: 0.65rem;
          font-weight: 700;
          border-radius: var(--radius-full);
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        /* Hamburger */
        .hamburger {
          width: 36px;
          height: 36px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          cursor: pointer;
          background: none;
          border: none;
          padding: 4px;
        }

        .hamburger-line {
          width: 24px;
          height: 2px;
          background: var(--text-primary);
          border-radius: 2px;
          transition: all var(--transition-base);
        }

        .hamburger-line.open:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        .hamburger-line.open:nth-child(2) { opacity: 0; }
        .hamburger-line.open:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

        /* Mobile Menu */
        .mobile-menu {
          position: fixed;
          top: 0;
          right: -100%;
          width: 300px;
          height: 100vh;
          background: var(--bg-secondary);
          border-left: 1px solid var(--border-glass);
          z-index: 1001;
          transition: right var(--transition-base);
          overflow-y: auto;
          padding: calc(var(--nav-height) + 1rem) 1.25rem 2rem;
        }

        .mobile-menu.open { right: 0; }

        .mobile-menu-inner {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .mobile-group { margin-bottom: 4px; }

        .mobile-group-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-muted);
          background: var(--bg-tertiary);
          border: none;
          cursor: pointer;
          font-family: inherit;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.75rem;
        }

        .mobile-sublinks {
          padding: 4px 0 4px 8px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .mobile-link {
          display: flex;
          align-items: center;
          padding: 0.7rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all var(--transition-base);
        }

        .mobile-link:hover,
        .mobile-link.active {
          color: var(--primary);
          background: rgba(0, 212, 170, 0.1);
        }

        .mobile-menu-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-glass);
        }

        .mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }
      `}</style>
    </>
  );
}
