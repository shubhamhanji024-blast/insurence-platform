/**
 * Utility functions for EMI Calculations and Amortization Schedules
 */
import { formatIndianCurrency, formatShortIndianCurrency } from './sipCalculations';

/**
 * Calculate Monthly EMI, Total Interest, and Total Payment
 * P = Principal Loan Amount
 * annualRate = Annual Interest Rate in percentage (e.g. 8.5)
 * totalMonths = Loan Tenure in Months
 */
export function calculateEMI(principal, annualRate, totalMonths) {
  const P = Math.max(0, Number(principal) || 0);
  const rate = Math.max(0, Number(annualRate) || 0);
  const n = Math.max(1, Number(totalMonths) || 1);

  if (P === 0 || n === 0) {
    return {
      monthlyEMI: 0,
      totalInterest: 0,
      totalPayment: 0,
      principalRatio: 50,
      interestRatio: 50,
    };
  }

  let monthlyEMI = 0;

  if (rate === 0) {
    monthlyEMI = P / n;
  } else {
    const r = rate / 12 / 100; // Monthly interest rate
    const factor = Math.pow(1 + r, n);
    monthlyEMI = P * r * (factor / (factor - 1));
  }

  monthlyEMI = Math.round(monthlyEMI);
  const totalPayment = monthlyEMI * n;
  const totalInterest = Math.max(0, totalPayment - P);

  const principalRatio = totalPayment > 0 ? (P / totalPayment) * 100 : 50;
  const interestRatio = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 50;

  return {
    monthlyEMI,
    totalInterest,
    totalPayment,
    principalRatio: Number(principalRatio.toFixed(1)),
    interestRatio: Number(interestRatio.toFixed(1)),
  };
}

/**
 * Calculate Yearly Amortization Breakdown
 */
export function calculateEMIYearlyBreakdown(principal, annualRate, totalMonths) {
  const P = Math.max(0, Number(principal) || 0);
  const rate = Math.max(0, Number(annualRate) || 0);
  const n = Math.max(1, Number(totalMonths) || 1);

  const { monthlyEMI } = calculateEMI(P, rate, n);
  const r = rate / 12 / 100;

  let balance = P;
  const yearlyData = [];
  const totalYears = Math.ceil(n / 12);

  let currentYearPrincipal = 0;
  let currentYearInterest = 0;

  for (let month = 1; month <= n; month++) {
    const interestForMonth = r > 0 ? Math.round(balance * r) : 0;
    const principalForMonth = Math.min(balance, monthlyEMI - interestForMonth);

    balance = Math.max(0, balance - principalForMonth);
    currentYearPrincipal += principalForMonth;
    currentYearInterest += interestForMonth;

    if (month % 12 === 0 || month === n) {
      const yearIndex = Math.ceil(month / 12);
      yearlyData.push({
        year: yearIndex,
        label: `Year ${yearIndex}`,
        principalPaid: currentYearPrincipal,
        interestPaid: currentYearInterest,
        totalPayment: currentYearPrincipal + currentYearInterest,
        remainingBalance: balance,
      });

      currentYearPrincipal = 0;
      currentYearInterest = 0;
    }
  }

  return yearlyData;
}

/**
 * Calculate Full Monthly Amortization Schedule
 */
export function calculateEMIMonthlyAmortization(principal, annualRate, totalMonths) {
  const P = Math.max(0, Number(principal) || 0);
  const rate = Math.max(0, Number(annualRate) || 0);
  const n = Math.max(1, Number(totalMonths) || 1);

  const { monthlyEMI } = calculateEMI(P, rate, n);
  const r = rate / 12 / 100;

  let balance = P;
  const schedule = [];

  for (let month = 1; month <= n; month++) {
    const interestForMonth = r > 0 ? Math.round(balance * r) : 0;
    const principalForMonth = Math.min(balance, monthlyEMI - interestForMonth);
    balance = Math.max(0, balance - principalForMonth);

    schedule.push({
      month,
      emi: monthlyEMI,
      principal: principalForMonth,
      interest: interestForMonth,
      balance,
    });
  }

  return schedule;
}
