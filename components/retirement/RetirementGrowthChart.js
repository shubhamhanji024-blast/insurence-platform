'use client';
import { useState } from 'react';
import { formatIndianCurrency, formatShortIndianCurrency } from '@/utils/sipCalculations';

export default function RetirementGrowthChart({ schedule, targetCorpus }) {
  const [hoverIndex, setHoverIndex] = useState(null);

  if (!schedule || schedule.length === 0) return null;

  // Chart dimensions
  const width = 800;
  const height = 300;
  const padding = { top: 30, right: 30, bottom: 40, left: 70 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Max Y value
  const maxVal = Math.max(...schedule.map((d) => d.totalSavings || 0), targetCorpus || 1, 1);

  // Coordinate mapping
  const points = schedule.map((d, index) => {
    const x = padding.left + (index / Math.max(schedule.length - 1, 1)) * chartWidth;
    const yTotal = height - padding.bottom - ((d.totalSavings || 0) / maxVal) * chartHeight;
    const yContrib = height - padding.bottom - ((d.totalContrib || 0) / maxVal) * chartHeight;
    return { x, yTotal, yContrib, data: d, index };
  });

  const valueAreaPath = `
    M ${points[0].x} ${points[0].yTotal}
    ${points.map((p) => `L ${p.x} ${p.yTotal}`).join(' ')}
    L ${points[points.length - 1].x} ${height - padding.bottom}
    L ${points[0].x} ${height - padding.bottom}
    Z
  `;

  const valueLinePath = `
    M ${points[0].x} ${points[0].yTotal}
    ${points.map((p) => `L ${p.x} ${p.yTotal}`).join(' ')}
  `;

  const contribLinePath = `
    M ${points[0].x} ${points[0].yContrib}
    ${points.map((p) => `L ${p.x} ${p.yContrib}`).join(' ')}
  `;

  const activePoint = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];

  const startAge = schedule[0]?.age ?? schedule[0]?.data?.age ?? 30;
  const endAge = schedule[schedule.length - 1]?.age ?? schedule[schedule.length - 1]?.data?.age ?? 60;

  return (
    <div className="glass-card-static sip-growth-chart-card">
      <div className="growth-chart-header">
        <div>
          <h4 className="growth-chart-title">Pre-Retirement Accumulation Trajectory</h4>
          <p className="growth-chart-sub">
            Wealth accumulation from Age {startAge} to Age {endAge}
          </p>
        </div>

        {/* Legend */}
        <div className="growth-chart-legend">
          <div className="legend-chip">
            <span className="chip-line line-teal" />
            <span>Projected Savings</span>
          </div>
          <div className="legend-chip">
            <span className="chip-line line-navy-dashed" />
            <span>Total Contributions</span>
          </div>
        </div>
      </div>

      {/* Interactive Tooltip Card */}
      {activePoint && activePoint.data && (
        <div className="chart-active-tooltip">
          <span className="tooltip-year">
            Age {activePoint.data.age} ({activePoint.data.year})
          </span>
          <span className="tooltip-stat">
            Total Contributions: <strong>{formatIndianCurrency(activePoint.data.totalContrib)}</strong>
          </span>
          <span className="tooltip-stat">
            Projected Savings: <strong className="text-teal">{formatIndianCurrency(activePoint.data.totalSavings)}</strong>
          </span>
          <span className="tooltip-stat">
            Estimated Growth: <strong className="text-gold">+{formatIndianCurrency(activePoint.data.growth)}</strong>
          </span>
        </div>
      )}

      {/* SVG Chart */}
      <div className="svg-responsive-container">
        <svg viewBox={`0 0 ${width} ${height}`} className="growth-svg">
          <defs>
            <linearGradient id="retireTealGrad" x1="0" y1="0" x2="0" y2="1">
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
          <path d={valueAreaPath} fill="url(#retireTealGrad)" />

          {/* Contributions Line */}
          <path
            d={contribLinePath}
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="2.5"
            strokeDasharray="6 4"
          />

          {/* Value Line */}
          <path
            d={valueLinePath}
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
                cy={p.yTotal}
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
                Age {p.data?.age ?? ''}
              </text>
            ))}
        </svg>
      </div>
    </div>
  );
}
