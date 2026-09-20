'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { formatIndianCurrency } from '@/utils/sipCalculations';
import { formatRelativeTime } from '@/lib/activity';

const calculatorCards = [
  {
    type: 'SIP',
    title: 'SIP Calculator',
    desc: 'Calculate potential returns from your monthly investments with the power of compounding.',
    icon: '📈',
    href: '/dashboard/calculators/sip',
    color: '#19C3A3',
  },
  {
    type: 'EMI',
    title: 'EMI Calculator',
    desc: 'Calculate your monthly loan installments, total interest payable, and amortization schedule.',
    icon: '🏠',
    href: '/dashboard/calculators/emi',
    color: '#1e3a8a',
  },
  {
    type: 'LUMPSUM',
    title: 'Lumpsum Calculator',
    desc: 'Project how a single one-time capital investment grows exponentially over time.',
    icon: '💰',
    href: '/dashboard/calculators/lumpsum',
    color: '#d4af37',
  },
  {
    type: 'RETIREMENT',
    title: 'Retirement Calculator',
    desc: 'Estimate the corpus needed to maintain your lifestyle after retirement with inflation indexation.',
    icon: '🌴',
    href: '/dashboard/calculators/retirement',
    color: '#101b3b',
  },
];

const plansList = [
  {
    id: 'plan-1',
    name: 'Investment Planning',
    desc: 'Asset allocation, diversified mutual fund portfolio, and risk profile optimization.',
    status: 'ACTIVE',
    createdDate: '15 Jan 2026',
    nextAction: 'Review annual rebalancing',
    icon: '💹',
    link: '/services/investment-planning',
  },
  {
    id: 'plan-2',
    name: 'Retirement Planning',
    desc: 'Targeted pension accumulation, inflation-adjusted corpus projection, and annuity planning.',
    status: 'ACTIVE',
    createdDate: '02 Feb 2026',
    nextAction: 'Increase SIP contribution by 10%',
    icon: '🌴',
    link: '/services/retirement-planning',
  },
  {
    id: 'plan-3',
    name: 'Insurance Planning',
    desc: 'Comprehensive term cover, family floater health cover, and critical illness shielding.',
    status: 'IN_REVIEW',
    createdDate: '20 Feb 2026',
    nextAction: 'Submit medical disclosure documents',
    icon: '🛡️',
    link: '/services/insurance-planning',
  },
  {
    id: 'plan-4',
    name: 'Tax Planning',
    desc: 'Section 80C, 80D deductions optimization, ELSS routing, and capital gains harvesting.',
    status: 'ACTIVE',
    createdDate: '10 Mar 2026',
    nextAction: 'Schedule FY26 tax review',
    icon: '📋',
    link: '/services/tax-planning',
  },
  {
    id: 'plan-5',
    name: 'Wealth Management',
    desc: 'Bespoke high-net-worth portfolio management, multi-asset diversification, and legacy planning.',
    status: 'RECOMMENDED',
    createdDate: '—',
    nextAction: 'Connect with a senior wealth advisor',
    icon: '🏦',
    link: '/services/wealth-management',
  },
  {
    id: 'plan-6',
    name: 'Financial Planning',
    desc: 'Holistic 360-degree financial health roadmap covering emergency reserves and debt reduction.',
    status: 'ACTIVE',
    createdDate: '01 Jan 2026',
    nextAction: 'Maintain 6-month emergency reserve',
    icon: '📊',
    link: '/services/financial-planning',
  },
];

