'use client';
import { useState } from 'react';
import { formatIndianCurrency, formatShortIndianCurrency } from '@/utils/sipCalculations';

export default function EMIRepaymentChart({ yearlyData }) {
  const [hoverIndex, setHoverIndex] = useState(null);

  if (!yearlyData || yearlyData.length === 0) return null;

  // Chart dimensions
  const width = 800;
  const height = 300;
  const padding = { top: 30, right: 30, bottom: 40, left: 70 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Max Y value (Initial Principal)
  const maxVal = Math.max(...yearlyData.map((d) => d.remainingBalance + d.principalPaid), 1);

  // Coordinate mapping
  const points = yearlyData.map((d, index) => {
    const x = padding.left + (index / Math.max(yearlyData.length - 1, 1)) * chartWidth;
    const yBalance = height - padding.bottom - (d.remainingBalance / maxVal) * chartHeight;
    return { x, yBalance, data: d, index };
  });

  // Area path string
  const balanceAreaPath = `
    M ${points[0].x} ${points[0].yBalance}
    ${points.map((p) => `L ${p.x} ${p.yBalance}`).join(' ')}
    L ${points[points.length - 1].x} ${height - padding.bottom}
    L ${points[0].x} ${height - padding.bottom}
    Z
  `;

  const balanceLinePath = `
    M ${points[0].x} ${points[0].yBalance}
    ${points.map((p) => `L ${p.x} ${p.yBalance}`).join(' ')}
  `;

  const activePoint = hoverIndex !== null ? points[hoverIndex] : points[0];

  return (
    <div className="glass-card-static sip-growth-chart-card">
      <div className="growth-chart-header">
        <div>
          <h4 className="growth-chart-title">Loan Amortization Trajectory</h4>
          <p className="growth-chart-sub">
            Tracking loan balance reduction over {yearlyData.length} years
          </p>
        </div>

        {/* Legend */}
        <div className="growth-chart-legend">
          <div className="legend-chip">
            <span className="chip-line line-teal" />
            <span>Remaining Loan Balance</span>
          </div>
        </div>
      </div>

      {/* Interactive Tooltip Card */}
      {activePoint && (
        <div className="chart-active-tooltip">
          <span className="tooltip-year">{activePoint.data.label}</span>
          <span className="tooltip-stat">
            Principal Paid: <strong>{formatIndianCurrency(activePoint.data.principalPaid)}</strong>
          </span>
          <span className="tooltip-stat">
            Interest Paid: <strong className="text-gold">{formatIndianCurrency(activePoint.data.interestPaid)}</strong>
          </span>
          <span className="tooltip-stat">
            Remaining Balance: <strong className="text-teal">{formatIndianCurrency(activePoint.data.remainingBalance)}</strong>
          </span>
        </div>
      )}

      {/* SVG Chart */}
      <div className="svg-responsive-container">
        <svg viewBox={`0 0 ${width} ${height}`} className="growth-svg">
          <defs>
            <linearGradient id="tealBalanceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#19C3A3" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#19C3A3" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = height - padding.bottom - ratio * chartHeight;
            const val = ratio * maxVal;
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="#9ca3af"
                >
                  {formatShortIndianCurrency(val)}
                </text>
              </g>
            );
          })}

          {/* Filled Area */}
          <path d={balanceAreaPath} fill="url(#tealBalanceGrad)" />

          {/* Balance Curve Line */}
          <path
            d={balanceLinePath}
            fill="none"
            stroke="#19C3A3"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Hover Dots */}
          {points.map((p, idx) => (
            <g key={idx}>
              <circle
                cx={p.x}
                cy={p.yBalance}
                r={hoverIndex === idx ? 7 : 4}
                fill={hoverIndex === idx ? '#19C3A3' : '#ffffff'}
                stroke="#19C3A3"
                strokeWidth="2.5"
                style={{ cursor: 'pointer', transition: 'r 0.2s' }}
                onMouseEnter={() => setHoverIndex(idx)}
                onMouseLeave={() => setHoverIndex(null)}
              />

              {/* Invisible Hit Targets */}
              <rect
                x={p.x - chartWidth / (points.length * 2)}
                y={padding.top}
                width={chartWidth / points.length}
                height={chartHeight}
                fill="transparent"
                onMouseEnter={() => setHoverIndex(idx)}
              />
            </g>
          ))}

          {/* X Axis Labels */}
          {points
            .filter(
              (_, i) =>
                i === 0 ||
                i === points.length - 1 ||
                i % Math.ceil(points.length / 6) === 0
            )
            .map((p, i) => (
              <text
                key={i}
                x={p.x}
                y={height - 12}
                textAnchor="middle"
                fontSize="11"
                fill="#6b7280"
              >
                {p.data.label}
              </text>
            ))}
        </svg>
      </div>
    </div>
  );
}
