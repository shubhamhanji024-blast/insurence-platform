'use client';
import { useState } from 'react';
import { formatIndianCurrency } from '@/utils/sipCalculations';

export default function RetirementYearlyProjection({ preSchedule, postSchedule }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('pre'); // 'pre' | 'post'

  if (!preSchedule || preSchedule.length === 0) return null;

  return (
    <div className="glass-card-static sip-breakdown-card">
      <button
        type="button"
        className="sip-breakdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="breakdown-icon">📊</div>
          <div>
            <h4 className="breakdown-title">Year-by-Year Retirement Projection Table</h4>
            <p className="breakdown-sub">
              {isOpen ? 'Click to collapse projection schedule' : 'Click to inspect annual accumulation and decumulation tables'}
            </p>
          </div>
        </div>

        <div className="breakdown-chevron">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="sip-breakdown-content fade-in-up">
          {/* Sub Tab Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <button
              type="button"
              className={`emi-type-btn ${activeTab === 'pre' ? 'active' : ''}`}
              onClick={() => setActiveTab('pre')}
            >
              Pre-Retirement Accumulation ({preSchedule.length} Years)
            </button>
            <button
              type="button"
              className={`emi-type-btn ${activeTab === 'post' ? 'active' : ''}`}
              onClick={() => setActiveTab('post')}
            >
              Post-Retirement Decumulation ({postSchedule.length} Years)
            </button>
          </div>

          <div className="sip-table-container">
            {activeTab === 'pre' ? (
              <table className="sip-table">
                <thead>
                  <tr>
                    <th>Age</th>
                    <th>Year</th>
                    <th>Total Contributions</th>
                    <th>Estimated Growth</th>
                    <th>Projected Savings</th>
                  </tr>
                </thead>
                <tbody>
                  {preSchedule.map((row) => (
                    <tr key={row.age}>
                      <td className="font-semibold text-navy">Age {row.age}</td>
                      <td>{row.year}</td>
                      <td>{formatIndianCurrency(row.totalContrib)}</td>
                      <td className="text-gold">+{formatIndianCurrency(row.growth)}</td>
                      <td className="font-bold text-teal">
                        {formatIndianCurrency(row.totalSavings)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="sip-table">
                <thead>
                  <tr>
                    <th>Age</th>
                    <th>Year</th>
                    <th>Annual Expenses</th>
                    <th>Monthly Expenses</th>
                    <th>Estimated Remaining Corpus</th>
                  </tr>
                </thead>
                <tbody>
                  {postSchedule.map((row) => (
                    <tr key={row.age}>
                      <td className="font-semibold text-navy">Age {row.age}</td>
                      <td>{row.year}</td>
                      <td className="text-teal">{formatIndianCurrency(row.annualExpenses)}</td>
                      <td>{formatIndianCurrency(row.monthlyExpenses)}/mo</td>
                      <td className="font-bold text-navy">
                        {formatIndianCurrency(row.remainingCorpus)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
