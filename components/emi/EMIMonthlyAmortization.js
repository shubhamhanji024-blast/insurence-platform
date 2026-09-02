'use client';
import { useState } from 'react';
import { formatIndianCurrency } from '@/utils/sipCalculations';

export default function EMIMonthlyAmortization({ monthlySchedule }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  if (!monthlySchedule || monthlySchedule.length === 0) return null;

  const displayedMonths = showAll ? monthlySchedule : monthlySchedule.slice(0, 12);

  return (
    <div className="glass-card-static sip-breakdown-card">
      <button
        type="button"
        className="sip-breakdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="breakdown-icon">🗓️</div>
          <div>
            <h4 className="breakdown-title">View Monthly Amortization Schedule</h4>
            <p className="breakdown-sub">
              {isOpen ? 'Click to collapse monthly schedule' : 'Click to inspect month-by-month principal and interest allocation'}
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
                  <th>Month</th>
                  <th>EMI Payment</th>
                  <th>Principal Component</th>
                  <th>Interest Component</th>
                  <th>Remaining Balance</th>
                </tr>
              </thead>
              <tbody>
                {displayedMonths.map((row) => (
                  <tr key={row.month}>
                    <td className="font-semibold text-navy">Month {row.month}</td>
                    <td className="font-semibold">{formatIndianCurrency(row.emi)}</td>
                    <td>{formatIndianCurrency(row.principal)}</td>
                    <td className="text-teal">{formatIndianCurrency(row.interest)}</td>
                    <td className="font-bold text-navy">
                      {formatIndianCurrency(row.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {monthlySchedule.length > 12 && (
            <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll
                  ? 'Show First 12 Months Only'
                  : `View Full Schedule (${monthlySchedule.length} Months)`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
