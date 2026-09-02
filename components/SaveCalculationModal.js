'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function SaveCalculationModal({ calculatorType, inputData, resultData }) {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const defaultNameMap = {
    SIP: 'My SIP Plan',
    EMI: 'My Loan EMI Plan',
    LUMPSUM: 'My Lumpsum Investment',
    RETIREMENT: 'My Retirement Plan',
  };

  const handleOpen = () => {
    setName(defaultNameMap[calculatorType] || `${calculatorType} Plan`);
    setSuccess(false);
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanName = name.trim();
    if (!cleanName) {
      setError('Please enter a calculation name.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/calculations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calculatorType,
          name: cleanName,
          inputData,
          resultData,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setError(data.message || 'Failed to save calculation.');
      }
    } catch {
      setError('An unexpected error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div style={{ marginTop: '1.25rem', padding: '0.85rem 1.25rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>
          🔒 Want to save your calculation estimates?
        </span>
        <Link href="/login" className="btn btn-outline btn-sm">
          Sign In to Save →
        </Link>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '1.25rem' }}>
      <button
        type="button"
        onClick={handleOpen}
        className="btn btn-secondary w-full"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', fontSize: '0.92rem', fontWeight: 700 }}
      >
        <span>💾</span> Save Calculation to Dashboard
      </button>

      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-card" style={{ background: '#ffffff', maxWidth: '440px', width: '100%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--primary-900)', fontFamily: "'Playfair Display', serif" }}>
                Save {calculatorType} Calculation
              </h3>
              <button type="button" onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: 'var(--gray-500)' }}>
                ✕
              </button>
            </div>

            {success ? (
              <div className="text-center" style={{ padding: '1rem 0' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', margin: '0 auto 1rem' }}>
                  ✓
                </div>
                <h4 style={{ margin: '0 0 0.5rem', color: 'var(--primary-900)' }}>Calculation Saved!</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--gray-600)', marginBottom: '1.5rem' }}>
                  You can access and recalculate this estimate anytime from your dashboard.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline w-full">
                    Close
                  </button>
                  <Link href="/dashboard/calculations" className="btn btn-primary w-full">
                    View Saved →
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {error && (
                  <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#e11d48', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    ⚠️ {error}
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label" htmlFor="calc-name">
                    Calculation Name *
                  </label>
                  <input
                    id="calc-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                    placeholder="e.g. My Retirement SIP Plan"
                    maxLength={100}
                    autoFocus
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save to Dashboard'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
