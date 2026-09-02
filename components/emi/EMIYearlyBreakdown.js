'use client';
import { useState } from 'react';
import { formatIndianCurrency } from '@/utils/sipCalculations';

export default function EMIYearlyBreakdown({ yearlyData }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!yearlyData || yearlyData.length === 0) return null;

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
            <h4 className="breakdown-title">Yearly Repayment Breakdown</h4>
            <p className="breakdown-sub">
              {isOpen ? 'Click to collapse breakdown' : 'Click to view year-by-year principal & interest split'}
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
          <div className="sip-table-container">
            <table className="sip-table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Principal Paid</th>
                  <th>Interest Paid</th>
                  <th>Total Payment</th>
                  <th>Remaining Balance</th>
                </tr>
              </thead>
              <tbody>
                {yearlyData.map((row) => (
                  <tr key={row.year}>
                    <td className="font-semibold text-navy">Year {row.year}</td>
                    <td>{formatIndianCurrency(row.principalPaid)}</td>
                    <td className="text-teal">{formatIndianCurrency(row.interestPaid)}</td>
                    <td className="font-semibold">{formatIndianCurrency(row.totalPayment)}</td>
                    <td className="font-bold text-navy">
                      {formatIndianCurrency(row.remainingBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
