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
import { trackCalculatorUsage } from '@/utils/trackCalculator';

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

  // Track calculator usage once on load
  useEffect(() => {
    trackCalculatorUsage('RETIREMENT');
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

    if (currentAge !== '') {
      if (cAge < 0) {
        errs.currentAge = 'Age cannot be negative.';
      } else if (cAge < 18 || cAge > 75) {
        errs.currentAge = 'Current age must be between 18 and 75.';
      }
    }
    if (retirementAge !== '') {
      if (rAge <= cAge) {
        errs.retirementAge = 'Retirement age must be greater than current age.';
      } else if (rAge > 85) {
        errs.retirementAge = 'Retirement age cannot exceed 85.';
      }
    }
    if (lifeExpectancy !== '') {
      if (lAge <= rAge) {
        errs.lifeExpectancy = 'Life expectancy must be greater than retirement age.';
      } else if (lAge > 100) {
        errs.lifeExpectancy = 'Life expectancy cannot exceed 100.';
      }
    }
    if (currentExpenses !== '') {
      if (Number(currentExpenses) < 0) {
        errs.currentExpenses = 'Monthly expenses cannot be negative.';
      } else if (Number(currentExpenses) > 100000000) {
        errs.currentExpenses = 'Monthly expenses cannot exceed ₹10,00,00,000.';
      }
    }
    if (currentSavings !== '') {
      if (Number(currentSavings) < 0) {
        errs.savings = 'Current savings cannot be negative.';
      }
    }
    if (monthlyInvestment !== '') {
      if (Number(monthlyInvestment) < 0) {
        errs.monthly = 'Monthly savings cannot be negative.';
      }
    }
    if (inflationRate !== '') {
      if (Number(inflationRate) < 0 || Number(inflationRate) > 20) {
        errs.inflationRate = 'Inflation rate must be between 0% and 20%.';
      }
    }
    if (preReturn !== '') {
      if (Number(preReturn) < 0 || Number(preReturn) > 30) {
        errs.preReturn = 'Pre-retirement return must be between 0% and 30%.';
      }
    }
    if (postReturn !== '') {
      if (Number(postReturn) < 0 || Number(postReturn) > 25) {
        errs.postReturn = 'Post-retirement return must be between 0% and 25%.';
      }
    }
    return errs;
  }, [
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentExpenses,
    currentSavings,
    monthlyInvestment,
    inflationRate,
    preReturn,
    postReturn,
  ]);

  // Safe Input Payload for Real-time Calculation
  const safeInputs = useMemo(() => {
    const rawC = Number(currentAge) || 30;
    const rawR = Number(retirementAge) || 60;
    const rawL = Number(lifeExpectancy) || 85;

    const cAge = Math.max(18, Math.min(75, rawC));
    const rAge = Math.max(cAge + 1, Math.min(85, rawR > cAge ? rawR : cAge + 1));
    const lAge = Math.max(rAge + 1, Math.min(100, rawL > rAge ? rawL : rAge + 1));

    return {
      currentAge: cAge,
      retirementAge: rAge,
      lifeExpectancy: lAge,
      currentExpenses: currentExpenses === '' ? 0 : Math.max(0, Number(currentExpenses) || 0),
      inflationRate: inflationRate === '' ? 0 : Math.max(0, Math.min(20, Number(inflationRate) || 0)),
      currentSavings: currentSavings === '' ? 0 : Math.max(0, Number(currentSavings) || 0),
      monthlyInvestment: monthlyInvestment === '' ? 0 : Math.max(0, Number(monthlyInvestment) || 0),
      preReturn: preReturn === '' ? 0 : Math.max(0, Math.min(30, Number(preReturn) || 0)),
      postReturn: postReturn === '' ? 0 : Math.max(0, Math.min(25, Number(postReturn) || 0)),
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
    return calculatePostRetirementSchedule({
      ...safeInputs,
      projectedSavings: planResult.projectedSavings,
      futureMonthlyExpenses: planResult.futureMonthlyExpenses,
    });
  }, [safeInputs, planResult.projectedSavings, planResult.futureMonthlyExpenses]);

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
        plan={planResult}
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
            plan={planResult}
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
        plan={planResult}
        inputs={safeInputs}
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
