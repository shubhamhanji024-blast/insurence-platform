/**
 * Utility functions for Retirement Corpus & Savings Projections
 */
import { formatIndianCurrency, formatShortIndianCurrency } from './sipCalculations';

/**
 * Perform comprehensive Retirement Plan Calculations
 */
export function calculateRetirementPlan({
  currentAge = 30,
  retirementAge = 60,
  lifeExpectancy = 85,
  currentExpenses = 50000,
  inflationRate = 6,
  currentSavings = 500000,
  monthlyInvestment = 20000,
  preReturn = 12,
  postReturn = 7,
}) {
  const cAge = Math.max(18, Math.min(75, Number(currentAge) || 30));
  const rAge = Math.max(cAge + 1, Math.min(80, Number(retirementAge) || 60));
  const lAge = Math.max(rAge + 1, Math.min(100, Number(lifeExpectancy) || 85));

  const expenses = Math.max(0, Number(currentExpenses) || 0);
  const inflation = Math.max(0, Math.min(15, Number(inflationRate) || 0));
  const savings = Math.max(0, Number(currentSavings) || 0);
  const monthly = Math.max(0, Number(monthlyInvestment) || 0);
  const ratePre = Math.max(0, Math.min(30, Number(preReturn) || 0));
  const ratePost = Math.max(0, Math.min(20, Number(postReturn) || 0));

  const yearsToRetire = Math.max(1, rAge - cAge);
  const retirementYears = Math.max(1, lAge - rAge);

  // 1. Future Monthly Expenses at Retirement (Inflation Adjusted)
  const infFactor = Math.pow(1 + inflation / 100, yearsToRetire);
  const futureMonthlyExpenses = Math.round(expenses * infFactor);
  const futureAnnualExpenses = futureMonthlyExpenses * 12;

  // 2. Future Value of Current Savings
  const savingsFV = Math.round(savings * Math.pow(1 + ratePre / 100, yearsToRetire));

  // 3. Future Value of Monthly Investment (SIP Formula)
  let monthlyFV = 0;
  const totalMonths = yearsToRetire * 12;
  if (ratePre === 0) {
    monthlyFV = monthly * totalMonths;
  } else {
    const monthlyRate = ratePre / 12 / 100;
    monthlyFV = monthly * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
  }
  monthlyFV = Math.round(monthlyFV);

  // Total Projected Savings at Retirement
  const projectedSavings = savingsFV + monthlyFV;

  // 4. Required Retirement Corpus (Inflation-adjusted annuity post-retirement)
  let requiredCorpus = 0;
  const realRate = (1 + ratePost / 100) / (1 + inflation / 100) - 1;

  if (Math.abs(realRate) < 0.0001) {
    requiredCorpus = futureAnnualExpenses * retirementYears;
  } else {
    // Present value of growing annuity during retirement
    requiredCorpus =
      futureAnnualExpenses *
      ((1 - Math.pow(1 + realRate, -retirementYears)) / realRate) *
      (1 + realRate);
  }
  requiredCorpus = Math.round(Math.max(0, requiredCorpus));

  // 5. Shortfall / Surplus
  const netDifference = projectedSavings - requiredCorpus;
  const isSurplus = netDifference >= 0;

  // 6. Retirement Readiness Percentage
  const rawReadiness = requiredCorpus > 0 ? (projectedSavings / requiredCorpus) * 100 : 100;
  const readinessPercentage = Math.min(100, Math.round(rawReadiness));

  return {
    currentAge: cAge,
    retirementAge: rAge,
    lifeExpectancy: lAge,
    yearsToRetire,
    retirementYears,
    futureMonthlyExpenses,
    futureAnnualExpenses,
    savingsFV,
    monthlyFV,
    projectedSavings,
    requiredCorpus,
    netDifference,
    isSurplus,
    readinessPercentage,
    rawReadiness: Number(rawReadiness.toFixed(1)),
  };
}

/**
 * Generate Pre-Retirement Accumulation Schedule
 */
export function calculatePreRetirementSchedule(params) {
  const { currentAge, retirementAge, currentSavings, monthlyInvestment, preReturn } = params;
  const cAge = Number(currentAge) || 30;
  const rAge = Number(retirementAge) || 60;
  const savings = Number(currentSavings) || 0;
  const monthly = Number(monthlyInvestment) || 0;
  const ratePre = Number(preReturn) || 0;

  const currentYr = new Date().getFullYear();
  const schedule = [];

  let currentSavingsAcc = savings;
  let monthlyAcc = 0;
  let totalContrib = savings;

  const totalYears = Math.max(1, rAge - cAge);

  for (let yr = 0; yr <= totalYears; yr++) {
    const age = cAge + yr;
    const year = currentYr + yr;

    if (yr === 0) {
      schedule.push({
        age,
        year,
        savingsPart: savings,
        monthlyPart: 0,
        totalSavings: savings,
        totalContrib: savings,
        growth: 0,
      });
    } else {
      // Annual compounding on initial savings
      currentSavingsAcc = savings * Math.pow(1 + ratePre / 100, yr);

      // Monthly investment compounding
      const months = yr * 12;
      totalContrib = savings + monthly * months;

      if (ratePre === 0) {
        monthlyAcc = monthly * months;
      } else {
        const i = ratePre / 12 / 100;
        monthlyAcc = monthly * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
      }

      const totalVal = Math.round(currentSavingsAcc + monthlyAcc);
      const growth = Math.max(0, totalVal - totalContrib);

      schedule.push({
        age,
        year,
        savingsPart: Math.round(currentSavingsAcc),
        monthlyPart: Math.round(monthlyAcc),
        totalSavings: totalVal,
        totalContrib,
        growth,
      });
    }
  }

  return schedule;
}

/**
 * Generate Post-Retirement Decumulation Schedule
 */
export function calculatePostRetirementSchedule(params) {
  const {
    retirementAge,
    lifeExpectancy,
    projectedSavings,
    futureMonthlyExpenses,
    inflationRate,
    postReturn,
  } = params;

  const rAge = Number(retirementAge) || 60;
  const lAge = Number(lifeExpectancy) || 85;
  let corpus = Number(projectedSavings) || 0;
  let monthlyExp = Number(futureMonthlyExpenses) || 0;
  const inf = Number(inflationRate) || 0;
  const ratePost = Number(postReturn) || 0;

  const currentYr = new Date().getFullYear() + (rAge - (params.currentAge || 30));
  const schedule = [];
  const totalRetirementYears = lAge - rAge;

  for (let yr = 1; yr <= totalRetirementYears; yr++) {
    const age = rAge + yr;
    const year = currentYr + yr;

    // Annual Expenses for this year
    const annualExp = Math.round(monthlyExp * 12);
    // Interest earned on corpus during the year
    const interestEarned = Math.round(corpus * (ratePost / 100));

    // Ending Corpus after expenses and returns
    corpus = Math.max(0, Math.round(corpus + interestEarned - annualExp));

    schedule.push({
      yearIndex: yr,
      age,
      year,
      annualExpenses: annualExp,
      monthlyExpenses: Math.round(monthlyExp),
      remainingCorpus: corpus,
    });

    // Inflate monthly expense for next year
    monthlyExp = monthlyExp * (1 + inf / 100);
  }

  return schedule;
}
