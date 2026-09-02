'use client';
import { useState, useMemo, useEffect } from 'react';
import EMIInputs from './EMIInputs';
import EMIResults from './EMIResults';
import EMIRepaymentChart from './EMIRepaymentChart';
import EMIYearlyBreakdown from './EMIYearlyBreakdown';
import EMIMonthlyAmortization from './EMIMonthlyAmortization';
import EMIEducation from './EMIEducation';
import EMIDisclaimer from './EMIDisclaimer';
import SaveCalculationModal from '@/components/SaveCalculationModal';
import {
  calculateEMI,
  calculateEMIYearlyBreakdown,
  calculateEMIMonthlyAmortization,
} from '@/utils/emiCalculations';

export default function EMICalculator() {
  // Default values
  const DEFAULT_TYPE = 'home';
  const DEFAULT_AMOUNT = 1000000;
  const DEFAULT_RATE = 8.5;
  const DEFAULT_TENURE_VAL = 20;
  const DEFAULT_TENURE_UNIT = 'years';

  const [loanType, setLoanType] = useState(DEFAULT_TYPE);
  const [loanAmount, setLoanAmount] = useState(DEFAULT_AMOUNT);
  const [interestRate, setInterestRate] = useState(DEFAULT_RATE);
  const [tenureValue, setTenureValue] = useState(DEFAULT_TENURE_VAL);
  const [tenureUnit, setTenureUnit] = useState(DEFAULT_TENURE_UNIT);

  // Recalculate Pre-fill Handler (reads query param safely on client)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const loadId = params.get('load');
    if (!loadId) return;

    async function loadSavedCalculation() {
      try {
        const res = await fetch(`/api/calculations/${loadId}`);
        const data = await res.json();
        if (res.ok && data.success && data.calculation?.inputData) {
          const inputs = data.calculation.inputData;
          if (inputs.loanType) setLoanType(inputs.loanType);
          if (inputs.loanAmount) setLoanAmount(Number(inputs.loanAmount));
          if (inputs.interestRate) setInterestRate(Number(inputs.interestRate));
          if (inputs.tenureValue) setTenureValue(Number(inputs.tenureValue));
          if (inputs.tenureUnit) setTenureUnit(inputs.tenureUnit);
        }
      } catch (err) {
        console.error('[Load Saved EMI Calculation Error]:', err);
      }
    }
    loadSavedCalculation();
  }, []);

  // Input Validation
  const errors = useMemo(() => {
    const errs = {};
    if (loanAmount !== '' && (loanAmount < 50000 || loanAmount > 20000000)) {
      errs.amount = 'Loan amount must be between ₹50,000 and ₹2,00,00,000.';
    }
    if (interestRate !== '' && (interestRate < 1 || interestRate > 25)) {
      errs.rate = 'Interest rate must be between 1% and 25%.';
    }
    const months = tenureUnit === 'years' ? (Number(tenureValue) || 1) * 12 : Number(tenureValue) || 1;
    if (tenureValue !== '' && (months < 12 || months > 360)) {
      errs.tenure = 'Loan tenure must be between 1 and 30 years (12 to 360 months).';
    }
    return errs;
  }, [loanAmount, interestRate, tenureValue, tenureUnit]);

  // Safe Values for Calculation
  const safeAmount = Math.max(50000, Math.min(20000000, Number(loanAmount) || 50000));
  const safeRate = Math.max(0, Math.min(25, Number(interestRate) || 0));

  const totalMonths = useMemo(() => {
    const rawVal = Number(tenureValue) || 1;
    if (tenureUnit === 'years') {
      return Math.max(12, Math.min(360, rawVal * 12));
    }
    return Math.max(1, Math.min(360, rawVal));
  }, [tenureValue, tenureUnit]);

  // Dynamic Calculation
  const result = useMemo(() => {
    return calculateEMI(safeAmount, safeRate, totalMonths);
  }, [safeAmount, safeRate, totalMonths]);

  const yearlyData = useMemo(() => {
    return calculateEMIYearlyBreakdown(safeAmount, safeRate, totalMonths);
  }, [safeAmount, safeRate, totalMonths]);

  const monthlyAmortization = useMemo(() => {
    return calculateEMIMonthlyAmortization(safeAmount, safeRate, totalMonths);
  }, [safeAmount, safeRate, totalMonths]);

  // Reset Callback
  const handleReset = () => {
    setLoanType(DEFAULT_TYPE);
    setLoanAmount(DEFAULT_AMOUNT);
    setInterestRate(DEFAULT_RATE);
    setTenureValue(DEFAULT_TENURE_VAL);
    setTenureUnit(DEFAULT_TENURE_UNIT);
  };

  return (
    <div className="sip-calculator-root">
      {/* Two Column Layout on Desktop */}
      <div className="sip-calculator-main-grid">
        {/* Left Column: Input Form Card */}
        <EMIInputs
          loanType={loanType}
          setLoanType={setLoanType}
          loanAmount={loanAmount}
          setLoanAmount={setLoanAmount}
          interestRate={interestRate}
          setInterestRate={setInterestRate}
          tenureValue={tenureValue}
          setTenureValue={setTenureValue}
          tenureUnit={tenureUnit}
          setTenureUnit={setTenureUnit}
          errors={errors}
          onReset={handleReset}
        />

        {/* Right Column: Key Results & Save Button */}
        <div>
          <EMIResults
            monthlyEMI={result.monthlyEMI}
            principalAmount={result.principalAmount}
            totalInterest={result.totalInterest}
            totalPayment={result.totalPayment}
          />

          <SaveCalculationModal
            calculatorType="EMI"
            inputData={{
              loanType,
              loanAmount: safeAmount,
              interestRate: safeRate,
              tenureValue,
              tenureUnit,
            }}
            resultData={result}
          />
        </div>
      </div>

      {/* Full Width Visual Components */}
      <EMIRepaymentChart
        principalAmount={result.principalAmount}
        totalInterest={result.totalInterest}
        totalPayment={result.totalPayment}
      />

      <EMIYearlyBreakdown yearlyData={yearlyData} />
      <EMIMonthlyAmortization monthlyData={monthlyAmortization} />
      <EMIEducation />
      <EMIDisclaimer />
    </div>
  );
}
