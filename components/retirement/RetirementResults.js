'use client';
import { formatIndianCurrency, formatShortIndianCurrency } from '@/utils/sipCalculations';
import Link from 'next/link';

export default function RetirementResults({
  plan,
  targetCorpus: propTarget,
  projectedSavings: propSavings,
  monthlyExpenseAtRetirement: propExpense,
  surplusDeficit: propDiff,
  isFullyFunded: propSurplus,
}) {
  const yearsToRetire = plan?.yearsToRetire ?? 30;
  const futureMonthlyExpenses = plan?.futureMonthlyExpenses ?? propExpense ?? 0;
  const requiredCorpus = plan?.requiredCorpus ?? propTarget ?? 0;
  const projectedSavings = plan?.projectedSavings ?? propSavings ?? 0;
  const netDifference = Math.abs(plan?.netDifference ?? propDiff ?? (projectedSavings - requiredCorpus));
  const isSurplus = plan?.isSurplus ?? propSurplus ?? (projectedSavings >= requiredCorpus);

  return (
    <div className="glass-card-static sip-results-card">
      <h3 className="sip-results-heading">Retirement Projections</h3>

      {/* Metric Cards Grid */}
      <div className="sip-metrics-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        {/* Years Until Retirement */}
        <div className="sip-metric-box">
          <span className="metric-label">Years Until Retirement</span>
          <span className="metric-val text-navy">
            {yearsToRetire} Years
          </span>
          <span className="metric-sub">Accumulation Phase</span>
        </div>

        {/* Future Monthly Expenses */}
        <div className="sip-metric-box">
          <span className="metric-label">Est. Monthly Expenses at Retire</span>
          <span className="metric-val text-teal">
            {formatIndianCurrency(futureMonthlyExpenses)}
          </span>
          <span className="metric-sub">Inflation-adjusted</span>
        </div>
      </div>

      {/* Major Target vs Projected Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
        {/* Required Retirement Corpus */}
        <div className="sip-metric-box" style={{ background: '#f8fafc', border: '1px solid #cbd5e1' }}>
          <span className="metric-label">Required Target Corpus</span>
          <span className="metric-val text-navy" style={{ fontSize: '1.35rem' }}>
            {formatIndianCurrency(requiredCorpus)}
          </span>
          <span className="metric-sub">{formatShortIndianCurrency(requiredCorpus)}</span>
        </div>

        {/* Projected Retirement Savings */}
        <div className="sip-metric-box" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <span className="metric-label">Projected Savings</span>
          <span className="metric-val text-teal" style={{ fontSize: '1.35rem' }}>
            {formatIndianCurrency(projectedSavings)}
          </span>
          <span className="metric-sub">{formatShortIndianCurrency(projectedSavings)}</span>
        </div>
      </div>

      {/* Primary Highlighted Shortfall / Surplus Card */}
      <div
        className="sip-total-highlight-card"
        style={{
          background: isSurplus
            ? 'linear-gradient(135deg, #064e3b, #047857)'
            : 'linear-gradient(135deg, #881337, #be123c)',
          marginBottom: '1rem',
        }}
      >
        <div>
          <span className="total-highlight-label">
            {isSurplus ? 'ESTIMATED RETIREMENT SURPLUS' : 'ESTIMATED RETIREMENT SHORTFALL'}
          </span>
          <div className="total-highlight-val" style={{ color: '#ffffff' }}>
            {isSurplus ? '+' : ''}
            {formatIndianCurrency(netDifference)}
          </div>
          <span className="total-highlight-sub" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {isSurplus
              ? 'Your wealth plan exceeds the required retirement cushion'
              : 'Action needed to bridge the retirement gap before retiring'}
          </span>
        </div>
        <Link href="/contact" className="btn btn-secondary btn-sm hide-mobile" style={{ alignSelf: 'center', whiteSpace: 'nowrap' }}>
          {isSurplus ? 'Optimize Portfolio →' : 'Bridge Shortfall →'}
        </Link>
      </div>
    </div>
  );
}
