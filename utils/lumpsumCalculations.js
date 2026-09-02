/**
 * Utility functions for Lumpsum Investment Calculations & Growth Schedules
 */
import { formatIndianCurrency, formatShortIndianCurrency } from './sipCalculations';

/**
 * Calculate Lumpsum Future Value, Total Gain, and Investment Ratios
 * P = Initial Investment
 * years = Investment Duration in Years
 * annualRate = Expected Annual Return Percentage (e.g. 12)
 */
export function calculateLumpsum(initialInvestment, years, annualRate) {
  const P = Math.max(0, Number(initialInvestment) || 0);
  const y = Math.max(0, Number(years) || 0);
  const rate = Math.max(0, Number(annualRate) || 0);

  if (P === 0 || y === 0) {
    return {
      initialInvestment: P,
      estimatedReturns: 0,
      futureValue: P,
      investedRatio: 100,
      returnsRatio: 0,
    };
  }

  let futureValue = 0;

  if (rate === 0) {
    futureValue = P;
  } else {
    const r = rate / 100;
    futureValue = P * Math.pow(1 + r, y);
  }

  futureValue = Math.round(futureValue);
  const estimatedReturns = Math.max(0, futureValue - P);

  const investedRatio = futureValue > 0 ? (P / futureValue) * 100 : 100;
  const returnsRatio = futureValue > 0 ? (estimatedReturns / futureValue) * 100 : 0;

  return {
    initialInvestment: P,
    estimatedReturns,
    futureValue,
    investedRatio: Number(investedRatio.toFixed(1)),
    returnsRatio: Number(returnsRatio.toFixed(1)),
  };
}

/**
 * Calculate Yearly Growth Breakdown for Lumpsum Investment over time
 */
export function calculateLumpsumYearlyBreakdown(initialInvestment, years, annualRate) {
  const P = Math.max(0, Number(initialInvestment) || 0);
  const totalYears = Math.max(1, Math.min(50, Number(years) || 1));
  const rate = Math.max(0, Number(annualRate) || 0);
  const r = rate / 100;

  const breakdown = [];

  for (let yr = 1; yr <= totalYears; yr++) {
    let fv = 0;
    if (rate === 0) {
      fv = P;
    } else {
      fv = P * Math.pow(1 + r, yr);
    }

    fv = Math.round(fv);
    const returns = Math.max(0, fv - P);

    breakdown.push({
      year: yr,
      label: `Year ${yr}`,
      initialInvestment: P,
      estimatedReturns: returns,
      futureValue: fv,
    });
  }

  return breakdown;
}
