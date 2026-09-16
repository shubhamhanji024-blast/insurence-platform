'use client';
import { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/context/AuthContext';

const servicesList = [
  {
    id: 'financial-planning',
    title: 'Financial Planning',
    desc: 'Comprehensive financial roadmaps tailored to your life goals — from wealth building to emergency funds and beyond.',
    features: ['Goal-Based Wealth Planning', 'Cash Flow & Expense Structuring', 'Emergency Fund Advisory', 'Debt Optimization'],
    icon: '📊',
    color: '#19C3A3',
  },
  {
    id: 'investment-planning',
    title: 'Investment Planning',
    desc: 'Personalized investment strategies and diversified portfolio management to grow your wealth steadily over time.',
    features: ['Asset Allocation Strategy', 'Mutual Fund & Equity Curation', 'SIP & Lumpsum Structuring', 'Periodic Rebalancing'],
    icon: '💹',
    color: '#1e3a8a',
  },
  {
    id: 'wealth-management',
    title: 'Wealth Management',
    desc: 'Holistic wealth strategies for high-net-worth individuals — asset allocation, legacy planning, and portfolio optimization.',
    features: ['HNI Portfolio Management', 'Estate & Legacy Planning', 'Alternative Investments', 'Dedicated Wealth Advisor'],
    icon: '🏦',
    color: '#d4af37',
  },
  {
    id: 'retirement-planning',
    title: 'Retirement Planning',
    desc: 'Comprehensive retirement solutions ensuring financial security with pension plans, SIPs, and long-term strategies.',
    features: ['Corpus Need Estimation', 'Pension & Annuity Advisory', 'Tax-Efficient Retirement Income', 'Inflation-Adjusted Growth'],
    icon: '🛡️',
    color: '#101b3b',
  },
  {
    id: 'tax-planning',
    title: 'Tax Planning',
    desc: 'Strategic tax-saving investment options and financial structuring to legally minimise your tax liability every year.',
    features: ['Section 80C & Beyond Optimization', 'Capital Gains Tax Planning', 'Tax-Efficient Investment Selection', 'Year-End Filing Guidance'],
    icon: '📋',
    color: '#7c3aed',
  },
  {
    id: 'insurance-planning',
    title: 'Insurance Planning',
    desc: 'Expert guidance on life, health, and general insurance to protect you and your loved ones from unexpected events.',
    features: ['Term Life Cover Analysis', 'Health & Critical Illness Plans', 'Family Floater Evaluation', 'Claim Assistance Support'],
    icon: '❤️',
    color: '#e11d48',
  },
];

export default function DashboardServicesPage() {
  const { user } = useAuth();
  const [consultationModal, setConsultationModal] = useState(null);
  const [formData, setFormData] = useState({ message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const handleConsultation = async (e) => {
    e.preventDefault();
    if (!consultationModal || !user) return;

    setSubmitting(true);
    setSubmitResult(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.fullName,
          email: user.email,
          phone: user.phone || '',
          service: consultationModal.title,
          message: formData.message || `I am interested in ${consultationModal.title}. Please contact me for a consultation.`,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitResult({ success: true, message: 'Consultation request submitted successfully! Our team will contact you shortly.' });
      } else {
        setSubmitResult({ success: false, message: data.message || 'Failed to submit request. Please try again.' });
      }
    } catch {
      setSubmitResult({ success: false, message: 'An unexpected error occurred. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-900)', margin: '0 0 0.5rem', fontFamily: "'Playfair Display', serif" }}>
          💼 Financial Services
        </h2>
        <p style={{ color: 'var(--gray-600)', fontSize: '0.92rem', margin: 0 }}>
          Explore GrowthNest&apos;s comprehensive financial advisory services. Request a free consultation directly from your dashboard.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {servicesList.map((svc) => (
          <div
            key={svc.id}
            id={svc.id}
            className="glass-card-static"
            style={{
              padding: '1.75rem',
              background: '#ffffff',
              borderTop: `4px solid ${svc.color}`,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '2rem' }}>{svc.icon}</span>
              <h3 style={{ fontSize: '1.15rem', margin: 0, color: 'var(--primary-900)', fontWeight: 700 }}>
                {svc.title}
              </h3>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--gray-600)', lineHeight: 1.6, marginBottom: '1rem', flex: 1 }}>
              {svc.desc}
            </p>

            <div style={{ marginBottom: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-500)', marginBottom: '0.5rem' }}>
                Key Benefits:
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {svc.features.map((feat, idx) => (
                  <li key={idx} style={{ fontSize: '0.82rem', color: 'var(--gray-700)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ color: svc.color, fontWeight: 700 }}>✓</span> {feat}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link
                href={`/services/${svc.id}`}
                className="btn btn-outline btn-sm"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Learn More
              </Link>
              <button
                type="button"
                onClick={() => {
                  setConsultationModal(svc);
                  setFormData({ message: '' });
                  setSubmitResult(null);
                }}
                className="btn btn-primary btn-sm"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Request Consultation
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Consultation Request Modal */}
      {consultationModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-card" style={{ background: '#ffffff', maxWidth: '500px', width: '100%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--primary-900)', fontFamily: "'Playfair Display', serif" }}>
                Request Consultation
              </h3>
              <button
                type="button"
                onClick={() => setConsultationModal(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: 'var(--gray-500)' }}
              >
                ✕
              </button>
            </div>

            {submitResult?.success ? (
              <div className="text-center" style={{ padding: '1rem 0' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', margin: '0 auto 1rem' }}>✓</div>
                <h4 style={{ margin: '0 0 0.5rem', color: 'var(--primary-900)' }}>Request Submitted!</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--gray-600)', marginBottom: '1.5rem' }}>{submitResult.message}</p>
                <button type="button" onClick={() => setConsultationModal(null)} className="btn btn-primary w-full">Close</button>
              </div>
            ) : (
              <form onSubmit={handleConsultation} noValidate>
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                  <p style={{ margin: '0 0 0.25rem', fontSize: '0.82rem', color: 'var(--gray-500)' }}>Service</p>
                  <p style={{ margin: 0, fontWeight: 700, color: 'var(--primary-900)' }}>{consultationModal.title}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <p style={{ margin: '0 0 0.25rem', fontSize: '0.82rem', color: 'var(--gray-500)' }}>Name</p>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.92rem', color: 'var(--primary-900)' }}>{user?.fullName}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 0.25rem', fontSize: '0.82rem', color: 'var(--gray-500)' }}>Email</p>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.92rem', color: 'var(--primary-900)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
                  </div>
                </div>

                {submitResult && !submitResult.success && (
                  <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#e11d48', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    ⚠️ {submitResult.message}
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label" htmlFor="consultation-message">
                    Message (Optional)
                  </label>
                  <textarea
                    id="consultation-message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-input"
                    placeholder={`Tell us about your ${consultationModal.title.toLowerCase()} needs...`}
                    rows={4}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setConsultationModal(null)} className="btn btn-outline">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
