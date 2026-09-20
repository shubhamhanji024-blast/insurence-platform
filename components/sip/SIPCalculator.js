'use client';
import { useState, useMemo, useEffect } from 'react';
import SIPInputs from './SIPInputs';
import SIPResults from './SIPResults';
import SIPGrowthChart from './SIPGrowthChart';
import SIPYearlyBreakdown from './SIPYearlyBreakdown';
import SIPEducation from './SIPEducation';
import SIPDisclaimer from './SIPDisclaimer';
import SaveCalculationModal from '@/components/SaveCalculationModal';
import { calculateSIP, calculateYearlyBreakdown } from '@/utils/sipCalculations';
import { trackCalculatorUsage } from '@/utils/trackCalculator';

export default function SIPCalculator() {
  // Default values
  const DEFAULT_MONTHLY = 5000;
  const DEFAULT_YEARS = 10;
  const DEFAULT_RETURN = 12;

  const [monthlyInvestment, setMonthlyInvestment] = useState(DEFAULT_MONTHLY);
  const [years, setYears] = useState(DEFAULT_YEARS);
  const [annualReturn, setAnnualReturn] = useState(DEFAULT_RETURN);

  // Track calculator usage once on load
  useEffect(() => {
    trackCalculatorUsage('SIP');
  }, []);

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
          if (inputs.monthlyInvestment) setMonthlyInvestment(Number(inputs.monthlyInvestment));
          if (inputs.years) setYears(Number(inputs.years));
          if (inputs.annualReturn) setAnnualReturn(Number(inputs.annualReturn));
        }
      } catch (err) {
        console.error('[Load Saved SIP Calculation Error]:', err);
      }
    }
    loadSavedCalculation();
  }, []);

  // Input Validation
  const errors = useMemo(() => {
    const errs = {};
    if (monthlyInvestment !== '') {
      if (Number(monthlyInvestment) < 0) {
        errs.monthly = 'Monthly investment cannot be negative.';
      } else if (Number(monthlyInvestment) > 10000000) {
        errs.monthly = 'Monthly investment cannot exceed ₹1,00,00,000.';
      }
    }
    if (years !== '') {
      if (Number(years) < 1 || Number(years) > 50) {
        errs.years = 'Investment duration must be between 1 and 50 years.';
      }
    }
    if (annualReturn !== '') {
      if (Number(annualReturn) < 0 || Number(annualReturn) > 50) {
        errs.annualReturn = 'Expected annual return must be between 0% and 50%.';
      }
    }
    return errs;
  }, [monthlyInvestment, years, annualReturn]);

  // Safe Values for Real-time Calculation
  const safeMonthly = monthlyInvestment === '' ? 0 : Math.max(0, Number(monthlyInvestment) || 0);
  const safeYears = Math.max(0, Math.min(50, Number(years) || 0));
  const safeReturn = Math.max(0, Math.min(50, Number(annualReturn) || 0));

  // Dynamic Calculation
  const result = useMemo(() => {
    return calculateSIP(safeMonthly, safeYears, safeReturn);
  }, [safeMonthly, safeYears, safeReturn]);

  const yearlyData = useMemo(() => {
    return calculateYearlyBreakdown(safeMonthly, safeYears, safeReturn);
  }, [safeMonthly, safeYears, safeReturn]);

  // Reset Callback
  const handleReset = () => {
    setMonthlyInvestment(DEFAULT_MONTHLY);
    setYears(DEFAULT_YEARS);
    setAnnualReturn(DEFAULT_RETURN);
  };

  return (
    <div className="sip-calculator-root">
      {/* Two Column Layout on Desktop */}
      <div className="sip-calculator-main-grid">
        {/* Left Column: Input Form Card */}
        <SIPInputs
          monthlyInvestment={monthlyInvestment}
          setMonthlyInvestment={setMonthlyInvestment}
          years={years}
          setYears={setYears}
          annualReturn={annualReturn}
          setAnnualReturn={setAnnualReturn}
          errors={errors}
          onReset={handleReset}
        />

        {/* Right Column: Key Results & Save Button */}
        <div>
          <SIPResults
            investedAmount={result.totalInvested}
            estimatedReturns={result.estimatedReturns}
            totalValue={result.futureValue}
          />

          {/* Save Calculation Component */}
          <SaveCalculationModal
            calculatorType="SIP"
            inputData={{ monthlyInvestment: safeMonthly, years: safeYears, annualReturn: safeReturn }}
            resultData={result}
          />
        </div>
      </div>

      {/* Full Width Visual Components */}
      <SIPGrowthChart yearlyData={yearlyData} totalValue={result.futureValue} />
      <SIPYearlyBreakdown yearlyData={yearlyData} />
      <SIPEducation />
      <SIPDisclaimer />
    </div>
  );
}
