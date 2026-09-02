'use client';
import { formatIndianCurrency, formatShortIndianCurrency } from '@/utils/sipCalculations';
import Link from 'next/link';

export default function EMIResults({
  result,
  monthlyEMI: propEMI,
  principalAmount: propPrincipal,
  totalInterest: propInterest,
  totalPayment: propPayment,
}) {
  const monthlyEMI = result?.monthlyEMI ?? propEMI ?? 0;
  const principalAmount = result?.principalAmount ?? propPrincipal ?? 0;
  const totalInterest = result?.totalInterest ?? propInterest ?? 0;
  const totalPayment = result?.totalPayment ?? propPayment ?? 0;

  const rawPrincipalRatio = result?.principalRatio ?? (totalPayment > 0 ? (principalAmount / totalPayment) * 100 : 50);
  const rawInterestRatio = result?.interestRatio ?? (totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 50);

  const principalRatio = Number(rawPrincipalRatio.toFixed(1));
  const interestRatio = Number(rawInterestRatio.toFixed(1));

  // Donut SVG Parameters
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate stroke dashoffset for donut segments
  const principalDash = (principalRatio / 100) * circumference;
  const interestDash = (interestRatio / 100) * circumference;

  return (
    <div className="glass-card-static sip-results-card">
      <h3 className="sip-results-heading">Loan Repayment Summary</h3>

      {/* Primary Highlighted Monthly EMI Card */}
      <div className="sip-total-highlight-card" style={{ marginBottom: '1.25rem' }}>
        <div>
          <span className="total-highlight-label">Equated Monthly Instalment (EMI)</span>
          <div className="total-highlight-val">
            {formatIndianCurrency(monthlyEMI)}
            <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', marginLeft: '4px', fontWeight: 500 }}>/mo</span>
          </div>
          <span className="total-highlight-sub">
            Interest portion: {interestRatio}% of total loan outflow
          </span>
        </div>
        <Link href="/contact" className="btn btn-secondary btn-sm hide-mobile" style={{ alignSelf: 'center', whiteSpace: 'nowrap' }}>
          Apply for Loan →
        </Link>
      </div>

      {/* Secondary Result Cards */}
      <div className="sip-metrics-grid">
        {/* Principal Amount */}
        <div className="sip-metric-box">
          <span className="metric-label">Principal Amount</span>
          <span className="metric-val text-navy">
            {formatIndianCurrency(principalAmount)}
          </span>
          <span className="metric-sub">{formatShortIndianCurrency(principalAmount)}</span>
        </div>

        {/* Total Interest Payable */}
        <div className="sip-metric-box">
          <span className="metric-label">Total Interest Payable</span>
          <span className="metric-val text-teal">
            {formatIndianCurrency(totalInterest)}
          </span>
          <span className="metric-sub">{formatShortIndianCurrency(totalInterest)}</span>
        </div>
      </div>

      {/* Total Repayment Card */}
      <div className="sip-metric-box" style={{ marginBottom: '1.25rem', background: '#f8fafc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="metric-label">Total Repayment Amount (Principal + Interest)</span>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--primary-900)', fontFamily: "'Playfair Display', serif" }}>
              {formatIndianCurrency(totalPayment)}
            </div>
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-500)' }}>
            {formatShortIndianCurrency(totalPayment)}
          </span>
        </div>
      </div>

      {/* Donut Chart & Legend */}
      <div className="sip-chart-container">
        <div className="donut-wrapper">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#f3f4f6"
              strokeWidth={strokeWidth}
            />

            {/* Segment 1: Principal Amount (Deep Navy) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#1e3a8a"
              strokeWidth={strokeWidth}
              strokeDasharray={`${principalDash} ${circumference}`}
              strokeDashoffset={0}
              style={{
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%',
                transition: 'stroke-dasharray 0.5s ease',
              }}
            />

            {/* Segment 2: Interest (GrowthNest Teal #19C3A3) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#19C3A3"
              strokeWidth={strokeWidth}
              strokeDasharray={`${interestDash} ${circumference}`}
              strokeDashoffset={-principalDash}
              style={{
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%',
                transition: 'stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease',
              }}
            />
          </svg>

          {/* Donut Center Overlay */}
          <div className="donut-center">
            <span className="donut-center-pct">{principalRatio}%</span>
            <span className="donut-center-lbl">Principal</span>
          </div>
        </div>

        {/* Legend */}
        <div className="donut-legend">
          <div className="legend-item">
            <div className="legend-dot bg-navy" />
            <div>
              <span className="legend-name">Principal Amount</span>
              <span className="legend-val">
                {formatIndianCurrency(principalAmount)} ({principalRatio}%)
              </span>
            </div>
          </div>

          <div className="legend-item">
            <div className="legend-dot bg-teal" />
            <div>
              <span className="legend-name">Total Interest</span>
              <span className="legend-val">
                {formatIndianCurrency(totalInterest)} ({interestRatio}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
