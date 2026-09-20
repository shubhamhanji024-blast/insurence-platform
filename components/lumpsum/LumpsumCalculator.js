'use client';
import { useState, useMemo, useEffect } from 'react';
import LumpsumInputs from './LumpsumInputs';
import LumpsumScenarios from './LumpsumScenarios';
import LumpsumResults from './LumpsumResults';
import LumpsumGrowthChart from './LumpsumGrowthChart';
import LumpsumYearlyBreakdown from './LumpsumYearlyBreakdown';
import LumpsumEducation from './LumpsumEducation';
import LumpsumDisclaimer from './LumpsumDisclaimer';
import SaveCalculationModal from '@/components/SaveCalculationModal';
import {
  calculateLumpsum,
  calculateLumpsumYearlyBreakdown,
} from '@/utils/lumpsumCalculations';
import { trackCalculatorUsage } from '@/utils/trackCalculator';

export default function LumpsumCalculator() {
  // Default values
  const DEFAULT_AMOUNT = 100000;
  const DEFAULT_YEARS = 10;
  const DEFAULT_RETURN = 12;

  const [initialInvestment, setInitialInvestment] = useState(DEFAULT_AMOUNT);
  const [years, setYears] = useState(DEFAULT_YEARS);
  const [annualReturn, setAnnualReturn] = useState(DEFAULT_RETURN);

  // Track calculator usage once on load
  useEffect(() => {
    trackCalculatorUsage('LUMPSUM');
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
          if (inputs.initialInvestment) setInitialInvestment(Number(inputs.initialInvestment));
          if (inputs.years) setYears(Number(inputs.years));
          if (inputs.annualReturn) setAnnualReturn(Number(inputs.annualReturn));
        }
      } catch (err) {
        console.error('[Load Saved Lumpsum Calculation Error]:', err);
      }
    }
    loadSavedCalculation();
  }, []);

  // Input Validation
  const errors = useMemo(() => {
    const errs = {};
    if (initialInvestment !== '') {
      if (Number(initialInvestment) < 0) {
        errs.amount = 'Initial investment cannot be negative.';
      } else if (Number(initialInvestment) > 100000000) {
        errs.amount = 'Initial investment cannot exceed ₹10,00,00,000.';
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
  }, [initialInvestment, years, annualReturn]);

  // Safe Values for Real-time Calculation
  const safeAmount = initialInvestment === '' ? 0 : Math.max(0, Number(initialInvestment) || 0);
  const safeYears = Math.max(0, Math.min(50, Number(years) || 0));
  const safeReturn = Math.max(0, Math.min(50, Number(annualReturn) || 0));

  // Dynamic Calculation
  const result = useMemo(() => {
    return calculateLumpsum(safeAmount, safeYears, safeReturn);
  }, [safeAmount, safeYears, safeReturn]);

  const yearlyData = useMemo(() => {
    return calculateLumpsumYearlyBreakdown(safeAmount, safeYears, safeReturn);
  }, [safeAmount, safeYears, safeReturn]);

  // Scenario selection handler
  const handleSelectScenarioReturn = (rate) => {
    setAnnualReturn(rate);
  };

  // Reset Callback
  const handleReset = () => {
    setInitialInvestment(DEFAULT_AMOUNT);
    setYears(DEFAULT_YEARS);
    setAnnualReturn(DEFAULT_RETURN);
  };

  return (
    <div className="sip-calculator-root">
      {/* Two Column Layout on Desktop */}
      <div className="sip-calculator-main-grid">
        {/* Left Column: Input Form Card */}
        <LumpsumInputs
          initialInvestment={initialInvestment}
          setInitialInvestment={setInitialInvestment}
          years={years}
          setYears={setYears}
          annualReturn={annualReturn}
          setAnnualReturn={setAnnualReturn}
          errors={errors}
          onReset={handleReset}
        />

        {/* Right Column: Key Results & Save Button */}
        <div>
          <LumpsumResults
            initialInvestment={result.initialInvestment}
            totalReturns={result.estimatedReturns}
            totalValue={result.futureValue}
          />

          <SaveCalculationModal
            calculatorType="LUMPSUM"
            inputData={{
              initialInvestment: safeAmount,
              years: safeYears,
              annualReturn: safeReturn,
            }}
            resultData={result}
          />
        </div>
      </div>

      {/* Quick Scenario Preset Chips */}
      <LumpsumScenarios
        currentReturn={safeReturn}
        onSelectReturn={handleSelectScenarioReturn}
      />

      {/* Full Width Visual Components */}
      <LumpsumGrowthChart yearlyData={yearlyData} totalValue={result.futureValue} />
      <LumpsumYearlyBreakdown yearlyData={yearlyData} />
      <LumpsumEducation />
      <LumpsumDisclaimer />
    </div>
  );
}
