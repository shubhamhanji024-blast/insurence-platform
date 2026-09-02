import { formatIndianCurrency, formatShortIndianCurrency } from '@/utils/sipCalculations';

export default function RetirementSummary({
  plan,
  inputs,
  targetCorpus: propTarget,
  projectedSavings: propSavings,
  yearsToRetire: propYearsToRetire,
  retirementYears: propRetirementYears,
  monthlyExpenseAtRetirement: propMonthlyExpense,
  additionalMonthlySIP: propAdditionalSIP,
  isFullyFunded: propIsFullyFunded,
}) {
  const currentAge = plan?.currentAge ?? 30;
  const retirementAge = plan?.retirementAge ?? 60;
  const lifeExpectancy = plan?.lifeExpectancy ?? 85;
  const yearsToRetire = plan?.yearsToRetire ?? propYearsToRetire ?? 30;
  const futureMonthlyExpenses = plan?.futureMonthlyExpenses ?? propMonthlyExpense ?? 0;
  const projectedSavings = plan?.projectedSavings ?? propSavings ?? 0;
  const requiredCorpus = plan?.requiredCorpus ?? propTarget ?? 0;
  const netDifference = Math.abs(plan?.netDifference ?? (projectedSavings - requiredCorpus));
  const isSurplus = plan?.isSurplus ?? propIsFullyFunded ?? (projectedSavings >= requiredCorpus);

  const currentExpenses = inputs?.currentExpenses ?? 50000;
  const inflationRate = inputs?.inflationRate ?? 6;

  return (
    <div className="glass-card-static" style={{ padding: '2rem', marginBottom: '2rem', background: '#ffffff' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '1.25rem' }}>
        📋 Your Retirement Summary Card
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="sip-metric-box">
          <span className="metric-label">Current / Retire Age</span>
          <span className="metric-val text-navy" style={{ fontSize: '1.15rem' }}>
            {currentAge} Yrs → {retirementAge} Yrs
          </span>
          <span className="metric-sub">{yearsToRetire} years to build wealth</span>
        </div>

        <div className="sip-metric-box">
          <span className="metric-label">Expected Life Age</span>
          <span className="metric-val text-navy" style={{ fontSize: '1.15rem' }}>
            {lifeExpectancy} Yrs
          </span>
          <span className="metric-sub">{lifeExpectancy - retirementAge} retirement years</span>
        </div>

        <div className="sip-metric-box">
          <span className="metric-label">Current Monthly Expenses</span>
          <span className="metric-val text-navy" style={{ fontSize: '1.15rem' }}>
            {formatIndianCurrency(currentExpenses)}
          </span>
          <span className="metric-sub">Today's purchasing power</span>
        </div>

        <div className="sip-metric-box">
          <span className="metric-label">Expenses at Retirement</span>
          <span className="metric-val text-teal" style={{ fontSize: '1.15rem' }}>
            {formatIndianCurrency(futureMonthlyExpenses)}
          </span>
          <span className="metric-sub">Adjusted @ {inflationRate}% inflation</span>
        </div>

        <div className="sip-metric-box">
          <span className="metric-label">Projected Savings</span>
          <span className="metric-val text-teal" style={{ fontSize: '1.15rem' }}>
            {formatIndianCurrency(projectedSavings)}
          </span>
          <span className="metric-sub">{formatShortIndianCurrency(projectedSavings)}</span>
        </div>

        <div className="sip-metric-box">
          <span className="metric-label">Estimated Required Corpus</span>
          <span className="metric-val text-navy" style={{ fontSize: '1.15rem' }}>
            {formatIndianCurrency(requiredCorpus)}
          </span>
          <span className="metric-sub">{formatShortIndianCurrency(requiredCorpus)}</span>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)', background: isSurplus ? '#f0fdf4' : '#fff1f2', border: `1px solid ${isSurplus ? '#bbf7d0' : '#fecdd3'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <span style={{ fontWeight: 600, color: 'var(--gray-800)', fontSize: '0.9rem' }}>
          Final Net Position:
        </span>
        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: isSurplus ? '#16a34a' : '#e11d48' }}>
          {isSurplus ? '+' : ''}{formatIndianCurrency(netDifference)} ({isSurplus ? 'Surplus' : 'Shortfall'})
        </span>
      </div>
    </div>
  );
}
