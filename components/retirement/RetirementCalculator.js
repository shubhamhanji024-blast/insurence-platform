'use client';
import { useState, useMemo, useEffect } from 'react';
import RetirementInputs from './RetirementInputs';
import RetirementReadiness from './RetirementReadiness';
import RetirementResults from './RetirementResults';
import RetirementGrowthChart from './RetirementGrowthChart';
import RetirementIncomeChart from './RetirementIncomeChart';
import RetirementSummary from './RetirementSummary';
import RetirementScenarios from './RetirementScenarios';
import RetirementYearlyProjection from './RetirementYearlyProjection';
import RetirementEducation from './RetirementEducation';
import RetirementDisclaimer from './RetirementDisclaimer';
import SaveCalculationModal from '@/components/SaveCalculationModal';
import {
  calculateRetirementPlan,
  calculatePreRetirementSchedule,
  calculatePostRetirementSchedule,
} from '@/utils/retirementCalculations';

export default function RetirementCalculator() {
  // Default values
  const DEFAULTS = {
    currentAge: 30,
    retirementAge: 60,
    lifeExpectancy: 85,
    currentExpenses: 50000,
    inflationRate: 6,
    currentSavings: 500000,
    monthlyInvestment: 20000,
    preReturn: 12,
    postReturn: 7,
  };

  const [currentAge, setCurrentAge] = useState(DEFAULTS.currentAge);
  const [retirementAge, setRetirementAge] = useState(DEFAULTS.retirementAge);
  const [lifeExpectancy, setLifeExpectancy] = useState(DEFAULTS.lifeExpectancy);
  const [currentExpenses, setCurrentExpenses] = useState(DEFAULTS.currentExpenses);
  const [inflationRate, setInflationRate] = useState(DEFAULTS.inflationRate);
  const [currentSavings, setCurrentSavings] = useState(DEFAULTS.currentSavings);
  const [monthlyInvestment, setMonthlyInvestment] = useState(DEFAULTS.monthlyInvestment);
  const [preReturn, setPreReturn] = useState(DEFAULTS.preReturn);
  const [postReturn, setPostReturn] = useState(DEFAULTS.postReturn);

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
          if (inputs.currentAge) setCurrentAge(Number(inputs.currentAge));
          if (inputs.retirementAge) setRetirementAge(Number(inputs.retirementAge));
          if (inputs.lifeExpectancy) setLifeExpectancy(Number(inputs.lifeExpectancy));
          if (inputs.currentExpenses) setCurrentExpenses(Number(inputs.currentExpenses));
          if (inputs.inflationRate) setInflationRate(Number(inputs.inflationRate));
          if (inputs.currentSavings) setCurrentSavings(Number(inputs.currentSavings));
          if (inputs.monthlyInvestment) setMonthlyInvestment(Number(inputs.monthlyInvestment));
          if (inputs.preReturn) setPreReturn(Number(inputs.preReturn));
          if (inputs.postReturn) setPostReturn(Number(inputs.postReturn));
        }
      } catch (err) {
        console.error('[Load Saved Retirement Calculation Error]:', err);
      }
    }
    loadSavedCalculation();
  }, []);

  // Validation
  const errors = useMemo(() => {
    const errs = {};
    const cAge = Number(currentAge) || 0;
    const rAge = Number(retirementAge) || 0;
    const lAge = Number(lifeExpectancy) || 0;

    if (cAge < 18 || cAge > 70) {
      errs.currentAge = 'Current age must be between 18 and 70.';
    }
    if (rAge <= cAge) {
      errs.retirementAge = 'Retirement age must be greater than current age.';
    } else if (rAge > 80) {
      errs.retirementAge = 'Retirement age cannot exceed 80.';
    }
    if (lAge <= rAge) {
      errs.lifeExpectancy = 'Life expectancy must be greater than retirement age.';
    } else if (lAge > 100) {
      errs.lifeExpectancy = 'Life expectancy cannot exceed 100.';
    }
    if (currentExpenses !== '' && (currentExpenses < 5000 || currentExpenses > 10000000)) {
      errs.currentExpenses = 'Monthly expenses must be between ₹5,000 and ₹1,00,00,000.';
    }
    if (inflationRate !== '' && (inflationRate < 1 || inflationRate > 15)) {
      errs.inflationRate = 'Inflation rate must be between 1% and 15%.';
    }
    if (preReturn !== '' && (preReturn < 1 || preReturn > 25)) {
      errs.preReturn = 'Pre-retirement return must be between 1% and 25%.';
    }
    if (postReturn !== '' && (postReturn < 1 || postReturn > 15)) {
      errs.postReturn = 'Post-retirement return must be between 1% and 15%.';
    }
    return errs;
  }, [
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentExpenses,
    inflationRate,
    preReturn,
    postReturn,
  ]);

  // Safe Input Payload
  const safeInputs = useMemo(() => {
    const cAge = Math.max(18, Math.min(70, Number(currentAge) || 30));
    const rAge = Math.max(cAge + 1, Math.min(80, Number(retirementAge) || 60));
    const lAge = Math.max(rAge + 1, Math.min(100, Number(lifeExpectancy) || 85));

    return {
      currentAge: cAge,
      retirementAge: rAge,
      lifeExpectancy: lAge,
      currentExpenses: Math.max(5000, Math.min(10000000, Number(currentExpenses) || 50000)),
      inflationRate: Math.max(1, Math.min(15, Number(inflationRate) || 6)),
      currentSavings: Math.max(0, Number(currentSavings) || 0),
      monthlyInvestment: Math.max(0, Number(monthlyInvestment) || 0),
      preReturn: Math.max(1, Math.min(25, Number(preReturn) || 12)),
      postReturn: Math.max(1, Math.min(15, Number(postReturn) || 7)),
    };
  }, [
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentExpenses,
    inflationRate,
    currentSavings,
    monthlyInvestment,
    preReturn,
    postReturn,
  ]);

  // Core Math Calculation
  const planResult = useMemo(() => {
    return calculateRetirementPlan(safeInputs);
  }, [safeInputs]);

  // Year-by-Year Schedules
  const preSchedule = useMemo(() => {
    return calculatePreRetirementSchedule(safeInputs);
  }, [safeInputs]);

  const postSchedule = useMemo(() => {
    return calculatePostRetirementSchedule(safeInputs, planResult.targetCorpus);
  }, [safeInputs, planResult.targetCorpus]);

  // Handlers
  const handleReset = () => {
    setCurrentAge(DEFAULTS.currentAge);
    setRetirementAge(DEFAULTS.retirementAge);
    setLifeExpectancy(DEFAULTS.lifeExpectancy);
    setCurrentExpenses(DEFAULTS.currentExpenses);
    setInflationRate(DEFAULTS.inflationRate);
    setCurrentSavings(DEFAULTS.currentSavings);
    setMonthlyInvestment(DEFAULTS.monthlyInvestment);
    setPreReturn(DEFAULTS.preReturn);
    setPostReturn(DEFAULTS.postReturn);
  };

  const handleApplyScenario = (preset) => {
    if (preset.monthlyInvestment !== undefined) setMonthlyInvestment(preset.monthlyInvestment);
    if (preset.retirementAge !== undefined) setRetirementAge(preset.retirementAge);
    if (preset.inflationRate !== undefined) setInflationRate(preset.inflationRate);
    if (preset.preReturn !== undefined) setPreReturn(preset.preReturn);
  };

  return (
    <div className="sip-calculator-root">
      {/* Dynamic Readiness Banner */}
      <RetirementReadiness
        readinessPct={planResult.readinessPct}
        isFullyFunded={planResult.isFullyFunded}
        surplusDeficit={planResult.surplusDeficit}
        additionalMonthlySIP={planResult.additionalMonthlySIP}
        yearsToRetire={planResult.yearsToRetire}
      />

      {/* Main Grid: Inputs vs Results */}
      <div className="sip-calculator-main-grid">
        {/* Left Column: Form Inputs */}
        <RetirementInputs
          currentAge={currentAge}
          setCurrentAge={setCurrentAge}
          retirementAge={retirementAge}
          setRetirementAge={setRetirementAge}
          lifeExpectancy={lifeExpectancy}
          setLifeExpectancy={setLifeExpectancy}
          currentExpenses={currentExpenses}
          setCurrentExpenses={setCurrentExpenses}
          inflationRate={inflationRate}
          setInflationRate={setInflationRate}
          currentSavings={currentSavings}
          setCurrentSavings={setCurrentSavings}
          monthlyInvestment={monthlyInvestment}
          setMonthlyInvestment={setMonthlyInvestment}
          preReturn={preReturn}
          setPreReturn={setPreReturn}
          postReturn={postReturn}
          setPostReturn={setPostReturn}
          errors={errors}
          onReset={handleReset}
        />

        {/* Right Column: Key Results & Save Button */}
        <div>
          <RetirementResults
            targetCorpus={planResult.targetCorpus}
            projectedSavings={planResult.totalSavingsAtRetirement}
            monthlyExpenseAtRetirement={planResult.monthlyExpenseAtRetirement}
            additionalMonthlySIP={planResult.additionalMonthlySIP}
            surplusDeficit={planResult.surplusDeficit}
            isFullyFunded={planResult.isFullyFunded}
          />

          <SaveCalculationModal
            calculatorType="RETIREMENT"
            inputData={safeInputs}
            resultData={planResult}
          />
        </div>
      </div>

      {/* Structured Executive Summary Cards */}
      <RetirementSummary
        targetCorpus={planResult.targetCorpus}
        projectedSavings={planResult.totalSavingsAtRetirement}
        yearsToRetire={planResult.yearsToRetire}
        retirementYears={planResult.retirementYears}
        monthlyExpenseAtRetirement={planResult.monthlyExpenseAtRetirement}
        additionalMonthlySIP={planResult.additionalMonthlySIP}
        isFullyFunded={planResult.isFullyFunded}
      />

      {/* Charts */}
      <RetirementGrowthChart
        schedule={preSchedule}
        targetCorpus={planResult.targetCorpus}
      />

      <RetirementIncomeChart schedule={postSchedule} />

      {/* Preset Scenario Cards */}
      <RetirementScenarios
        inputs={safeInputs}
        planResult={planResult}
        onApplyPreset={handleApplyScenario}
      />

      {/* Year-by-Year Schedule Table */}
      <RetirementYearlyProjection
        preSchedule={preSchedule}
        postSchedule={postSchedule}
      />

      <RetirementEducation />
      <RetirementDisclaimer />
    </div>
  );
}
