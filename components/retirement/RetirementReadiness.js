'use client';
import { formatIndianCurrency, formatShortIndianCurrency } from '@/utils/sipCalculations';

export default function RetirementReadiness({
  plan,
  readinessPct,
  isFullyFunded,
  surplusDeficit,
  additionalMonthlySIP,
  yearsToRetire: propYears,
  projectedSavings: propSavings,
  targetCorpus: propCorpus,
}) {
  const readinessPercentage = plan?.readinessPercentage ?? readinessPct ?? 0;
  const rawReadiness = plan?.rawReadiness ?? readinessPct ?? 0;
  const projectedSavings = plan?.projectedSavings ?? propSavings ?? 0;
  const requiredCorpus = plan?.requiredCorpus ?? propCorpus ?? 0;
  const isSurplus = plan?.isSurplus ?? isFullyFunded ?? (projectedSavings >= requiredCorpus);
  const netDifference = Math.abs(plan?.netDifference ?? surplusDeficit ?? (projectedSavings - requiredCorpus));

  const strokeWidth = 14;
  const size = 130;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference - (readinessPercentage / 100) * circumference;

  return (
    <div className="glass-card-static" style={{ padding: '1.5rem', marginBottom: '1.25rem', background: '#ffffff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Circular Progress Gauge */}
          <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth={strokeWidth}
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={isSurplus ? '#19C3A3' : '#e11d48'}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={dashoffset}
                strokeLinecap="round"
                style={{
                  transform: 'rotate(-90deg)',
                  transformOrigin: '50% 50%',
                  transition: 'stroke-dashoffset 0.6s ease',
                }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: isSurplus ? '#19C3A3' : '#e11d48', fontFamily: "'Playfair Display', serif" }}>
                {readinessPercentage}%
              </span>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-500)' }}>
                Readiness
              </span>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gray-500)' }}>
              Goal Progress Status
            </span>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-900)', margin: '0.2rem 0 0.4rem' }}>
              {isSurplus ? '🎉 Fully On Track for Retirement!' : '⚠️ Retirement Savings Gap Identified'}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', margin: 0, maxWidth: '400px', lineHeight: 1.5 }}>
              {isSurplus
                ? `Your projected savings of ${formatShortIndianCurrency(projectedSavings)} cover your estimated required corpus of ${formatShortIndianCurrency(requiredCorpus)} with a surplus.`
                : `Your projected savings will cover ${readinessPercentage}% of your target corpus. Increasing contributions now bridges the ${formatShortIndianCurrency(Math.abs(netDifference))} gap.`}
            </p>
          </div>
        </div>

        {/* Progress Bar Display */}
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-600)', marginBottom: '0.35rem' }}>
            <span>Target Goal: {formatShortIndianCurrency(requiredCorpus)}</span>
            <span>{rawReadiness}%</span>
          </div>
          <div className="progress-bar-container" style={{ height: '10px', background: '#e2e8f0', borderRadius: '5px' }}>
            <div
              className="progress-bar-fill"
              style={{
                width: `${readinessPercentage}%`,
                background: isSurplus ? '#19C3A3' : 'linear-gradient(90deg, #f43f5e, #e11d48)',
                borderRadius: '5px',
                height: '100%',
                transition: 'width 0.5s ease',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
