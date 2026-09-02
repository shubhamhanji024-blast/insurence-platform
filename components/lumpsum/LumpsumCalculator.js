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

export default function LumpsumCalculator() {
  // Default values
  const DEFAULT_AMOUNT = 100000;
  const DEFAULT_YEARS = 10;
  const DEFAULT_RETURN = 12;

  const [initialInvestment, setInitialInvestment] = useState(DEFAULT_AMOUNT);
  const [years, setYears] = useState(DEFAULT_YEARS);
  const [annualReturn, setAnnualReturn] = useState(DEFAULT_RETURN);

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
    if (initialInvestment !== '' && (initialInvestment < 1000 || initialInvestment > 100000000)) {
      errs.amount = 'Initial investment must be between ₹1,000 and ₹10,00,00,000.';
    }
    if (years !== '' && (years < 1 || years > 50)) {
      errs.years = 'Investment duration must be between 1 and 50 years.';
    }
    if (annualReturn !== '' && (annualReturn < 0 || annualReturn > 30)) {
      errs.annualReturn = 'Expected annual return must be between 0% and 30%.';
    }
    return errs;
  }, [initialInvestment, years, annualReturn]);

  // Safe Values for Calculation
  const safeAmount = Math.max(1000, Math.min(100000000, Number(initialInvestment) || 1000));
  const safeYears = Math.max(1, Math.min(50, Number(years) || 1));
  const safeReturn = Math.max(0, Math.min(30, Number(annualReturn) || 0));

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
            totalReturns={result.totalReturns}
            totalValue={result.totalValue}
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
      <LumpsumGrowthChart yearlyData={yearlyData} totalValue={result.totalValue} />
      <LumpsumYearlyBreakdown yearlyData={yearlyData} />
      <LumpsumEducation />
      <LumpsumDisclaimer />
    </div>
  );
}
