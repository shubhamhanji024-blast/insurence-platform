'use client';
import { formatIndianCurrency, formatShortIndianCurrency } from '@/utils/sipCalculations';
import { calculateRetirementPlan } from '@/utils/retirementCalculations';

export default function RetirementScenarios({ inputs, onApplyScenario, onApplyPreset }) {
  const safeInputs = inputs || {
    currentAge: 30,
    retirementAge: 60,
    lifeExpectancy: 85,
    currentExpenses: 50000,
    inflationRate: 6,
    currentSavings: 500000,
    monthlyInvestment: 20000,
    preReturn: 12,
    postReturn: 7,
  };

  const handleApply = onApplyScenario || onApplyPreset || (() => {});

  const scenarios = [
    {
      id: 'early_retire',
      title: 'Retire 5 Years Earlier',
      desc: `Retire at Age ${Math.max(19, safeInputs.retirementAge - 5)} instead of ${safeInputs.retirementAge}`,
      modifier: { retirementAge: Math.max(safeInputs.currentAge + 1, safeInputs.retirementAge - 5) },
    },
    {
      id: 'invest_10',
      title: 'Increase Monthly Investment +10%',
      desc: `Invest ${formatIndianCurrency(Math.round(safeInputs.monthlyInvestment * 1.1))}/mo (+10%)`,
      modifier: { monthlyInvestment: Math.round(safeInputs.monthlyInvestment * 1.1) },
    },
    {
      id: 'invest_25',
      title: 'Increase Monthly Investment +25%',
      desc: `Invest ${formatIndianCurrency(Math.round(safeInputs.monthlyInvestment * 1.25))}/mo (+25%)`,
      modifier: { monthlyInvestment: Math.round(safeInputs.monthlyInvestment * 1.25) },
    },
    {
      id: 'expenses_10',
      title: 'Reduce Monthly Expenses -10%',
      desc: `Expenses ${formatIndianCurrency(Math.round(safeInputs.currentExpenses * 0.9))}/mo (-10%)`,
      modifier: { currentExpenses: Math.round(safeInputs.currentExpenses * 0.9) },
    },
  ];

  return (
    <div className="glass-card-static" style={{ padding: '2rem', marginBottom: '2rem', background: '#ffffff' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-900)', margin: '0 0 0.25rem' }}>
          🤔 What if you change your plan?
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', margin: 0 }}>
          Explore how simple lifestyle or contribution adjustments impact your retirement readiness (illustrative estimates).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {scenarios.map((sc) => {
          const scInputs = { ...safeInputs, ...sc.modifier };
          const scPlan = calculateRetirementPlan(scInputs);

          return (
            <div
              key={sc.id}
              style={{
                border: '1px solid var(--gray-200)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.25rem',
                background: '#f8fafc',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
              }}
            >
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-900)', margin: '0 0 0.35rem' }}>
                  {sc.title}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-600)', margin: '0 0 1rem' }}>
                  {sc.desc}
                </p>

                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--gray-600)' }}>Readiness:</span>
                    <strong style={{ color: scPlan.isSurplus ? '#16a34a' : '#e11d48' }}>
                      {scPlan.readinessPercentage}%
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--gray-600)' }}>Projected Net:</span>
                    <strong style={{ color: scPlan.isSurplus ? '#16a34a' : '#e11d48' }}>
                      {scPlan.isSurplus ? '+' : ''}{formatShortIndianCurrency(scPlan.netDifference)}
                    </strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ width: '100%' }}
                onClick={() => handleApply(sc.modifier)}
              >
                Apply This Plan
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
