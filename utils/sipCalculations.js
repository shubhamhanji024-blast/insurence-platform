/**
 * Utility functions for SIP Calculation & Indian Currency Formatting
 */

/**
 * Format numbers in the Indian Numbering System (e.g. ₹1,00,000, ₹10,00,000, ₹1,00,00,000)
 */
export function formatIndianCurrency(amount, includeSymbol = true) {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return includeSymbol ? '₹0' : '0';
  }

  const num = Math.round(amount);
  const isNegative = num < 0;
  const absNumStr = Math.abs(num).toString();

  let lastThree = absNumStr.substring(absNumStr.length - 3);
  const otherDigits = absNumStr.substring(0, absNumStr.length - 3);

  if (otherDigits !== '') {
    lastThree = ',' + lastThree;
  }

  const formattedStr =
    otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  const prefix = isNegative ? '-₹' : includeSymbol ? '₹' : '';
  return `${prefix}${formattedStr}`;
}

/**
 * Short Indian Currency representation (e.g. ₹11.6 Lakhs, ₹1.2 Cr)
 */
export function formatShortIndianCurrency(amount) {
  if (isNaN(amount)) return '₹0';
  const absVal = Math.abs(amount);
  if (absVal >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (absVal >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return formatIndianCurrency(amount);
}

/**
 * Calculate SIP Future Value, Total Investment, and Estimated Returns
 * P = Monthly Investment
 * years = Investment Duration in Years
 * annualRate = Expected Annual Return Percentage (e.g. 12)
 */
export function calculateSIP(monthlyInvestment, years, annualRate) {
  const P = Math.max(0, Number(monthlyInvestment) || 0);
  const y = Math.max(0, Number(years) || 0);
  const rate = Math.max(0, Number(annualRate) || 0);

  const totalMonths = y * 12;
  const totalInvested = P * totalMonths;

  if (totalMonths === 0 || P === 0) {
    return {
      totalInvested: 0,
      estimatedReturns: 0,
      futureValue: 0,
      investedRatio: 50,
      returnsRatio: 50,
    };
  }

  let futureValue = 0;

  if (rate === 0) {
    futureValue = totalInvested;
  } else {
    const i = rate / 12 / 100; // monthly rate
    futureValue = P * ((Math.pow(1 + i, totalMonths) - 1) / i) * (1 + i);
  }

  futureValue = Math.round(futureValue);
  const estimatedReturns = Math.max(0, futureValue - totalInvested);

  const investedRatio = futureValue > 0 ? (totalInvested / futureValue) * 100 : 50;
  const returnsRatio = futureValue > 0 ? (estimatedReturns / futureValue) * 100 : 50;

  return {
    totalInvested,
    estimatedReturns,
    futureValue,
    investedRatio: Number(investedRatio.toFixed(1)),
    returnsRatio: Number(returnsRatio.toFixed(1)),
  };
}

/**
 * Calculate yearly progression for growth charts and breakdown table
 */
export function calculateYearlyBreakdown(monthlyInvestment, years, annualRate) {
  const P = Math.max(0, Number(monthlyInvestment) || 0);
  const totalYears = Math.max(1, Math.min(40, Number(years) || 1));
  const rate = Math.max(0, Number(annualRate) || 0);
  const i = rate / 12 / 100;

  const breakdown = [];

  for (let yr = 1; yr <= totalYears; yr++) {
    const months = yr * 12;
    const invested = P * months;
    let fv = 0;

    if (rate === 0) {
      fv = invested;
    } else {
      fv = P * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
    }

    fv = Math.round(fv);
    const returns = Math.max(0, fv - invested);

    breakdown.push({
      year: yr,
      label: `Year ${yr}`,
      invested,
      returns,
      futureValue: fv,
    });
  }

  return breakdown;
}
