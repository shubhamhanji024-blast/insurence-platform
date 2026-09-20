import { calculateSIP, calculateYearlyBreakdown, formatIndianCurrency } from '../utils/sipCalculations.js';
import { calculateEMI, calculateEMIYearlyBreakdown, calculateEMIMonthlyAmortization } from '../utils/emiCalculations.js';
import { calculateLumpsum, calculateLumpsumYearlyBreakdown } from '../utils/lumpsumCalculations.js';
import { calculateRetirementPlan, calculatePreRetirementSchedule, calculatePostRetirementSchedule } from '../utils/retirementCalculations.js';

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    console.error('FAIL:', msg);
    failed++;
  } else {
    console.log('PASS:', msg);
  }
}

console.log('=== 1. SIP CALCULATOR TESTS ===');
// Known test case: Monthly 10,000, 10 yrs, 12% return
const sip1 = calculateSIP(10000, 10, 12);
assert(sip1.totalInvested === 1200000, `SIP Total Invested expected 1200000, got ${sip1.totalInvested}`);
assert(sip1.futureValue === 2323391, `SIP Future Value expected 2323391, got ${sip1.futureValue}`);
assert(sip1.estimatedReturns === 1123391, `SIP Estimated Returns expected 1123391, got ${sip1.estimatedReturns}`);

// Edge case: 0% return
const sipZeroReturn = calculateSIP(10000, 5, 0);
assert(sipZeroReturn.totalInvested === 600000, `SIP 0% return totalInvested expected 600000, got ${sipZeroReturn.totalInvested}`);
assert(sipZeroReturn.futureValue === 600000, `SIP 0% return futureValue expected 600000, got ${sipZeroReturn.futureValue}`);
assert(sipZeroReturn.estimatedReturns === 0, `SIP 0% return returns expected 0, got ${sipZeroReturn.estimatedReturns}`);

// Edge case: 0 investment
const sipZeroInvest = calculateSIP(0, 10, 12);
assert(sipZeroInvest.totalInvested === 0, 'SIP 0 investment totalInvested is 0');
assert(sipZeroInvest.futureValue === 0, 'SIP 0 investment futureValue is 0');
assert(!isNaN(sipZeroInvest.investedRatio), 'SIP 0 investment ratio is not NaN');

// Edge case: 1-year duration
const sip1Yr = calculateSIP(5000, 1, 10);
assert(sip1Yr.totalInvested === 60000, `SIP 1-yr invested: ${sip1Yr.totalInvested}`);
assert(sip1Yr.futureValue > 60000, `SIP 1-yr futureValue: ${sip1Yr.futureValue}`);

console.log('\n=== 2. EMI CALCULATOR TESTS ===');
// Known test case: Loan 10,00,000, Interest 10%, Tenure 5 yrs (60 mo)
const emi1 = calculateEMI(1000000, 10, 60);
assert(emi1.monthlyEMI === 21247, `EMI expected 21247, got ${emi1.monthlyEMI}`);
assert(emi1.principalAmount === 1000000, `Principal expected 1000000, got ${emi1.principalAmount}`);
assert(emi1.totalPayment === 1274820, `Total payment expected 1274820, got ${emi1.totalPayment}`);
assert(emi1.totalInterest === 274820, `Total interest expected 274820, got ${emi1.totalInterest}`);

// Edge case: 0% interest rate
const emiZeroRate = calculateEMI(600000, 0, 60);
assert(emiZeroRate.monthlyEMI === 10000, `EMI 0% interest monthly EMI expected 10000, got ${emiZeroRate.monthlyEMI}`);
assert(emiZeroRate.totalInterest === 0, `EMI 0% interest total interest expected 0, got ${emiZeroRate.totalInterest}`);
assert(emiZeroRate.totalPayment === 600000, `EMI 0% interest total payment expected 600000, got ${emiZeroRate.totalPayment}`);

// Edge case: 0 principal
const emiZeroPrincipal = calculateEMI(0, 8.5, 240);
assert(emiZeroPrincipal.monthlyEMI === 0, 'EMI 0 principal monthly EMI is 0');
assert(emiZeroPrincipal.totalInterest === 0, 'EMI 0 principal total interest is 0');
assert(!isNaN(emiZeroPrincipal.principalRatio), 'EMI 0 principal ratio is not NaN');

