'use client';
import { useState } from 'react';
import { formatIndianCurrency, formatShortIndianCurrency } from '@/utils/sipCalculations';

export default function RetirementIncomeChart({ schedule }) {
  const [hoverIndex, setHoverIndex] = useState(null);

  if (!schedule || schedule.length === 0) return null;

  // Chart dimensions
  const width = 800;
  const height = 280;
  const padding = { top: 30, right: 30, bottom: 40, left: 70 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Max Y value
  const maxVal = Math.max(...schedule.map((d) => d.remainingCorpus || 0), 1);

  // Coordinate mapping
  const points = schedule.map((d, index) => {
    const x = padding.left + (index / Math.max(schedule.length - 1, 1)) * chartWidth;
    const yCorpus = height - padding.bottom - ((d.remainingCorpus || 0) / maxVal) * chartHeight;
    return { x, yCorpus, data: d, index };
  });

  const corpusAreaPath = `
    M ${points[0].x} ${points[0].yCorpus}
    ${points.map((p) => `L ${p.x} ${p.yCorpus}`).join(' ')}
    L ${points[points.length - 1].x} ${height - padding.bottom}
    L ${points[0].x} ${height - padding.bottom}
    Z
  `;

  const corpusLinePath = `
    M ${points[0].x} ${points[0].yCorpus}
    ${points.map((p) => `L ${p.x} ${p.yCorpus}`).join(' ')}
  `;

  const activePoint = hoverIndex !== null ? points[hoverIndex] : points[0];

  const startAge = (schedule[0]?.age ?? schedule[0]?.data?.age ?? 60) - 1;
  const endAge = schedule[schedule.length - 1]?.age ?? schedule[schedule.length - 1]?.data?.age ?? 85;

  return (
    <div className="glass-card-static sip-growth-chart-card">
      <div className="growth-chart-header">
        <div>
          <h4 className="growth-chart-title">Post-Retirement Income &amp; Corpus Trajectory</h4>
          <p className="growth-chart-sub">
            Tracking corpus decumulation from Age {startAge} to Age {endAge}
          </p>
        </div>

        {/* Legend */}
        <div className="growth-chart-legend">
          <div className="legend-chip">
            <span className="chip-line line-navy-dashed" style={{ background: '#101b3b' }} />
            <span>Remaining Corpus</span>
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
            Annual Expenses: <strong>{formatIndianCurrency(activePoint.data.annualExpenses)}</strong>
          </span>
          <span className="tooltip-stat">
            Remaining Corpus: <strong className="text-navy">{formatIndianCurrency(activePoint.data.remainingCorpus)}</strong>
          </span>
        </div>
      )}

      {/* SVG Chart */}
      <div className="svg-responsive-container">
        <svg viewBox={`0 0 ${width} ${height}`} className="growth-svg">
          <defs>
            <linearGradient id="navyCorpusGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.0" />
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
          <path d={corpusAreaPath} fill="url(#navyCorpusGrad)" />

          {/* Corpus Line */}
          <path
            d={corpusLinePath}
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Hover Dots */}
          {points.map((p, idx) => (
            <g key={idx}>
              <circle
                cx={p.x}
                cy={p.yCorpus}
                r={hoverIndex === idx ? 7 : 4}
                fill={hoverIndex === idx ? '#1e3a8a' : '#ffffff'}
                stroke="#1e3a8a"
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