export default function UserDashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Goal Creation Modal State
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [goalSubmitting, setGoalSubmitting] = useState(false);
  const [goalForm, setGoalForm] = useState({
    name: '',
    goalCategory: 'Retirement',
    targetAmount: '',
    currentAmount: '',
    monthlyContribution: '',
    targetDate: '',
    description: '',
  });
  const [goalErrors, setGoalErrors] = useState({});

  // Appointment Booking Modal State
  const [apptModalOpen, setApptModalOpen] = useState(false);
  const [apptSubmitting, setApptSubmitting] = useState(false);
  const [apptForm, setApptForm] = useState({
    service: 'Investment Planning',
    appointmentDate: '',
    appointmentTime: '10:00 AM',
    notes: '',
  });
  const [apptErrors, setApptErrors] = useState({});

  // Contact Advisor State
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState('');
  const [contactForm, setContactForm] = useState({
    phone: '',
    subject: 'Financial Planning Advice',
    message: '',
  });
  const [contactErrors, setContactErrors] = useState({});
  const [userInquiries, setUserInquiries] = useState([]);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [dashRes, inqRes] = await Promise.all([
        fetch('/api/dashboard'),
        fetch('/api/user/contact'),
      ]);

      const dashJson = await dashRes.json();
      if (dashRes.ok && dashJson.success) {
        setDashboardData(dashJson.data);
      } else {
        setError(dashJson.message || 'Unable to load dashboard information.');
      }

      if (inqRes.ok) {
        const inqJson = await inqRes.json();
        if (inqJson.success) {
          setUserInquiries(inqJson.enquiries || []);
        }
      }
    } catch {
      setError('Unable to connect to the server. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Handle Add Goal
  const handleCreateGoal = async (e) => {
    e.preventDefault();
    setGoalErrors({});

    const errors = {};
    if (!goalForm.name.trim()) errors.name = 'Goal name is required.';
    const target = parseFloat(goalForm.targetAmount);
    if (isNaN(target) || target <= 0) errors.targetAmount = 'Enter a valid target amount greater than 0.';
    if (goalForm.currentAmount && (isNaN(parseFloat(goalForm.currentAmount)) || parseFloat(goalForm.currentAmount) < 0)) {
      errors.currentAmount = 'Current amount cannot be negative.';
    }
    if (goalForm.targetDate) {
      const d = new Date(goalForm.targetDate);
      if (isNaN(d.getTime())) errors.targetDate = 'Enter a valid date.';
    }

    if (Object.keys(errors).length > 0) {
      setGoalErrors(errors);
      return;
    }

    setGoalSubmitting(true);
    try {
      const res = await fetch('/api/user/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalForm),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast('Financial goal created successfully!');
        setGoalModalOpen(false);
        setGoalForm({
          name: '',
          goalCategory: 'Retirement',
          targetAmount: '',
          currentAmount: '',
          monthlyContribution: '',
          targetDate: '',
          description: '',
        });
        loadDashboard();
      } else {
        setGoalErrors(data.errors || { general: data.message || 'Failed to create goal.' });
      }
    } catch {
      setGoalErrors({ general: 'An unexpected error occurred while saving goal.' });
    } finally {
      setGoalSubmitting(false);
    }
  };

  // Handle Book Appointment
  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setApptErrors({});

    const errors = {};
    if (!apptForm.service) errors.service = 'Please select a service.';
    if (!apptForm.appointmentDate) errors.appointmentDate = 'Please select an appointment date.';
    if (!apptForm.appointmentTime) errors.appointmentTime = 'Please select a time.';

    if (Object.keys(errors).length > 0) {
      setApptErrors(errors);
      return;
    }

    setApptSubmitting(true);
    try {
      const res = await fetch('/api/user/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apptForm),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast('Appointment booked successfully!');
        setApptModalOpen(false);
        setApptForm({
          service: 'Investment Planning',
          appointmentDate: '',
          appointmentTime: '10:00 AM',
          notes: '',
        });
        loadDashboard();
      } else {
        setApptErrors(data.errors || { general: data.message || 'Failed to book appointment.' });
      }
    } catch {
      setApptErrors({ general: 'An unexpected error occurred while booking appointment.' });
    } finally {
      setApptSubmitting(false);
    }
  };

  // Handle Contact Advisor
  const handleContactAdvisor = async (e) => {
    e.preventDefault();
    setContactErrors({});
    setContactSuccess('');

    const errors = {};
    if (!contactForm.subject.trim()) errors.subject = 'Subject is required.';
    if (!contactForm.message.trim()) errors.message = 'Please enter your message or question.';

    if (Object.keys(errors).length > 0) {
      setContactErrors(errors);
      return;
    }

    setContactSubmitting(true);
    try {
      const res = await fetch('/api/user/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setContactSuccess('Your message has been received. An advisor will get back to you shortly!');
        showToast('Advisor message sent successfully!');
        setContactForm({
          phone: '',
          subject: 'Financial Planning Advice',
          message: '',
        });
        // refresh enquiries
        const inqRes = await fetch('/api/user/contact');
        if (inqRes.ok) {
          const inqJson = await inqRes.json();
          setUserInquiries(inqJson.enquiries || []);
        }
      } else {
        setContactErrors(data.errors || { general: data.message || 'Failed to send inquiry.' });
      }
    } catch {
      setContactErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setContactSubmitting(false);
    }
  };

  const user = dashboardData?.user;
  const userName = user?.fullName || 'Valued Client';
  const overview = dashboardData?.financialOverview;

  return (
    <DashboardLayout>
      <head>
        <title>User Dashboard | GrowthNest Financial Planning</title>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000, background: toastMessage.type === 'success' ? '#10b981' : '#ef4444', color: '#ffffff', padding: '0.85rem 1.4rem', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600, fontSize: '0.9rem', animation: 'fadeIn 0.2s ease-in-out' }}>
          <span>{toastMessage.type === 'success' ? '✓' : '⚠️'}</span>
          <span>{toastMessage.message}</span>
        </div>
      )}

      {error ? (
        <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', background: '#ffffff', borderRadius: '12px', border: '1px solid #fee2e2' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚠️</div>
          <h3 style={{ color: '#e11d48', margin: '0 0 0.5rem' }}>{error}</h3>
          <p style={{ color: 'var(--gray-600)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
            We could not retrieve your account information at this moment.
          </p>
          <button type="button" onClick={loadDashboard} className="btn btn-primary btn-sm">
            🔄 Retry Loading
          </button>
        </div>
      ) : loading ? (
        <DashboardSkeleton />
      ) : (
        <div className="db-dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* SECTION 1: WELCOME SECTION */}
          <section className="db-welcome-section" style={{ background: 'linear-gradient(135deg, #101b3b 0%, #1e3a8a 100%)', borderRadius: '16px', padding: '2rem', color: '#ffffff', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0 0 0.4rem', fontFamily: "'Playfair Display', serif", color: '#ffffff' }}>
                Welcome back, {userName} 👋
              </h2>
              <p style={{ fontSize: '1rem', color: '#e2e8f0', margin: '0 0 1.5rem', opacity: 0.9 }}>
                Manage your financial goals and plans from one place.
              </p>

              {/* SECTION 5: QUICK ACTIONS */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                <Link href="/dashboard/calculators/sip" className="btn btn-sm" style={{ background: '#19C3A3', color: '#101b3b', fontWeight: 700, border: 'none' }}>
                  📈 Calculate SIP
                </Link>
                <Link href="/dashboard/calculators/emi" className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)' }}>
                  🏠 Calculate EMI
                </Link>
                <Link href="/dashboard/calculators/lumpsum" className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)' }}>
                  💰 Calculate Lumpsum
                </Link>
                <Link href="/dashboard/calculators/retirement" className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)' }}>
                  🌴 Plan Retirement
                </Link>
                <button
                  type="button"
                  onClick={() => setGoalModalOpen(true)}
                  className="btn btn-sm"
                  style={{ background: '#d4af37', color: '#101b3b', fontWeight: 700, border: 'none' }}
                >
                  🎯 Set Financial Goal
                </button>
                <button
                  type="button"
                  onClick={() => setApptModalOpen(true)}
                  className="btn btn-sm"
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)' }}
                >
                  📅 Book Appointment
                </button>
                <a
                  href="#contact-advisor"
                  className="btn btn-sm"
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)' }}
                >
                  💬 Contact Advisor
                </a>
              </div>
            </div>
          </section>

          {/* SECTION 2: FINANCIAL OVERVIEW */}
          <section id="financial-overview">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                  Financial Overview
                </h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--gray-500)' }}>
                  Your aggregate investment metrics and goal allocations
                </p>
              </div>
            </div>

            {/* Empty investment data fallback message */}
            {!overview?.hasInvestmentData && (
              <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>ℹ️</span>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--primary-900)', fontSize: '0.92rem' }}>
                      No investment data available yet.
                    </div>
                    <div style={{ color: 'var(--gray-600)', fontSize: '0.82rem' }}>
                      Add your financial goals and portfolio details to see your comprehensive overview.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setGoalModalOpen(true)}
                  className="btn btn-outline btn-sm"
                  style={{ color: '#1e3a8a', borderColor: '#1e3a8a' }}
                >
                  + Add Financial Goal
                </button>
              </div>
            )}

            {/* Overview Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {/* Total Investments */}
              <div className="glass-card-static" style={{ background: '#ffffff', padding: '1.35rem', borderRadius: '12px', borderLeft: '4px solid #19C3A3', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-600)' }}>Total Investments</span>
                  <span style={{ fontSize: '1.25rem' }}>💼</span>
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--primary-900)', fontFamily: "'Playfair Display', serif" }}>
                  {overview?.totalInvestments > 0 ? formatIndianCurrency(overview.totalInvestments) : '₹0'}
                </div>
                <div style={{ fontSize: '0.75rem', color: overview?.totalInvestments > 0 ? '#16a34a' : 'var(--gray-400)', marginTop: '0.35rem' }}>
                  {overview?.totalInvestments > 0 ? 'Verified Portfolio' : 'No investments tracked'}
                </div>
              </div>

              {/* Portfolio Value */}
              <div className="glass-card-static" style={{ background: '#ffffff', padding: '1.35rem', borderRadius: '12px', borderLeft: '4px solid #1e3a8a', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-600)' }}>Portfolio Value</span>
                  <span style={{ fontSize: '1.25rem' }}>📈</span>
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--primary-900)', fontFamily: "'Playfair Display', serif" }}>
                  {overview?.portfolioValue > 0 ? formatIndianCurrency(overview.portfolioValue) : '₹0'}
                </div>
                <div style={{ fontSize: '0.75rem', color: overview?.portfolioValue > 0 ? '#16a34a' : 'var(--gray-400)', marginTop: '0.35rem' }}>
                  {overview?.portfolioValue > 0 ? 'Current Valuation' : 'No active holdings'}
                </div>
              </div>

              {/* Monthly SIP */}
              <div className="glass-card-static" style={{ background: '#ffffff', padding: '1.35rem', borderRadius: '12px', borderLeft: '4px solid #d4af37', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-600)' }}>Monthly SIP</span>
                  <span style={{ fontSize: '1.25rem' }}>💳</span>
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--primary-900)', fontFamily: "'Playfair Display', serif" }}>
                  {overview?.monthlySIP > 0 ? formatIndianCurrency(overview.monthlySIP) : '₹0'}
                </div>
                <div style={{ fontSize: '0.75rem', color: overview?.monthlySIP > 0 ? '#16a34a' : 'var(--gray-400)', marginTop: '0.35rem' }}>
                  {overview?.monthlySIP > 0 ? 'Scheduled Auto-Debit' : 'No active SIP'}
                </div>
              </div>

              {/* Financial Goals Count */}
              <div className="glass-card-static" style={{ background: '#ffffff', padding: '1.35rem', borderRadius: '12px', borderLeft: '4px solid #101b3b', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-600)' }}>Financial Goals</span>
                  <span style={{ fontSize: '1.25rem' }}>🎯</span>
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--primary-900)', fontFamily: "'Playfair Display', serif" }}>
                  {overview?.goalCount || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: overview?.goalCount > 0 ? '#16a34a' : 'var(--gray-400)', marginTop: '0.35rem' }}>
                  {overview?.goalCount > 0 ? `${dashboardData?.activeGoalCount || 0} In Progress` : '0 Active Goals'}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: FINANCIAL CALCULATORS */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                  Financial Calculators
                </h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--gray-500)' }}>
                  Plan your wealth, investments, and repayments with precision
                </p>
              </div>
              <Link href="/dashboard/calculators" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e3a8a', textDecoration: 'none' }}>
                View All Tools →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
              {calculatorCards.map((calc) => (
                <div
                  key={calc.type}
                  className="glass-card-static"
                  style={{
                    background: '#ffffff',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>{calc.icon}</span>
                      <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                        {calc.title}
                      </h4>
                    </div>
                    <p style={{ margin: '0 0 1.25rem', fontSize: '0.82rem', color: 'var(--gray-600)', lineHeight: 1.5 }}>
                      {calc.desc}
                    </p>
                  </div>
                  <Link
                    href={calc.href}
                    className="btn btn-outline btn-sm"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      borderColor: calc.color,
                      color: calc.color === '#19C3A3' ? '#0d9488' : calc.color,
                      fontWeight: 600,
                    }}
                  >
                    Open Calculator →
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 5: FINANCIAL GOALS */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                  My Financial Goals
                </h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--gray-500)' }}>
                  Track progress towards your major financial milestones
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setGoalModalOpen(true)}
                  className="btn btn-primary btn-sm"
                  style={{ background: '#101b3b', borderColor: '#101b3b' }}
                >
                  + Add Goal
                </button>
                <Link
                  href="/dashboard/goals"
                  className="btn btn-outline btn-sm"
                  style={{ color: '#1e3a8a', borderColor: '#1e3a8a' }}
                >
                  Manage All →
                </Link>
              </div>
            </div>

            {/* Goals List / Empty State */}
            {!dashboardData?.recentGoals || dashboardData.recentGoals.length === 0 ? (
              <div className="glass-card-static" style={{ background: '#ffffff', padding: '2.5rem', textAlign: 'center', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎯</div>
                <h4 style={{ margin: '0 0 0.4rem', color: 'var(--primary-900)', fontSize: '1.1rem' }}>
                  No financial goals yet.
                </h4>
                <p style={{ color: 'var(--gray-600)', fontSize: '0.85rem', margin: '0 0 1.25rem' }}>
                  Set a goal for retirement, purchasing a home, higher education, or an emergency fund.
                </p>
                <button
                  type="button"
                  onClick={() => setGoalModalOpen(true)}
                  className="btn btn-primary btn-sm"
                >
                  + Create Your First Goal
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {dashboardData.recentGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="glass-card-static"
                    style={{
                      background: '#ffffff',
                      padding: '1.4rem',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.72rem', background: '#f1f5f9', color: '#475569', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                          {goal.category || 'GOAL'}
                        </span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: goal.progress >= 100 ? '#16a34a' : '#1e3a8a' }}>
                          {goal.progress}%
                        </span>
                      </div>

                      <h4 style={{ margin: '0 0 0.85rem', fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                        {goal.name}
                      </h4>

                      {/* Progress Bar */}
                      <div style={{ background: '#e2e8f0', borderRadius: '6px', height: '8px', overflow: 'hidden', marginBottom: '1rem' }}>
                        <div
                          style={{
                            width: `${Math.min(100, goal.progress)}%`,
                            height: '100%',
                            background: goal.progress >= 100 ? '#16a34a' : 'linear-gradient(90deg, #19C3A3, #1e3a8a)',
                            borderRadius: '6px',
                            transition: 'width 0.4s ease',
                          }}
                        />
                      </div>

                      {/* Amounts Breakdown */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.4rem' }}>
                        <span style={{ color: 'var(--gray-500)' }}>Current:</span>
                        <span style={{ fontWeight: 700, color: 'var(--primary-900)' }}>
                          {formatIndianCurrency(goal.currentAmount)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.75rem' }}>
                        <span style={{ color: 'var(--gray-500)' }}>Target:</span>
                        <span style={{ fontWeight: 700, color: '#1e3a8a' }}>
                          {formatIndianCurrency(goal.targetAmount)}
                        </span>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.65rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                      <span>
                        Target: {goal.targetDate ? new Date(goal.targetDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Flexible'}
                      </span>
                      <Link href="/dashboard/goals" style={{ color: '#1e3a8a', fontWeight: 600, textDecoration: 'none' }}>
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* SECTION 6: MY PLANS */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                  My Plans
                </h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--gray-500)' }}>
                  Financial planning tracks and advisory blueprints
                </p>
              </div>
              <Link href="/dashboard/plans" className="btn btn-outline btn-sm" style={{ color: '#1e3a8a', borderColor: '#1e3a8a' }}>
                Explore Services →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {plansList.map((plan) => (
                <div
                  key={plan.id}
                  className="glass-card-static"
                  style={{
                    background: '#ffffff',
                    padding: '1.4rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>{plan.icon}</span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '12px',
                          background:
                            plan.status === 'ACTIVE' ? '#dcfce7' : plan.status === 'IN_REVIEW' ? '#fef3c7' : '#f1f5f9',
                          color:
                            plan.status === 'ACTIVE' ? '#15803d' : plan.status === 'IN_REVIEW' ? '#b45309' : '#475569',
                        }}
                      >
                        {plan.status}
                      </span>
                    </div>
                    <h4 style={{ margin: '0 0 0.4rem', fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                      {plan.name}
                    </h4>
                    <p style={{ margin: '0 0 1rem', fontSize: '0.8rem', color: 'var(--gray-600)', lineHeight: 1.4 }}>
                      {plan.desc}
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', fontSize: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', color: 'var(--gray-500)' }}>
                      <span>Enrolled Date:</span>
                      <strong style={{ color: 'var(--gray-700)' }}>{plan.createdDate}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--gray-500)' }}>
                      <span>Next Action:</span>
                      <span style={{ color: '#0369a1', fontWeight: 600, textAlign: 'right' }}>{plan.nextAction}</span>
                    </div>
                    <Link
                      href={plan.link}
                      className="btn btn-outline btn-sm"
                      style={{ width: '100%', justifyContent: 'center', fontSize: '0.78rem' }}
                    >
                      Plan Overview →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* TWO COLUMN ROW: APPOINTMENTS & RECENT ACTIVITY */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {/* SECTION 7: APPOINTMENTS */}
            <section className="glass-card-static" style={{ background: '#ffffff', padding: '1.6rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                  📅 Upcoming Appointments
                </h3>
                <Link href="/dashboard/appointments" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e3a8a', textDecoration: 'none' }}>
                  View All →
                </Link>
              </div>

              {!dashboardData?.upcomingAppointments || dashboardData.upcomingAppointments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', background: '#f8fafc', borderRadius: '8px' }}>
                  <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🗓️</span>
                  <div style={{ fontWeight: 600, color: 'var(--primary-900)', fontSize: '0.92rem', marginBottom: '0.3rem' }}>
                    No upcoming appointments.
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: '1rem' }}>
                    Consult with an experienced financial advisor at your preferred time.
                  </p>
                  <button
                    type="button"
                    onClick={() => setApptModalOpen(true)}
                    className="btn btn-primary btn-sm"
                  >
                    Book Appointment
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {dashboardData.upcomingAppointments.map((appt) => (
                    <div
                      key={appt.id}
                      style={{
                        padding: '1rem',
                        background: '#f8fafc',
                        borderRadius: '10px',
                        borderLeft: '4px solid #1e3a8a',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--primary-900)', fontSize: '0.92rem' }}>
                          {appt.service}
                        </span>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.5rem',
                            borderRadius: '10px',
                            background:
                              appt.status === 'CONFIRMED'
                                ? '#dcfce7'
                                : appt.status === 'CANCELLED'
                                ? '#fee2e2'
                                : '#fef3c7',
                            color:
                              appt.status === 'CONFIRMED'
                                ? '#15803d'
                                : appt.status === 'CANCELLED'
                                ? '#b91c1c'
                                : '#b45309',
                          }}
                        >
                          {appt.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--gray-600)', marginBottom: '0.2rem' }}>
                        📅 {new Date(appt.appointmentDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} at {appt.appointmentTime}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                        Advisor: {appt.advisor}
                      </div>
                    </div>
                  ))}

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setApptModalOpen(true)}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      Book Another
                    </button>
                    <Link
                      href="/dashboard/appointments"
                      className="btn btn-outline btn-sm"
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      View All
                    </Link>
                  </div>
                </div>
              )}
            </section>

            {/* SECTION 9: RECENT ACTIVITY */}
            <section className="glass-card-static" style={{ background: '#ffffff', padding: '1.6rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                  🕒 Recent Activity
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Isolated to your account</span>
              </div>

              {!dashboardData?.recentActivities || dashboardData.recentActivities.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', background: '#f8fafc', borderRadius: '8px' }}>
                  <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🍃</span>
                  <div style={{ fontWeight: 600, color: 'var(--gray-600)', fontSize: '0.88rem' }}>
                    No recent activity yet.
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--gray-400)', margin: '0.2rem 0 0' }}>
                    Actions like creating goals, saving calculations, or booking consultations will log here.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {dashboardData.recentActivities.map((act) => (
                    <div
                      key={act.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        padding: '0.65rem 0',
                        borderBottom: '1px solid #f8fafc',
                      }}
                    >
                      <span style={{ fontSize: '1rem', background: '#f1f5f9', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        ⚡
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary-900)' }}>
                          {act.description}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)', marginTop: '0.15rem' }}>
                          {formatRelativeTime(act.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* SECTION 8: CONTACT ADVISOR */}
          <section id="contact-advisor" className="glass-card-static" style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.35rem', fontWeight: 700, color: 'var(--primary-900)', fontFamily: "'Playfair Display', serif" }}>
                  💬 Contact Senior Financial Advisor
                </h3>
                <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--gray-600)' }}>
                  Submit an inquiry, request a consultation, or ask a question. Our advisory team will respond within 24 hours.
                </p>
              </div>
            </div>

            {contactSuccess && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '0.85rem 1.25rem', borderRadius: '8px', fontSize: '0.88rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>✓</span>
                <span>{contactSuccess}</span>
              </div>
            )}

            {contactErrors.general && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecdd3', color: '#b91c1c', padding: '0.85rem 1.25rem', borderRadius: '8px', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                ⚠️ {contactErrors.general}
              </div>
            )}

            <form onSubmit={handleContactAdvisor} noValidate style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              {/* Auto-populated Name */}
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary-900)' }}>
                  Name
                </label>
                <input
                  type="text"
                  value={user?.fullName || ''}
                  disabled
                  className="form-input"
                  style={{ background: '#f8fafc', cursor: 'not-allowed', color: '#64748b' }}
                />
              </div>

              {/* Auto-populated Email */}
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary-900)' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="form-input"
                  style={{ background: '#f8fafc', cursor: 'not-allowed', color: '#64748b' }}
                />
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label" htmlFor="advisor-phone" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary-900)' }}>
                  Phone Number (Optional)
                </label>
                <input
                  id="advisor-phone"
                  type="tel"
                  value={contactForm.phone || user?.phone || ''}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  className="form-input"
                  placeholder="+91 98765 43210"
                />
              </div>

              {/* Subject */}
              <div className="form-group">
                <label className="form-label" htmlFor="advisor-subject" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary-900)' }}>
                  Subject / Inquiring About *
                </label>
                <select
                  id="advisor-subject"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="form-input"
                >
                  <option value="Financial Planning Advice">Financial Planning Advice</option>
                  <option value="Portfolio Review">Portfolio Review &amp; Optimization</option>
                  <option value="Retirement Advisory">Retirement Corpus Planning</option>
                  <option value="Tax Saving Strategies">Tax Saving Strategies (80C / 80D)</option>
                  <option value="Insurance Coverage Analysis">Insurance Coverage Analysis</option>
                  <option value="Wealth Management Consultation">High Net Worth Consultation</option>
                  <option value="Other Consultation">Other Consultation</option>
                </select>
                {contactErrors.subject && <p className="sip-error-msg">{contactErrors.subject}</p>}
              </div>

              {/* Message */}
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" htmlFor="advisor-message" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary-900)' }}>
                  Your Message or Question *
                </label>
                <textarea
                  id="advisor-message"
                  rows={3}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className={`form-input ${contactErrors.message ? 'is-invalid' : ''}`}
                  placeholder="Describe your current financial queries, goals, or preferred discussion topic..."
                />
                {contactErrors.message && <p className="sip-error-msg">{contactErrors.message}</p>}
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-start' }}>
                <button
                  type="submit"
                  disabled={contactSubmitting}
                  className="btn btn-primary"
                  style={{ background: '#101b3b', borderColor: '#101b3b', padding: '0.75rem 2rem' }}
                >
                  {contactSubmitting ? 'Sending Request...' : 'Send Message to Advisor'}
                </button>
              </div>
            </form>

            {/* Submission Status List */}
            {userInquiries.length > 0 && (
              <div style={{ marginTop: '2rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
                <h4 style={{ margin: '0 0 0.85rem', fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                  Your Submitted Requests &amp; Status
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {userInquiries.slice(0, 3).map((inq) => (
                    <div
                      key={inq.id}
                      style={{
                        padding: '0.85rem 1rem',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--primary-900)' }}>
                          {inq.subject}
                        </span>
                        <div style={{ fontSize: '0.72rem', color: 'var(--gray-500)', marginTop: '0.15rem' }}>
                          Submitted on {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '12px',
                          background:
                            inq.status === 'Resolved'
                              ? '#dcfce7'
                              : inq.status === 'In Progress'
                              ? '#e0f2fe'
                              : '#fef3c7',
                          color:
                            inq.status === 'Resolved'
                              ? '#15803d'
                              : inq.status === 'In Progress'
                              ? '#0369a1'
                              : '#b45309',
                        }}
                      >
                        ● {inq.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* SECTION 10: PERSONALIZED INSIGHTS */}
          <section>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-900)' }}>
              💡 Personalized Insights &amp; Financial Guidance
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <div className="glass-card-static" style={{ background: '#ffffff', padding: '1.4rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏳</div>
                <h4 style={{ margin: '0 0 0.4rem', fontSize: '0.98rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                  Compound Interest Advantage
                </h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--gray-600)', lineHeight: 1.5 }}>
                  Increasing your monthly SIP by just 10% each year can nearly double your wealth corpus over a 15-year horizon.
                </p>
              </div>

              <div className="glass-card-static" style={{ background: '#ffffff', padding: '1.4rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🛡️</div>
                <h4 style={{ margin: '0 0 0.4rem', fontSize: '0.98rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                  Liquidity Shield
                </h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--gray-600)', lineHeight: 1.5 }}>
                  Keep at least 6 months of living expenses in an accessible, low-volatility liquid fund before locking in long-term equity.
                </p>
              </div>

              <div className="glass-card-static" style={{ background: '#ffffff', padding: '1.4rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚖️</div>
                <h4 style={{ margin: '0 0 0.4rem', fontSize: '0.98rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                  Asset Rebalancing
                </h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--gray-600)', lineHeight: 1.5 }}>
                  Annual rebalancing helps lock in stock market gains and buys undervalued debt assets, reducing portfolio volatility.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: ADD FINANCIAL GOAL */}
      {/* ======================================================== */}
      {goalModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-card" style={{ background: '#ffffff', maxWidth: '520px', width: '100%', borderRadius: '16px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                🎯 Create Financial Goal
              </h3>
              <button
                type="button"
                onClick={() => setGoalModalOpen(false)}
                style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--gray-500)' }}
              >
                ✕
              </button>
            </div>

            {goalErrors.general && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecdd3', color: '#b91c1c', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                ⚠️ {goalErrors.general}
              </div>
            )}

            <form onSubmit={handleCreateGoal} noValidate>
              {/* Goal Name */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" htmlFor="goal-name" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                  Goal Name *
                </label>
                <input
                  id="goal-name"
                  type="text"
                  placeholder="e.g. Retirement Corpus, Villa in Goa"
                  value={goalForm.name}
                  onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
                  className={`form-input ${goalErrors.name ? 'is-invalid' : ''}`}
                />
                {goalErrors.name && <p className="sip-error-msg">{goalErrors.name}</p>}
              </div>

              {/* Goal Category */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" htmlFor="goal-category" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                  Category *
                </label>
                <select
                  id="goal-category"
                  value={goalForm.goalCategory}
                  onChange={(e) => setGoalForm({ ...goalForm, goalCategory: e.target.value })}
                  className="form-input"
                >
                  <option value="Retirement">Retirement</option>
                  <option value="Buy a House">Buy a House</option>
                  <option value="Emergency Fund">Emergency Fund</option>
                  <option value="Higher Education">Higher Education</option>
                  <option value="Buy a Car">Buy a Car</option>
                  <option value="Travel">Travel</option>
                  <option value="Custom Goal">Custom Goal</option>
                </select>
              </div>

              {/* Target Amount & Current Amount */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="goal-target" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    Target Amount (₹) *
                  </label>
                  <input
                    id="goal-target"
                    type="number"
                    min="1"
                    placeholder="5000000"
                    value={goalForm.targetAmount}
                    onChange={(e) => setGoalForm({ ...goalForm, targetAmount: e.target.value })}
                    className={`form-input ${goalErrors.targetAmount ? 'is-invalid' : ''}`}
                  />
                  {goalErrors.targetAmount && <p className="sip-error-msg">{goalErrors.targetAmount}</p>}
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="goal-current" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    Current Amount (₹)
                  </label>
                  <input
                    id="goal-current"
                    type="number"
                    min="0"
                    placeholder="1250000"
                    value={goalForm.currentAmount}
                    onChange={(e) => setGoalForm({ ...goalForm, currentAmount: e.target.value })}
                    className={`form-input ${goalErrors.currentAmount ? 'is-invalid' : ''}`}
                  />
                  {goalErrors.currentAmount && <p className="sip-error-msg">{goalErrors.currentAmount}</p>}
                </div>
              </div>

              {/* Target Date & Monthly Contribution */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="goal-date" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    Target Date
                  </label>
                  <input
                    id="goal-date"
                    type="date"
                    value={goalForm.targetDate}
                    onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
                    className="form-input"
                  />
                  {goalErrors.targetDate && <p className="sip-error-msg">{goalErrors.targetDate}</p>}
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="goal-sip" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    Monthly SIP (₹)
                  </label>
                  <input
                    id="goal-sip"
                    type="number"
                    min="0"
                    placeholder="25000"
                    value={goalForm.monthlyContribution}
                    onChange={(e) => setGoalForm({ ...goalForm, monthlyContribution: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" htmlFor="goal-desc" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                  Description (Optional)
                </label>
                <textarea
                  id="goal-desc"
                  rows={2}
                  placeholder="Notes on investment instruments or timeline..."
                  value={goalForm.description}
                  onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setGoalModalOpen(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={goalSubmitting}
                  className="btn btn-primary"
                  style={{ background: '#101b3b', borderColor: '#101b3b' }}
                >
                  {goalSubmitting ? 'Saving...' : 'Save Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: BOOK APPOINTMENT */}
      {/* ======================================================== */}
      {apptModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-card" style={{ background: '#ffffff', maxWidth: '480px', width: '100%', borderRadius: '16px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                📅 Book Advisor Consultation
              </h3>
              <button
                type="button"
                onClick={() => setApptModalOpen(false)}
                style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--gray-500)' }}
              >
                ✕
              </button>
            </div>

            {apptErrors.general && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecdd3', color: '#b91c1c', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                ⚠️ {apptErrors.general}
              </div>
            )}

            <form onSubmit={handleBookAppointment} noValidate>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" htmlFor="appt-service" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                  Advisory Service *
                </label>
                <select
                  id="appt-service"
                  value={apptForm.service}
                  onChange={(e) => setApptForm({ ...apptForm, service: e.target.value })}
                  className="form-input"
                >
                  <option value="Investment Planning">Investment Planning</option>
                  <option value="Retirement Planning">Retirement Planning</option>
                  <option value="Tax Planning">Tax Planning</option>
                  <option value="Insurance Planning">Insurance Planning</option>
                  <option value="Wealth Management">Wealth Management</option>
                  <option value="Financial Planning">360° Financial Planning</option>
                </select>
                {apptErrors.service && <p className="sip-error-msg">{apptErrors.service}</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="appt-date" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    Preferred Date *
                  </label>
                  <input
                    id="appt-date"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={apptForm.appointmentDate}
                    onChange={(e) => setApptForm({ ...apptForm, appointmentDate: e.target.value })}
                    className={`form-input ${apptErrors.appointmentDate ? 'is-invalid' : ''}`}
                  />
                  {apptErrors.appointmentDate && <p className="sip-error-msg">{apptErrors.appointmentDate}</p>}
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="appt-time" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    Preferred Time *
                  </label>
                  <select
                    id="appt-time"
                    value={apptForm.appointmentTime}
                    onChange={(e) => setApptForm({ ...apptForm, appointmentTime: e.target.value })}
                    className="form-input"
                  >
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:30 PM">05:30 PM</option>
                  </select>
                  {apptErrors.appointmentTime && <p className="sip-error-msg">{apptErrors.appointmentTime}</p>}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" htmlFor="appt-notes" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                  Meeting Notes / Questions (Optional)
                </label>
                <textarea
                  id="appt-notes"
                  rows={2}
                  placeholder="Share details regarding your portfolio or consultation goals..."
                  value={apptForm.notes}
                  onChange={(e) => setApptForm({ ...apptForm, notes: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setApptModalOpen(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={apptSubmitting}
                  className="btn btn-primary"
                  style={{ background: '#101b3b', borderColor: '#101b3b' }}
                >
                  {apptSubmitting ? 'Booking...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function DashboardSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ height: '160px', background: 'linear-gradient(135deg, #101b3b 0%, #1e3a8a 100%)', borderRadius: '16px', opacity: 0.8 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card-static" style={{ height: '110px', background: '#ffffff', borderRadius: '12px' }} />
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {[1, 2].map((i) => (
          <div key={i} className="glass-card-static" style={{ height: '220px', background: '#ffffff', borderRadius: '12px' }} />
        ))}
      </div>
    </div>
  );
}
