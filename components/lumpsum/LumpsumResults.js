'use client';
import { formatIndianCurrency, formatShortIndianCurrency } from '@/utils/sipCalculations';
import Link from 'next/link';

export default function LumpsumResults({
  result,
  initialInvestment: propInvestment,
  totalReturns: propReturns,
  totalValue: propValue,
}) {
  const initialInvestment = result?.initialInvestment ?? propInvestment ?? 0;
  const estimatedReturns = result?.estimatedReturns ?? propReturns ?? 0;
  const futureValue = result?.futureValue ?? propValue ?? 0;

  const rawInvestedRatio = result?.investedRatio ?? (futureValue > 0 ? (initialInvestment / futureValue) * 100 : 50);
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
      <h3 className="sip-results-heading">Investment Summary</h3>

      {/* Primary Highlighted Total Future Value Card */}
      <div className="sip-total-highlight-card" style={{ marginBottom: '1.25rem' }}>
        <div>
          <span className="total-highlight-label">Expected Future Value</span>
          <div className="total-highlight-val">
            {formatIndianCurrency(futureValue)}
          </div>
          <span className="total-highlight-sub">
            Wealth multiplier: {(initialInvestment > 0 ? (futureValue / initialInvestment).toFixed(2) : 1)}x
          </span>
        </div>
        <Link href="/contact" className="btn btn-secondary btn-sm hide-mobile" style={{ alignSelf: 'center', whiteSpace: 'nowrap' }}>
          Invest Now →
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="sip-metrics-grid">
        {/* Initial Investment */}
        <div className="sip-metric-box">
          <span className="metric-label">Initial Investment</span>
          <span className="metric-val text-navy">
            {formatIndianCurrency(initialInvestment)}
          </span>
          <span className="metric-sub">{formatShortIndianCurrency(initialInvestment)}</span>
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

            {/* Segment 1: Initial Investment (Deep Navy) */}
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

            {/* Segment 2: Estimated Returns (GrowthNest Teal #19C3A3) */}
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
            <span className="donut-center-lbl">Returns</span>
          </div>
        </div>

        {/* Legend */}
        <div className="donut-legend">
          <div className="legend-item">
            <div className="legend-dot bg-navy" />
            <div>
              <span className="legend-name">Initial Investment</span>
              <span className="legend-val">
                {formatIndianCurrency(initialInvestment)} ({investedRatio}%)
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
