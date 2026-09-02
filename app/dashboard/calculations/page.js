'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { formatIndianCurrency, formatShortIndianCurrency } from '@/utils/sipCalculations';

export default function SavedCalculationsPage() {
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewCalc, setViewCalc] = useState(null);

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  const fetchCalculations = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/calculations');
      const data = await res.json();
      if (res.ok && data.success) {
        setCalculations(data.calculations || []);
      } else {
        setError(data.message || 'Failed to load saved calculations.');
      }
    } catch {
      setError('Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalculations();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/calculations/${deleteId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setDeleteId(null);
        fetchCalculations();
      } else {
        alert(data.message || 'Failed to delete calculation.');
      }
    } catch {
      alert('Failed to connect to server.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRecalculate = (calc) => {
    const routeMap = {
      SIP: '/calculators/sip',
      EMI: '/calculators/emi',
      LUMPSUM: '/calculators/lumpsum',
      RETIREMENT: '/calculators/retirement',
    };
    const targetRoute = routeMap[calc.calculatorType] || '/calculators/sip';
    router.push(`${targetRoute}?load=${calc.id}`);
  };

  const getKeyResultText = (calc) => {
    const { calculatorType, resultData } = calc;
    if (!resultData) return 'Saved Calculation';

    if (calculatorType === 'SIP') {
      return `${formatShortIndianCurrency(resultData.totalValue || resultData.futureValue || 0)} Projected Value`;
    }
    if (calculatorType === 'EMI') {
      return `${formatIndianCurrency(resultData.monthlyEMI || 0)} Monthly EMI`;
    }
    if (calculatorType === 'LUMPSUM') {
      return `${formatShortIndianCurrency(resultData.totalValue || resultData.futureValue || 0)} Future Value`;
    }
    if (calculatorType === 'RETIREMENT') {
      return `${formatShortIndianCurrency(resultData.targetCorpus || resultData.totalSavingsAtRetirement || 0)} Required Corpus`;
    }
    return 'Saved Estimates';
  };

  return (
    <DashboardLayout>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.35rem', color: 'var(--primary-900)', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
            Saved Calculations
          </h2>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--gray-600)' }}>
            Quick access to your saved SIP, EMI, Lumpsum, and Retirement plans.
          </p>
        </div>

        <Link href="/calculators" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>📊</span> Open Calculators
        </Link>
      </div>

      {error ? (
        <div className="glass-card text-center" style={{ padding: '2rem', background: '#ffffff' }}>
          <p style={{ color: '#e11d48', margin: 0 }}>⚠️ {error}</p>
          <button type="button" onClick={fetchCalculations} className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>
            Retry
          </button>
        </div>
      ) : loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card-static" style={{ padding: '1.5rem', background: '#ffffff', height: '160px' }}>
              <div style={{ width: '50%', height: '16px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '1rem' }} />
              <div style={{ width: '70%', height: '22px', background: '#cbd5e1', borderRadius: '4px' }} />
            </div>
          ))}
        </div>
      ) : calculations.length === 0 ? (
        /* Empty State */
        <div className="glass-card text-center" style={{ padding: '3.5rem 2rem', background: '#ffffff' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', margin: '0 auto 1.25rem' }}>
            💾
          </div>
          <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-900)', margin: '0 0 0.5rem', fontFamily: "'Playfair Display', serif" }}>
            No saved calculations yet
          </h3>
          <p style={{ color: 'var(--gray-600)', fontSize: '0.92rem', maxWidth: '420px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
            Use a GrowthNest calculator and save your results to easily compare plans and track future wealth estimates.
          </p>
          <Link href="/calculators" className="btn btn-primary">
            Explore Calculators
          </Link>
        </div>
      ) : (
        /* Calculations Grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {calculations.map((calc) => (
            <div key={calc.id} className="glass-card-static" style={{ padding: '1.5rem', background: '#ffffff', display: 'flex', flexDirection: 'column' }}>
              {/* Card Top Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.25rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    background:
                      calc.calculatorType === 'SIP'
                        ? '#dcfce7'
                        : calc.calculatorType === 'EMI'
                        ? '#fee2e2'
                        : calc.calculatorType === 'LUMPSUM'
                        ? '#fef3c7'
                        : '#e0f2fe',
                    color:
                      calc.calculatorType === 'SIP'
                        ? '#15803d'
                        : calc.calculatorType === 'EMI'
                        ? '#b91c1c'
                        : calc.calculatorType === 'LUMPSUM'
                        ? '#b45309'
                        : '#0369a1',
                  }}
                >
                  {calc.calculatorType} Calculator
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                  {new Date(calc.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>

              <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.15rem', color: 'var(--primary-900)', fontWeight: 700 }}>
                {calc.name}
              </h4>

              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-900)', marginBottom: '1.25rem' }}>
                {getKeyResultText(calc)}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                <button
                  type="button"
                  onClick={() => setViewCalc(calc)}
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1 }}
                >
                  👁️ View
                </button>
                <button
                  type="button"
                  onClick={() => handleRecalculate(calc)}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1.2 }}
                >
                  🔄 Recalculate
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteId(calc.id)}
                  className="btn btn-outline btn-sm"
                  style={{ color: '#e11d48', borderColor: '#fecdd3' }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Detail Modal */}
      {viewCalc && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-card" style={{ background: '#ffffff', maxWidth: '520px', width: '100%', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase' }}>
                  {viewCalc.calculatorType} Calculation Details
                </span>
                <h3 style={{ margin: '0.2rem 0 0', fontSize: '1.3rem', color: 'var(--primary-900)', fontFamily: "'Playfair Display', serif" }}>
                  {viewCalc.name}
                </h3>
              </div>
              <button type="button" onClick={() => setViewCalc(null)} style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: 'var(--gray-500)' }}>
                ✕
              </button>
            </div>

            {/* Inputs Table */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--primary-900)', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.4rem', marginBottom: '0.75rem' }}>
                Inputs
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.85rem' }}>
                {Object.entries(viewCalc.inputData || {}).map(([key, val]) => (
                  <div key={key} style={{ background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ color: 'var(--gray-500)', textTransform: 'capitalize', fontSize: '0.75rem' }}>{key.replace(/([A-Z])/g, ' $1')}</div>
                    <div style={{ fontWeight: 600, color: 'var(--primary-900)' }}>{String(val)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Results Table */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--primary-900)', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.4rem', marginBottom: '0.75rem' }}>
                Outputs &amp; Results
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.85rem' }}>
                {Object.entries(viewCalc.resultData || {})
                  .filter(([key]) => typeof viewCalc.resultData[key] === 'number' || typeof viewCalc.resultData[key] === 'string')
                  .slice(0, 6)
                  .map(([key, val]) => (
                    <div key={key} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ color: '#15803d', textTransform: 'capitalize', fontSize: '0.75rem' }}>{key.replace(/([A-Z])/g, ' $1')}</div>
                      <div style={{ fontWeight: 700, color: 'var(--primary-900)' }}>
                        {typeof val === 'number' ? formatIndianCurrency(val) : String(val)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" onClick={() => setViewCalc(null)} className="btn btn-outline w-full">
                Close
              </button>
              <button type="button" onClick={() => handleRecalculate(viewCalc)} className="btn btn-primary w-full">
                🔄 Load into Calculator
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 210, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-card text-center" style={{ background: '#ffffff', maxWidth: '400px', width: '100%', padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🗑️</div>
            <h3 style={{ color: 'var(--primary-900)', margin: '0 0 0.5rem' }}>Delete Calculation?</h3>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Are you sure you want to delete this saved calculation?
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" onClick={() => setDeleteId(null)} className="btn btn-outline w-full">
                Cancel
              </button>
              <button type="button" onClick={handleDelete} className="btn btn-primary w-full" style={{ background: '#e11d48', borderColor: '#e11d48' }} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete Calculation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
