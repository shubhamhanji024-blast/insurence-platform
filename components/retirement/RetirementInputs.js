'use client';

export default function RetirementInputs({
  currentAge,
  setCurrentAge,
  retirementAge,
  setRetirementAge,
  lifeExpectancy,
  setLifeExpectancy,
  currentExpenses,
  setCurrentExpenses,
  inflationRate,
  setInflationRate,
  currentSavings,
  setCurrentSavings,
  monthlyInvestment,
  setMonthlyInvestment,
  preReturn,
  setPreReturn,
  postReturn,
  setPostReturn,
  onReset,
  errors,
}) {
  const handleNumChange = (setter, val) => {
    const num = Number(val);
    setter(isNaN(num) ? '' : num);
  };

  return (
    <div className="glass-card-static sip-inputs-card">
      <div className="sip-inputs-header">
        <h3 className="sip-inputs-title">Retirement Planning Parameters</h3>
        <button
          type="button"
          onClick={onReset}
          className="sip-reset-btn"
          title="Reset to default values"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          Reset Calculator
        </button>
      </div>

      {/* Input 1: Current Age & Retirement Age */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Current Age */}
        <div>
          <div className="sip-label-row">
            <label htmlFor="current-age-input" className="sip-field-label">Current Age</label>
            <div className="sip-input-badge">
              <input
                id="current-age-input"
                type="number"
                min={18}
                max={70}
                value={currentAge}
                onChange={(e) => handleNumChange(setCurrentAge, e.target.value)}
                className="sip-number-input"
                style={{ width: '50px' }}
              />
              <span className="unit-suffix">Yrs</span>
            </div>
          </div>
          <input
            type="range"
            min={18}
            max={70}
            value={currentAge || 18}
            onChange={(e) => handleNumChange(setCurrentAge, e.target.value)}
            className="sip-slider"
          />
          {errors.currentAge && <p className="sip-error-msg">{errors.currentAge}</p>}
        </div>

        {/* Retirement Age */}
        <div>
          <div className="sip-label-row">
            <label htmlFor="retirement-age-input" className="sip-field-label">Retirement Age</label>
            <div className="sip-input-badge">
              <input
                id="retirement-age-input"
                type="number"
                min={(Number(currentAge) || 18) + 1}
                max={80}
                value={retirementAge}
                onChange={(e) => handleNumChange(setRetirementAge, e.target.value)}
                className="sip-number-input"
                style={{ width: '50px' }}
              />
              <span className="unit-suffix">Yrs</span>
            </div>
          </div>
          <input
            type="range"
            min={(Number(currentAge) || 18) + 1}
            max={80}
            value={retirementAge || (Number(currentAge) || 18) + 1}
            onChange={(e) => handleNumChange(setRetirementAge, e.target.value)}
            className="sip-slider"
          />
          {errors.retirementAge && <p className="sip-error-msg">{errors.retirementAge}</p>}
        </div>
      </div>

      {/* Input 2: Life Expectancy & Expected Inflation Rate */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Life Expectancy */}
        <div>
          <div className="sip-label-row">
            <label htmlFor="life-expectancy-input" className="sip-field-label">Expected Life Age</label>
            <div className="sip-input-badge">
              <input
                id="life-expectancy-input"
                type="number"
                min={(Number(retirementAge) || 60) + 1}
                max={100}
                value={lifeExpectancy}
                onChange={(e) => handleNumChange(setLifeExpectancy, e.target.value)}
                className="sip-number-input"
                style={{ width: '50px' }}
              />
              <span className="unit-suffix">Yrs</span>
            </div>
          </div>
          <input
            type="range"
            min={(Number(retirementAge) || 60) + 1}
            max={100}
            value={lifeExpectancy || (Number(retirementAge) || 60) + 1}
            onChange={(e) => handleNumChange(setLifeExpectancy, e.target.value)}
            className="sip-slider"
          />
          {errors.lifeExpectancy && <p className="sip-error-msg">{errors.lifeExpectancy}</p>}
        </div>

        {/* Expected Inflation Rate */}
        <div>
          <div className="sip-label-row">
            <label htmlFor="inflation-rate-input" className="sip-field-label">Expected Inflation</label>
            <div className="sip-input-badge">
              <input
                id="inflation-rate-input"
                type="number"
                min={0}
                max={15}
                step={0.5}
                value={inflationRate}
                onChange={(e) => handleNumChange(setInflationRate, e.target.value)}
                className="sip-number-input"
                style={{ width: '50px' }}
              />
              <span className="unit-suffix">%</span>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={15}
            step={0.5}
            value={inflationRate || 0}
            onChange={(e) => handleNumChange(setInflationRate, e.target.value)}
            className="sip-slider"
          />
          {errors.inflationRate && <p className="sip-error-msg">{errors.inflationRate}</p>}
        </div>
      </div>

      {/* Input 3: Current Monthly Expenses */}
      <div className="sip-field-group">
        <div className="sip-label-row">
          <label htmlFor="current-expenses-input" className="sip-field-label">
            Current Monthly Expenses
          </label>
          <div className="sip-input-badge">
            <span className="currency-prefix">₹</span>
            <input
              id="current-expenses-input"
              type="number"
              min={5000}
              max={1000000}
              step={1000}
              value={currentExpenses}
              onChange={(e) => handleNumChange(setCurrentExpenses, e.target.value)}
              className="sip-number-input"
              style={{ width: '90px' }}
            />
          </div>
        </div>
        <input
          type="range"
          min={5000}
          max={1000000}
          step={1000}
          value={currentExpenses || 5000}
          onChange={(e) => handleNumChange(setCurrentExpenses, e.target.value)}
          className="sip-slider"
        />
        <div className="sip-slider-ticks">
          <span>₹5,000</span>
          <span>₹5,00,000</span>
          <span>₹10,00,000</span>
        </div>
        {errors.expenses && <p className="sip-error-msg">{errors.expenses}</p>}
      </div>

      {/* Input 4: Current Retirement Savings */}
      <div className="sip-field-group">
        <div className="sip-label-row">
          <label htmlFor="current-savings-input" className="sip-field-label">
            Current Retirement Savings
          </label>
          <div className="sip-input-badge">
            <span className="currency-prefix">₹</span>
            <input
              id="current-savings-input"
              type="number"
              min={0}
              max={100000000}
              step={10000}
              value={currentSavings}
              onChange={(e) => handleNumChange(setCurrentSavings, e.target.value)}
              className="sip-number-input"
              style={{ width: '110px' }}
            />
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={10000000}
          step={10000}
          value={currentSavings || 0}
          onChange={(e) => handleNumChange(setCurrentSavings, e.target.value)}
          className="sip-slider"
        />
        <div className="sip-slider-ticks">
          <span>₹0</span>
          <span>₹50,00,000</span>
          <span>₹1 Cr+</span>
        </div>
        {errors.savings && <p className="sip-error-msg">{errors.savings}</p>}
      </div>

      {/* Input 5: Monthly Investment for Retirement */}
      <div className="sip-field-group">
        <div className="sip-label-row">
          <label htmlFor="monthly-investment-input" className="sip-field-label">
            Monthly Investment for Retirement
          </label>
          <div className="sip-input-badge">
            <span className="currency-prefix">₹</span>
            <input
              id="monthly-investment-input"
              type="number"
              min={0}
              max={1000000}
              step={1000}
              value={monthlyInvestment}
              onChange={(e) => handleNumChange(setMonthlyInvestment, e.target.value)}
              className="sip-number-input"
              style={{ width: '90px' }}
            />
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={200000}
          step={1000}
          value={monthlyInvestment || 0}
          onChange={(e) => handleNumChange(setMonthlyInvestment, e.target.value)}
          className="sip-slider"
        />
        <div className="sip-slider-ticks">
          <span>₹0</span>
          <span>₹1,00,000</span>
          <span>₹2,00,000+</span>
        </div>
        {errors.monthly && <p className="sip-error-msg">{errors.monthly}</p>}
      </div>

      {/* Input 6: Returns Before & After Retirement */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Pre-Retirement Return */}
        <div>
          <div className="sip-label-row">
            <label htmlFor="pre-return-input" className="sip-field-label">Pre-Retire Return</label>
            <div className="sip-input-badge">
              <input
                id="pre-return-input"
                type="number"
                min={0}
                max={30}
                step={0.5}
                value={preReturn}
                onChange={(e) => handleNumChange(setPreReturn, e.target.value)}
                className="sip-number-input"
                style={{ width: '50px' }}
              />
              <span className="unit-suffix">%</span>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={30}
            step={0.5}
            value={preReturn || 0}
            onChange={(e) => handleNumChange(setPreReturn, e.target.value)}
            className="sip-slider"
          />
          {errors.preReturn && <p className="sip-error-msg">{errors.preReturn}</p>}
        </div>

        {/* Post-Retirement Return */}
        <div>
          <div className="sip-label-row">
            <label htmlFor="post-return-input" className="sip-field-label">Post-Retire Return</label>
            <div className="sip-input-badge">
              <input
                id="post-return-input"
                type="number"
                min={0}
                max={20}
                step={0.5}
                value={postReturn}
                onChange={(e) => handleNumChange(setPostReturn, e.target.value)}
                className="sip-number-input"
                style={{ width: '50px' }}
              />
              <span className="unit-suffix">%</span>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={20}
            step={0.5}
            value={postReturn || 0}
            onChange={(e) => handleNumChange(setPostReturn, e.target.value)}
            className="sip-slider"
          />
          {errors.postReturn && <p className="sip-error-msg">{errors.postReturn}</p>}
        </div>
      </div>
    </div>
  );
}
