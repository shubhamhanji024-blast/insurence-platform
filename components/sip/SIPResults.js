'use client';
import { formatIndianCurrency, formatShortIndianCurrency } from '@/utils/sipCalculations';

export default function SIPResults({
  result,
  totalInvested: propInvested,
  estimatedReturns: propReturns,
  futureValue: propValue,
  investedAmount,
  totalValue,
}) {
  const totalInvested = result?.totalInvested ?? propInvested ?? investedAmount ?? 0;
  const estimatedReturns = result?.estimatedReturns ?? propReturns ?? 0;
  const futureValue = result?.futureValue ?? propValue ?? totalValue ?? 0;

  const rawInvestedRatio = result?.investedRatio ?? (futureValue > 0 ? (totalInvested / futureValue) * 100 : 50);
  const rawReturnsRatio = result?.returnsRatio ?? (futureValue > 0 ? (estimatedReturns / futureValue) * 100 : 50);

  const investedRatio = Number(rawInvestedRatio.toFixed(1));
  const returnsRatio = Number(rawReturnsRatio.toFixed(1));

  // Donut SVG Parameters
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate stroke dashoffset for donut segments
  const investedDash = (investedRatio / 100) * circumference;
  const returnsDash = (returnsRatio / 100) * circumference;

  return (
    <div className="glass-card-static sip-results-card">
      <h3 className="sip-results-heading">Calculation Summary</h3>

      {/* Main Result Cards */}
      <div className="sip-metrics-grid">
        {/* Total Investment */}
        <div className="sip-metric-box">
          <span className="metric-label">Total Investment</span>
          <span className="metric-val text-navy">
            {formatIndianCurrency(totalInvested)}
          </span>
          <span className="metric-sub">{formatShortIndianCurrency(totalInvested)}</span>
        </div>

        {/* Estimated Returns */}
        <div className="sip-metric-box">
          <span className="metric-label">Estimated Returns</span>
          <span className="metric-val text-teal">
            +{formatIndianCurrency(estimatedReturns)}
          </span>
          <span className="metric-sub">{formatShortIndianCurrency(estimatedReturns)}</span>
        </div>
      </div>

      {/* Primary Highlighted Total Value Card */}
      <div className="sip-total-highlight-card">
        <div>
          <span className="total-highlight-label">Expected Maturity Value</span>
          <div className="total-highlight-val">
            {formatIndianCurrency(futureValue)}
          </div>
          <span className="total-highlight-sub">
            Wealth multiplier: {(totalInvested > 0 ? (futureValue / totalInvested).toFixed(2) : 1)}x
          </span>
        </div>
        <LinkToConsultation />
      </div>

      {/* Donut Chart & Legend */}
      <div className="sip-chart-container">
        <div className="donut-wrapper">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Background Circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#f3f4f6"
              strokeWidth={strokeWidth}
            />

            {/* Segment 1: Invested Amount (Deep Navy) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#1e3a8a"
              strokeWidth={strokeWidth}
              strokeDasharray={`${investedDash} ${circumference}`}
              strokeDashoffset={0}
              style={{
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%',
                transition: 'stroke-dasharray 0.5s ease',
              }}
            />

            {/* Segment 2: Returns (GrowthNest Teal #19C3A3) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#19C3A3"
              strokeWidth={strokeWidth}
              strokeDasharray={`${returnsDash} ${circumference}`}
              strokeDashoffset={-investedDash}
              style={{
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%',
                transition: 'stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease',
              }}
            />
          </svg>

          {/* Donut Center Overlay */}
          <div className="donut-center">
            <span className="donut-center-pct">{returnsRatio}%</span>
            <span className="donut-center-lbl">Growth</span>
          </div>
        </div>

        {/* Legend */}
        <div className="donut-legend">
          <div className="legend-item">
            <div className="legend-dot bg-navy" />
            <div>
              <span className="legend-name">Invested Amount</span>
              <span className="legend-val">
                {formatIndianCurrency(totalInvested)} ({investedRatio}%)
              </span>
            </div>
          </div>

          <div className="legend-item">
            <div className="legend-dot bg-teal" />
            <div>
              <span className="legend-name">Estimated Returns</span>
              <span className="legend-val">
                {formatIndianCurrency(estimatedReturns)} ({returnsRatio}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LinkToConsultation() {
  return (
    <a
      href="/contact"
      className="btn btn-secondary btn-sm"
      style={{ alignSelf: 'center', whiteSpace: 'nowrap' }}
    >
      Start Investing →
    </a>
  );
}