console.log('\n=== 3. LUMPSUM CALCULATOR TESTS ===');
// Known test case: Investment 5,00,000, Return 10%, Duration 10 yrs
const lump1 = calculateLumpsum(500000, 10, 10);
assert(lump1.initialInvestment === 500000, `Lumpsum initial expected 500000, got ${lump1.initialInvestment}`);
assert(lump1.futureValue === 1296871, `Lumpsum futureValue expected 1296871, got ${lump1.futureValue}`);
assert(lump1.estimatedReturns === 796871, `Lumpsum returns expected 796871, got ${lump1.estimatedReturns}`);

// Edge case: 0% return
const lumpZeroRate = calculateLumpsum(100000, 10, 0);
assert(lumpZeroRate.futureValue === 100000, `Lumpsum 0% return futureValue expected 100000, got ${lumpZeroRate.futureValue}`);
assert(lumpZeroRate.estimatedReturns === 0, `Lumpsum 0% return returns expected 0, got ${lumpZeroRate.estimatedReturns}`);

// Edge case: 0 investment
const lumpZeroP = calculateLumpsum(0, 10, 12);
assert(lumpZeroP.futureValue === 0, 'Lumpsum 0 investment futureValue is 0');
assert(!isNaN(lumpZeroP.investedRatio), 'Lumpsum 0 investment ratio is not NaN');

console.log('\n=== 4. RETIREMENT CALCULATOR TESTS ===');
const ret1 = calculateRetirementPlan({
  currentAge: 30,
  retirementAge: 60,
  lifeExpectancy: 85,
  currentExpenses: 50000,
  inflationRate: 6,
  currentSavings: 500000,
  monthlyInvestment: 20000,
  preReturn: 12,
  postReturn: 7,
});
assert(ret1.yearsToRetire === 30, `Years to retire expected 30, got ${ret1.yearsToRetire}`);
assert(ret1.retirementYears === 25, `Retirement years expected 25, got ${ret1.retirementYears}`);
assert(ret1.futureMonthlyExpenses > 50000, `Future monthly expenses expected > 50000, got ${ret1.futureMonthlyExpenses}`);
assert(ret1.requiredCorpus > 0, `Required corpus expected > 0, got ${ret1.requiredCorpus}`);
assert(ret1.projectedSavings > 0, `Projected savings expected > 0, got ${ret1.projectedSavings}`);
assert(!isNaN(ret1.requiredCorpus), 'Required corpus is not NaN');
assert(!isNaN(ret1.projectedSavings), 'Projected savings is not NaN');
assert(isFinite(ret1.requiredCorpus), 'Required corpus is finite');

// Edge cases for Retirement: 0 savings, 0 monthly
const retZero = calculateRetirementPlan({
  currentAge: 25,
  retirementAge: 60,
  lifeExpectancy: 80,
  currentExpenses: 30000,
  inflationRate: 5,
  currentSavings: 0,
  monthlyInvestment: 0,
  preReturn: 10,
  postReturn: 6,
});
assert(retZero.projectedSavings === 0, 'Retirement 0 savings & 0 monthly has 0 projected savings');
assert(retZero.requiredCorpus > 0, 'Retirement required corpus > 0');
assert(retZero.netDifference < 0, 'Retirement has shortfall');
assert(retZero.additionalMonthlySIP > 0, 'Additional monthly SIP suggested');

console.log('\n=== 5. CURRENCY FORMATTING TESTS ===');
assert(formatIndianCurrency(10000) === '₹10,000', `₹10,000 expected, got ${formatIndianCurrency(10000)}`);
assert(formatIndianCurrency(100000) === '₹1,00,00,000'.substring(0, 0) || formatIndianCurrency(100000) === '₹1,00,000', `₹1,00,000 expected, got ${formatIndianCurrency(100000)}`);
assert(formatIndianCurrency(1000000) === '₹10,00,000', `₹10,00,000 expected, got ${formatIndianCurrency(1000000)}`);
assert(formatIndianCurrency(10000000) === '₹1,00,00,000', `₹1,00,00,000 expected, got ${formatIndianCurrency(10000000)}`);
assert(formatIndianCurrency(0) === '₹0', `₹0 expected, got ${formatIndianCurrency(0)}`);
assert(formatIndianCurrency(null) === '₹0', `null returns ₹0`);
assert(formatIndianCurrency(undefined) === '₹0', `undefined returns ₹0`);
assert(formatIndianCurrency(NaN) === '₹0', `NaN returns ₹0`);
assert(formatIndianCurrency(Infinity) === '₹0', `Infinity returns ₹0`);

console.log(`\nTests complete! Total failures: ${failed}`);
if (failed > 0) process.exit(1);
