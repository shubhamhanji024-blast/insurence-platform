'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

/* ---- Animated Counter ---- */
function AnimatedCounter({ end, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 2000;
          const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

/* ---- Particles ---- */
function Particles() {
  const particles = useRef(
    Array.from({ length: 20 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${Math.random() * 6 + 2}px`,
      height: `${Math.random() * 6 + 2}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 10 + 10}s`,
      tx: `${(Math.random() - 0.5) * 200}px`,
      ty: `${-Math.random() * 300 - 100}px`,
    }))
  );
  return (
    <div className="particles">
      {particles.current.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: p.left, top: p.top, width: p.width, height: p.height,
            animationDelay: p.delay, animationDuration: p.duration,
            '--tx': p.tx, '--ty': p.ty,
          }}
        />
      ))}
      <style jsx>{`
        .particles { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
        .particle {
          position: absolute;
          background: var(--primary);
          border-radius: 50%;
          opacity: 0;
          animation: particleFloat 15s infinite;
        }
      `}</style>
    </div>
  );
}

/* ---- Advisor Dashboard Mock ---- */
function AdvisorMock() {
  return (
    <div className="advisor-mock-card">
      <div className="mock-header">
        <div className="mock-avatar">S</div>
        <div>
          <div className="mock-name">Shubham K.</div>
          <div className="mock-badge">🥇 Gold Advisor</div>
        </div>
        <div className="mock-notif">🔔</div>
      </div>
      <div className="mock-stats-row">
        <div className="mock-stat">
          <span className="mock-stat-val">₹45,200</span>
          <span className="mock-stat-lbl">This Month</span>
        </div>
        <div className="mock-stat-divider" />
        <div className="mock-stat">
          <span className="mock-stat-val">24</span>
          <span className="mock-stat-lbl">Active Leads</span>
        </div>
        <div className="mock-stat-divider" />
        <div className="mock-stat">
          <span className="mock-stat-val">85%</span>
          <span className="mock-stat-lbl">Training</span>
        </div>
      </div>
      <div className="mock-chart">
        {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
          <div
            key={i}
            className="mock-bar"
            style={{
              height: `${h}%`,
              background: i === 6 ? 'var(--primary)' : 'rgba(0,212,170,0.2)',
            }}
          />
        ))}
      </div>
      <div className="mock-leads">
        {[
          { name: 'Amit Kumar', status: 'Converted', color: '#4caf50' },
          { name: 'Priya Singh', status: 'Meeting Set', color: '#2196f3' },
          { name: 'Rahul Gupta', status: 'New Lead', color: '#ffd700' },
        ].map((l, i) => (
          <div key={i} className="mock-lead-row">
            <div className="mock-lead-dot" style={{ background: l.color }} />
            <span className="mock-lead-name">{l.name}</span>
            <span className="mock-lead-status" style={{ color: l.color }}>{l.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- Home Page ---- */
export default function HomePage() {
  const [typeIndex, setTypeIndex] = useState(0);
  const words = ['Insurance Advisor', 'Financial Expert', 'Wealth Creator', 'Life Changer'];

  useEffect(() => {
    const interval = setInterval(() => {
      setTypeIndex(prev => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ======= HERO SECTION ======= */}
      <section className="hero" id="hero-section">
        <Particles />
        <div className="hero-bg-gradient" />
        <div className="hero-bg-grid" />

        <div className="container hero-split">
          {/* Left: Content */}
          <div className="hero-content animate-fade-in-up">
            <div className="hero-badge">
              <span className="pulse-dot" />
              🚀 India&apos;s #1 Insurance Advisor Platform
            </div>

            <h1 className="hero-title">
              Grow Beyond <span className="text-gradient">Limits</span>
            </h1>

            <div className="hero-subtitle">
              Become a{' '}
              <span className="typewriter-text" key={typeIndex}>
                {words[typeIndex]}
              </span>
            </div>

            <p className="hero-desc">
              Join 5,000+ advisors earning unlimited income with 20+ top insurance companies.
              Get trained, certified, and supported every step of the way.
            </p>

            <div className="hero-actions">
              <Link href="/careers" className="btn btn-primary btn-lg" id="hero-join-btn">
                🚀 Join as Advisor
              </Link>
              <Link href="/calculator" className="btn btn-glass btn-lg" id="hero-calc-btn">
                💰 Calculate Income
              </Link>
            </div>

            <div className="hero-trust">
              <div className="trust-avatars">
                {['👨‍💼', '👩‍💼', '👨‍💼', '👩‍💼', '👨‍💼'].map((a, i) => (
                  <span key={i} className="trust-avatar" style={{ zIndex: 5 - i }}>{a}</span>
                ))}
              </div>
              <span className="trust-text">
                <strong>5,000+</strong> advisors already earning
              </span>
              <div className="trust-rating">
                <span style={{ color: '#ffd700' }}>★★★★★</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>4.9/5</span>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <Link href="/dashboard" style={{ fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                📊 Or explore the live dashboard →
              </Link>
            </div>
          </div>

          {/* Right: Advisor Dashboard Mock */}
          <div className="hero-visual animate-slide-right">
            <div className="hero-visual-glow" />
            <AdvisorMock />
            <div className="hero-float-badge float-badge-1">
              <span>🎉</span>
              <span>Rahul earned <strong>₹3.2L</strong> this month!</span>
            </div>
            <div className="hero-float-badge float-badge-2">
              <span>✅</span>
              <span><strong>New policy</strong> sold — LIC Term</span>
            </div>
          </div>
        </div>

        <div className="hero-scroll">
          <div className="scroll-indicator">
            <div className="scroll-dot" />
          </div>
        </div>
      </section>

      {/* Social Proof Strip */}
      <div className="social-proof-strip">
        <div className="container">
          <div className="social-proof-items">
            {[
              { num: '5,000+', label: 'Active Advisors', icon: '👥' },
              { num: '20+', label: 'Insurance Partners', icon: '🏢' },
              { num: '₹50Cr+', label: 'Business Generated', icon: '💰' },
              { num: '98%', label: 'Advisor Satisfaction', icon: '⭐' },
              { num: '10+', label: 'Years of Excellence', icon: '🏆' },
            ].map((item, i) => (
              <div key={i} className="social-proof-item">
                <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
                <div>
                  <div className="sp-num">{item.num}</div>
                  <div className="sp-label">{item.label}</div>
                </div>
                {i < 4 && <div className="sp-divider" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ======= STATS SECTION ======= */}
      <section className="section stats-section" id="stats-section">
        <div className="container">
          <div className="stats-grid">
            {[
              { number: 5000, suffix: '+', label: 'Advisors', icon: '👥', sparkline: [30, 50, 45, 70, 60, 85, 100], color: 'var(--primary)' },
              { number: 20, suffix: '+', label: 'Insurance Partners', icon: '🏢', sparkline: [60, 65, 70, 75, 80, 90, 100], color: 'var(--secondary)' },
              { number: 50, suffix: ' Cr+', prefix: '₹', label: 'Business Generated', icon: '💰', sparkline: [20, 35, 50, 55, 70, 85, 100], color: 'var(--accent)' },
              { number: 10, suffix: '+', label: 'Years Experience', icon: '📅', sparkline: [10, 25, 40, 55, 65, 80, 100], color: '#ff6384' },
            ].map((stat, i) => (
              <div key={i} className="stat-card glass-card card-hover-glow">
                <div className="stat-top">
                  <span className="stat-icon">{stat.icon}</span>
                  <div className="sparkline">
                    {stat.sparkline.map((h, j) => (
                      <div key={j} className={`sparkline-bar ${j === 6 ? 'highlight' : ''}`}
                        style={{ height: `${h}%`, background: j === 6 ? stat.color : undefined }} />
                    ))}
                  </div>
                </div>
                <div className="stat-number">
                  <AnimatedCounter end={stat.number} suffix={stat.suffix} prefix={stat.prefix || ''} />
                </div>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= ABOUT PREVIEW ======= */}
      <section className="section" id="about-preview">
        <div className="container">
          <div className="about-grid">
            <div className="about-image-area">
              <div className="about-image-card glass-card-static">
                <div className="about-emoji">🌱</div>
                <div className="about-image-label">
                  Empowering India&apos;s Future Financial Advisors
                </div>
                <div className="about-stats-mini">
                  <div className="mini-stat">
                    <span className="text-gradient" style={{ fontWeight: 800 }}>15</span>
                    <span>States</span>
                  </div>
                  <div className="mini-stat-div" />
                  <div className="mini-stat">
                    <span className="text-gradient" style={{ fontWeight: 800 }}>5K+</span>
                    <span>Advisors</span>
                  </div>
                  <div className="mini-stat-div" />
                  <div className="mini-stat">
                    <span className="text-gradient" style={{ fontWeight: 800 }}>2014</span>
                    <span>Founded</span>
                  </div>
                </div>
              </div>
              <div className="about-float-card glass-card-static">
                <span className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 800 }}>98%</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Advisor Satisfaction</span>
              </div>
            </div>
            <div className="about-content">
              <div className="section-heading" style={{ textAlign: 'left' }}>
                <span className="label">About GrowthNest</span>
                <h2>Building India&apos;s Largest Insurance <span className="text-gradient">Advisory Network</span></h2>
              </div>
              <p style={{ marginBottom: '1rem' }}>
                GrowthNest was founded in 2014 with a single mission — to democratize insurance advisory in India. We believe that anyone with dedication and the right training can build a rewarding career in insurance.
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                Today, we&apos;re proud to have trained 5,000+ advisors across 15 states, partnering with 20+ leading insurance companies to offer the best products to Indian families.
              </p>
              <div className="about-features">
                {[
                  { icon: '🎓', text: 'World-class training' },
                  { icon: '💰', text: 'Unlimited income potential' },
                  { icon: '🏢', text: '20+ insurance partners' },
                  { icon: '📱', text: 'Full digital support' },
                ].map((f, i) => (
                  <div key={i} className="about-feature">
                    <span className="feature-check">{f.icon}</span>
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
              <Link href="/about" className="btn btn-primary" style={{ marginTop: '1.5rem' }} id="about-more-btn">
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======= HOW IT WORKS ======= */}
      <section className="section" id="how-it-works" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-heading">
            <span className="label">How It Works</span>
            <h2>Start Your Journey in <span className="text-gradient">4 Simple Steps</span></h2>
            <p>From registration to earning — we&apos;ve made the process seamless.</p>
          </div>

          <div className="steps-grid">
            {[
              { step: '01', icon: '📝', title: 'Register', desc: 'Fill the online application form with your basic details and documents.', color: 'var(--primary)' },
              { step: '02', icon: '📚', title: 'Get Trained', desc: 'Complete our comprehensive training modules at your own pace.', color: 'var(--secondary)' },
              { step: '03', icon: '🤝', title: 'Start Selling', desc: 'Access leads, tools, and support to begin selling insurance policies.', color: 'var(--accent)' },
              { step: '04', icon: '💰', title: 'Earn Income', desc: 'Earn commissions, bonuses, and rewards with no income ceiling.', color: '#25D366' },
            ].map((s, i) => (
              <div key={i} className="step-card glass-card card-hover-glow" style={{ '--step-color': s.color }}>
                <div className="step-number">{s.step}</div>
                <div className="step-icon-wrap" style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                  <span className="step-icon">{s.icon}</span>
                </div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
                {i < 3 && <div className="step-arrow hide-mobile">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= PERSONA SECTION (NEW) ======= */}
      <section className="section" id="persona-section">
        <div className="container">
          <div className="section-heading">
            <span className="label">Who Is It For?</span>
            <h2>GrowthNest is Built for <span className="text-gradient">Everyone</span></h2>
            <p>No matter your background, there&apos;s a place for you.</p>
          </div>
          <div className="persona-grid">
            {[
              {
                cls: 'persona-advisor',
                icon: '👨‍💼',
                title: 'Aspiring Advisors',
                desc: 'Zero experience? No problem. We train you from scratch — insurance basics to advanced selling.',
                perks: ['Free IRDAI exam prep', 'Mentorship program', 'Lead generation tools'],
                cta: '🚀 Start Free',
                href: '/careers',
              },
              {
                cls: 'persona-client',
                icon: '🏢',
                title: 'Experienced Professionals',
                desc: 'Already in finance or sales? Leverage your skills to earn 3–5x more through insurance advisory.',
                perks: ['Advanced product training', 'HNI client access', 'Dedicated support manager'],
                cta: '📋 Apply Now',
                href: '/careers',
              },
              {
                cls: 'persona-business',
                icon: '👩‍💼',
                title: 'Homemakers & Part-timers',
                desc: 'Work on your schedule. Earn a second income without leaving home. We support 40%+ women advisors.',
                perks: ['Work from home', 'Flexible hours', 'WhatsApp selling tools'],
                cta: '💡 Learn More',
                href: '/about',
              },
            ].map((p, i) => (
              <div key={i} className={`persona-card ${p.cls} card-hover-glow`}>
                <div className="persona-icon">{p.icon}</div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>{p.title}</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>{p.desc}</p>
                <div className="persona-perks">
                  {p.perks.map((perk, j) => (
                    <div key={j} className="persona-perk">
                      <span style={{ color: 'var(--primary)' }}>✓</span>
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
                <Link href={p.href} className="btn btn-secondary btn-sm" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= APP SHOWCASE (NEW — inspired by TurtlemintPro) ======= */}
      <section className="section app-showcase-section" id="app-showcase">
        <div className="container">
          <div className="app-showcase-grid">
            <div className="app-showcase-content">
              <span className="label">GrowthNest Pro</span>
              <h2 style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                Your Business in <span className="text-gradient">Your Pocket</span>
              </h2>
              <p style={{ marginBottom: '2rem' }}>
                The GrowthNest advisor app gives you everything you need to run and grow your insurance business — leads, training, income tracking, and more.
              </p>
              <div className="app-features">
                {[
                  { icon: '👥', title: 'Lead Management', desc: 'Track and nurture leads through a visual CRM pipeline' },
                  { icon: '📊', title: 'Income Dashboard', desc: 'Real-time commissions, bonuses, and monthly earnings' },
                  { icon: '🎓', title: 'Training on the Go', desc: 'Access 100+ video lessons and mock tests anywhere' },
                  { icon: '📄', title: 'Policy Tracker', desc: 'Monitor renewals, claims, and client policy status' },
                ].map((f, i) => (
                  <div key={i} className="app-feature-item">
                    <div className="app-feature-icon">{f.icon}</div>
                    <div>
                      <h5 style={{ marginBottom: '0.2rem' }}>{f.title}</h5>
                      <p style={{ fontSize: '0.85rem', margin: 0 }}>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-md" style={{ marginTop: '2rem', flexWrap: 'wrap' }}>
                <Link href="/careers" className="btn btn-primary" id="app-join-btn">
                  Get Access — Join Free
                </Link>
                <Link href="/dashboard" className="btn btn-secondary" id="app-login-btn">
                  Open Dashboard →
                </Link>
              </div>
            </div>

            {/* Phone-style app mockup */}
            <div className="app-phone-wrap">
              <div className="app-phone">
                <div className="phone-notch" />
                <div className="phone-screen">
                  <div className="phone-header">
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)' }}>GrowthNest Pro</span>
                    <span style={{ fontSize: '0.7rem' }}>🔔</span>
                  </div>
                  <div className="phone-welcome">Good morning, Shubham 👋</div>
                  <div className="phone-stats">
                    <div className="phone-stat">
                      <span className="phone-stat-val">₹45K</span>
                      <span className="phone-stat-lbl">This Month</span>
                    </div>
                    <div className="phone-stat">
                      <span className="phone-stat-val">24</span>
                      <span className="phone-stat-lbl">Leads</span>
                    </div>
                    <div className="phone-stat">
                      <span className="phone-stat-val">85%</span>
                      <span className="phone-stat-lbl">Training</span>
                    </div>
                  </div>
                  <div className="phone-chart">
                    {[30, 60, 45, 80, 55, 90].map((h, i) => (
                      <div key={i} className="phone-bar"
                        style={{ height: `${h}%`, background: i === 5 ? 'var(--primary)' : 'rgba(0,212,170,0.2)' }} />
                    ))}
                  </div>
                  <div className="phone-actions">
                    {['➕ Lead', '📅 Event', '💬 Chat', '📊 Report'].map((a, i) => (
                      <div key={i} className="phone-action-btn">{a}</div>
                    ))}
                  </div>
                  <div className="phone-notification">
                    <span>🎉</span>
                    <span style={{ fontSize: '0.65rem' }}>Policy sold! Commission ₹3,200 credited</span>
                  </div>
                </div>
              </div>
              <div className="app-phone-glow" />
            </div>
          </div>
        </div>
      </section>

      {/* ======= PARTNERS MARQUEE ======= */}
      <section className="section-sm" id="partners-preview">
        <div className="container">
          <div className="section-heading">
            <span className="label">Our Partners</span>
            <h2>Trusted by <span className="text-gradient">India&apos;s Best</span></h2>
          </div>
        </div>
        <div className="marquee-wrapper">
          <div className="marquee-track">
            {[
              { name: 'LIC', icon: '🏛️', color: '#1565C0' },
              { name: 'HDFC Life', icon: '🔵', color: '#0072BB' },
              { name: 'ICICI Prudential', icon: '🟠', color: '#F36B21' },
              { name: 'SBI Life', icon: '🔷', color: '#0047BA' },
              { name: 'Max Life', icon: '🟡', color: '#D4002D' },
              { name: 'Tata AIA', icon: '🔴', color: '#E31E24' },
              { name: 'Bajaj Allianz', icon: '🟢', color: '#1D4F8C' },
              { name: 'Kotak Life', icon: '🔶', color: '#ED1C24' },
              { name: 'LIC', icon: '🏛️', color: '#1565C0' },
              { name: 'HDFC Life', icon: '🔵', color: '#0072BB' },
              { name: 'ICICI Prudential', icon: '🟠', color: '#F36B21' },
              { name: 'SBI Life', icon: '🔷', color: '#0047BA' },
              { name: 'Max Life', icon: '🟡', color: '#D4002D' },
              { name: 'Tata AIA', icon: '🔴', color: '#E31E24' },
              { name: 'Bajaj Allianz', icon: '🟢', color: '#1D4F8C' },
              { name: 'Kotak Life', icon: '🔶', color: '#ED1C24' },
            ].map((p, i) => (
              <div key={i} className="marquee-item glass-card-static">
                <span className="marquee-dot" style={{ background: p.color }} />
                <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= SUCCESS STORIES PREVIEW ======= */}
      <section className="section" id="success-preview" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-heading">
            <span className="label">Success Stories</span>
            <h2>Our Advisors Are <span className="text-gradient">Thriving</span></h2>
            <p>Real stories from real people who transformed their lives with GrowthNest.</p>
          </div>

          <div className="grid grid-3">
            {[
              { name: 'Rahul Verma', city: 'Mumbai', income: '₹3,20,000/mo', prevIncome: '₹15,000/mo', emoji: '🥇', quote: 'GrowthNest gave me financial freedom.', badge: 'Gold Advisor', badgeClass: 'badge-accent' },
              { name: 'Sneha Kulkarni', city: 'Pune', income: '₹2,40,000/mo', prevIncome: '₹22,000/mo', emoji: '🥈', quote: 'If I can do it, anyone can.', badge: 'Rising Star', badgeClass: 'badge-primary' },
              { name: 'Amit Saxena', city: 'Delhi', income: '₹2,80,000/mo', prevIncome: '₹30,000/mo', emoji: '🥉', quote: 'The training made all the difference.', badge: 'Silver Advisor', badgeClass: 'badge-secondary' },
            ].map((t, i) => (
              <div key={i} className="glass-card testimonial-card card-hover-glow">
                <div className="testimonial-header">
                  <div className="testimonial-avatar">{t.emoji}</div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem' }}>{t.name}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.city}</p>
                  </div>
                  <span className={`badge ${t.badgeClass}`} style={{ marginLeft: 'auto' }}>{t.badge}</span>
                </div>
                <div className="income-comparison">
                  <div className="income-prev">
                    <span>Before</span>
                    <span className="income-val-prev">{t.prevIncome}</span>
                  </div>
                  <div className="income-arrow">→</div>
                  <div className="income-now">
                    <span>Now</span>
                    <span className="income-val-now text-gradient">{t.income}</span>
                  </div>
                </div>
                <p style={{ fontStyle: 'italic', fontSize: '0.95rem' }}>&ldquo;{t.quote}&rdquo;</p>
              </div>
            ))}
          </div>

          <div className="text-center" style={{ marginTop: '2rem' }}>
            <Link href="/success-stories" className="btn btn-secondary" id="view-all-stories-btn">
              View All Success Stories →
            </Link>
          </div>
        </div>
      </section>

      {/* ======= CTA SECTION ======= */}
      <section className="cta-section" id="cta-section">
        <Particles />
        <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
          <div className="cta-badge">🎯 Limited Seats Available — Apply Today</div>
          <h2 style={{ marginBottom: '1rem' }}>
            Ready to Start Your <span className="text-gradient">Insurance Career</span>?
          </h2>
          <p style={{ fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto 2rem', color: 'var(--text-secondary)' }}>
            Join thousands of advisors who are already earning unlimited income. No experience needed — we&apos;ll train you from scratch.
          </p>
          <div className="flex items-center justify-center gap-md" style={{ flexWrap: 'wrap' }}>
            <Link href="/careers" className="btn btn-accent btn-lg" id="cta-apply-btn">
              🎯 Apply Now — It&apos;s Free
            </Link>
            <Link href="/calculator" className="btn btn-glass btn-lg" id="cta-calc-btn">
              💰 Calculate Your Income
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        /* ---- HERO SPLIT ---- */
        .hero {
          min-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 5rem 0 3rem;
        }

        .hero-bg-gradient {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 20% 50%, rgba(0, 212, 170, 0.1) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 30%, rgba(108, 99, 255, 0.08) 0%, transparent 50%),
                      radial-gradient(ellipse at 50% 80%, rgba(255, 215, 0, 0.05) 0%, transparent 40%);
        }

        .hero-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .hero-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          position: relative;
          z-index: 1;
          width: 100%;
        }

        .hero-content { max-width: 580px; }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0.5rem 1.2rem;
          background: rgba(0, 212, 170, 0.08);
          border: 1px solid rgba(0, 212, 170, 0.2);
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--primary);
          margin-bottom: 1.5rem;
        }

        .pulse-dot {
          width: 8px; height: 8px;
          background: var(--primary);
          border-radius: 50%;
          animation: pulse 2s infinite;
          flex-shrink: 0;
        }

        .hero-title {
          font-size: clamp(2.8rem, 5vw, 4.2rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 1rem;
        }

        .hero-subtitle {
          font-size: clamp(1.1rem, 2vw, 1.4rem);
          color: var(--text-secondary);
          margin-bottom: 1rem;
          font-weight: 400;
        }

        .typewriter-text {
          color: var(--accent);
          font-weight: 700;
          display: inline-block;
          animation: fadeIn 0.5s ease;
        }

        .hero-desc {
          font-size: 1.05rem;
          color: var(--text-muted);
          margin-bottom: 2rem;
          line-height: 1.7;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }

        .hero-trust {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .trust-avatars { display: flex; }

        .trust-avatar {
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          background: var(--bg-tertiary);
          border: 2px solid var(--bg-primary);
          border-radius: 50%;
          margin-left: -8px;
          font-size: 1.1rem;
        }
        .trust-avatar:first-child { margin-left: 0; }

        .trust-text { font-size: 0.9rem; color: var(--text-muted); }
        .trust-rating { display: flex; align-items: center; gap: 4px; }

        /* Hero Visual */
        .hero-visual {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding-top: 1rem;
        }

        .hero-visual-glow {
          position: absolute;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(0,212,170,0.15), transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        /* Floating notification badges */
        .hero-float-badge {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0.5rem 1rem;
          background: rgba(10, 22, 40, 0.95);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          white-space: nowrap;
          backdrop-filter: blur(10px);
          box-shadow: var(--shadow-md);
          z-index: 10;
        }

        .float-badge-1 {
          bottom: 30px; left: -20px;
          animation: float 4s ease-in-out infinite;
          border-color: rgba(0,212,170,0.3);
        }

        .float-badge-2 {
          top: 20px; right: -20px;
          animation: float 4s ease-in-out infinite 2s;
          border-color: rgba(255,215,0,0.3);
        }

        /* Advisor Mock Card */
        .advisor-mock-card {
          background: var(--bg-card);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-xl);
          padding: 1.5rem;
          width: 340px;
          backdrop-filter: blur(20px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
          position: relative;
          z-index: 5;
        }

        .mock-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 1.25rem;
        }

        .mock-avatar {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: var(--gradient-primary);
          color: var(--bg-primary);
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 1.1rem;
          flex-shrink: 0;
        }

        .mock-name { font-weight: 600; font-size: 0.95rem; }
        .mock-badge { font-size: 0.7rem; color: var(--accent); }
        .mock-notif { margin-left: auto; font-size: 1.2rem; cursor: pointer; }

        .mock-stats-row {
          display: flex;
          align-items: center;
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
          padding: 0.75rem 1rem;
          margin-bottom: 1rem;
          gap: 8px;
        }

        .mock-stat {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .mock-stat-val {
          font-size: 0.9rem;
          font-weight: 800;
          font-family: var(--font-display);
          background: var(--gradient-text);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .mock-stat-lbl { font-size: 0.65rem; color: var(--text-muted); }

        .mock-stat-divider {
          width: 1px; height: 30px;
          background: var(--border-glass);
        }

        .mock-chart {
          display: flex;
          align-items: flex-end;
          gap: 5px;
          height: 70px;
          padding: 0 4px;
          margin-bottom: 1rem;
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
          padding: 8px;
        }

        .mock-bar {
          flex: 1;
          border-radius: 3px 3px 0 0;
          min-height: 4px;
        }

        .mock-leads {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .mock-lead-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 8px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-sm);
        }

        .mock-lead-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .mock-lead-name { flex: 1; font-size: 0.8rem; font-weight: 500; }
        .mock-lead-status { font-size: 0.7rem; font-weight: 600; }

        /* ---- STATS ---- */
        .stats-section {
          margin-top: -3rem;
          position: relative;
          z-index: 2;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .stat-card {
          padding: 1.5rem;
        }

        .stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .stat-icon { font-size: 2rem; }

        .stat-number {
          font-family: var(--font-display);
          font-size: 2.2rem;
          font-weight: 800;
          background: var(--gradient-text);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        /* ---- ABOUT ---- */
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .about-image-area { position: relative; }

        .about-image-card {
          text-align: center;
          padding: 2.5rem;
          background: linear-gradient(135deg, rgba(0, 212, 170, 0.05), rgba(108, 99, 255, 0.05));
        }

        .about-emoji { font-size: 5rem; margin-bottom: 1rem; }

        .about-image-label {
          font-size: 0.95rem;
          color: var(--text-secondary);
          font-weight: 500;
          margin-bottom: 1.5rem;
        }

        .about-stats-mini {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          padding-top: 1.25rem;
          border-top: 1px solid var(--border-glass);
        }

        .mini-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .mini-stat span:first-child { font-size: 1.1rem; }

        .mini-stat-div {
          width: 1px; height: 30px;
          background: var(--border-glass);
        }

        .about-float-card {
          position: absolute;
          bottom: -20px;
          right: -20px;
          padding: 1rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          animation: float 3s ease-in-out infinite;
        }

        .about-features {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .about-feature {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: var(--text-secondary);
          padding: 0.5rem;
          background: var(--bg-tertiary);
          border-radius: var(--radius-sm);
        }

        .feature-check { font-size: 1.1rem; }

        /* ---- STEPS ---- */
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          position: relative;
        }

        .step-card {
          text-align: center;
          position: relative;
        }

        .step-number {
          font-family: var(--font-display);
          font-size: 3rem;
          font-weight: 900;
          color: rgba(255,255,255,0.04);
          position: absolute;
          top: 12px;
          right: 16px;
        }

        .step-icon-wrap {
          width: 60px; height: 60px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1rem;
        }

        .step-icon { font-size: 1.8rem; }
        .step-card h4 { margin-bottom: 0.5rem; }
        .step-card p { font-size: 0.9rem; }

        .step-arrow {
          position: absolute;
          right: -18px;
          top: 40%;
          transform: translateY(-50%);
          font-size: 1.3rem;
          color: var(--primary);
          z-index: 2;
        }

        /* ---- PERSONA ---- */
        .persona-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .persona-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          display: block;
        }

        .persona-perks {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .persona-perk {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        /* ---- APP SHOWCASE ---- */
        .app-showcase-section {
          background: linear-gradient(135deg, var(--bg-secondary), rgba(0,212,170,0.02));
        }

        .app-showcase-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }

        .app-features {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .app-feature-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .app-feature-icon {
          width: 44px; height: 44px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-sm);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem;
          flex-shrink: 0;
        }

        /* Phone Mockup */
        .app-phone-wrap {
          position: relative;
          display: flex;
          justify-content: center;
        }

        .app-phone-glow {
          position: absolute;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(0,212,170,0.2), transparent 70%);
          bottom: -30px; left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
        }

        .app-phone {
          width: 260px;
          background: var(--bg-card);
          border: 2px solid var(--border-glass);
          border-radius: 32px;
          padding: 16px 12px;
          box-shadow: 0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05);
          position: relative;
          z-index: 2;
        }

        .phone-notch {
          width: 80px; height: 6px;
          background: var(--bg-tertiary);
          border-radius: 3px;
          margin: 0 auto 14px;
        }

        .phone-screen {
          background: var(--bg-secondary);
          border-radius: 20px;
          padding: 14px 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-height: 380px;
        }

        .phone-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .phone-welcome {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .phone-stats {
          display: flex;
          gap: 6px;
        }

        .phone-stat {
          flex: 1;
          background: var(--bg-tertiary);
          border-radius: 8px;
          padding: 6px 4px;
          display: flex; flex-direction: column;
          align-items: center; gap: 2px;
        }

        .phone-stat-val {
          font-size: 0.75rem;
          font-weight: 800;
          background: var(--gradient-text);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .phone-stat-lbl {
          font-size: 0.55rem;
          color: var(--text-muted);
        }

        .phone-chart {
          display: flex;
          align-items: flex-end;
          gap: 4px;
          height: 60px;
          background: var(--bg-tertiary);
          border-radius: 8px;
          padding: 6px;
        }

        .phone-bar {
          flex: 1;
          border-radius: 2px 2px 0 0;
          min-height: 4px;
        }

        .phone-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .phone-action-btn {
          padding: 6px 4px;
          background: var(--bg-tertiary);
          border-radius: 6px;
          font-size: 0.6rem;
          font-weight: 600;
          text-align: center;
          color: var(--text-secondary);
        }

        .phone-notification {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 8px;
          background: rgba(0,212,170,0.08);
          border: 1px solid rgba(0,212,170,0.2);
          border-radius: 8px;
          font-size: 0.65rem;
          color: var(--text-secondary);
        }

        /* ---- MARQUEE ---- */
        .marquee-wrapper { overflow: hidden; width: 100%; }
        .marquee-track {
          display: flex;
          gap: 1.5rem;
          animation: marquee 30s linear infinite;
          width: max-content;
        }

        .marquee-item {
          padding: 0.75rem 1.5rem;
          white-space: nowrap;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .marquee-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* ---- TESTIMONIALS ---- */
        .testimonial-card { display: flex; flex-direction: column; }
        .testimonial-header { display: flex; align-items: center; gap: 12px; margin-bottom: 1rem; }
        .testimonial-avatar { font-size: 2.5rem; }

        .income-comparison {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
          padding: 0.75rem 1rem;
          margin-bottom: 1rem;
        }

        .income-prev, .income-now {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .income-prev span:first-child,
        .income-now span:first-child {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }

        .income-val-prev {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-muted);
          text-decoration: line-through;
        }

        .income-val-now {
          font-size: 1.1rem;
          font-weight: 800;
        }

        .income-arrow {
          font-size: 1.2rem;
          color: var(--primary);
        }

        /* ---- CTA ---- */
        .cta-section {
          padding: 5rem 0;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary));
        }

        .cta-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0.4rem 1.2rem;
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid rgba(255, 215, 0, 0.25);
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--accent);
          margin-bottom: 1.5rem;
        }

        /* ---- RESPONSIVE ---- */
        @media (max-width: 1024px) {
          .hero-split { grid-template-columns: 1fr; gap: 3rem; }
          .hero-visual { display: none; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .steps-grid { grid-template-columns: repeat(2, 1fr); }
          .step-arrow { display: none; }
          .persona-grid { grid-template-columns: repeat(2, 1fr); }
          .app-showcase-grid { grid-template-columns: 1fr; }
          .app-phone-wrap { display: none; }
        }

        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .about-grid { grid-template-columns: 1fr; gap: 2rem; }
          .steps-grid { grid-template-columns: 1fr; }
          .about-features { grid-template-columns: 1fr; }
          .about-float-card { bottom: -10px; right: 10px; }
          .persona-grid { grid-template-columns: 1fr; }
          .hero-content { text-align: center; }
          .hero-badge, .hero-trust, .hero-actions { justify-content: center; }
        }
      `}</style>
    </>
  );
}
