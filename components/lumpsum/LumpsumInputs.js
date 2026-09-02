'use client';

export default function LumpsumInputs({
  initialInvestment,
  setInitialInvestment,
  years,
  setYears,
  annualReturn,
  setAnnualReturn,
  onReset,
  errors,
}) {
  const handleAmountChange = (val) => {
    const num = Number(val);
    setInitialInvestment(isNaN(num) ? '' : num);
  };

  const handleYearsChange = (val) => {
    const num = Number(val);
    setYears(isNaN(num) ? '' : num);
  };

  const handleReturnChange = (val) => {
    const num = Number(val);
    setAnnualReturn(isNaN(num) ? '' : num);
  };

  return (
    <div className="glass-card-static sip-inputs-card">
      <div className="sip-inputs-header">
        <h3 className="sip-inputs-title">Investment Parameters</h3>
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

      {/* Input A: Initial Investment */}
      <div className="sip-field-group">
        <div className="sip-label-row">
          <label htmlFor="lumpsum-amount-input" className="sip-field-label">
            Initial Investment
          </label>
          <div className="sip-input-badge">
            <span className="currency-prefix">₹</span>
            <input
              id="lumpsum-amount-input"
              type="number"
              min={1000}
              max={100000000}
              step={1000}
              value={initialInvestment}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="sip-number-input"
              style={{ width: '120px' }}
              aria-label="Initial Investment Amount in Rupees"
            />
          </div>
        </div>

        <input
          type="range"
          min={1000}
          max={10000000}
          step={1000}
          value={initialInvestment || 1000}
          onChange={(e) => handleAmountChange(e.target.value)}
          className="sip-slider"
          aria-label="Initial Investment Slider"
        />
        <div className="sip-slider-ticks">
          <span>₹1,000</span>
          <span>₹50,00,000</span>
          <span>₹1 Cr+</span>
        </div>
        {errors.amount && <p className="sip-error-msg">{errors.amount}</p>}
      </div>

      {/* Input B: Investment Duration */}
      <div className="sip-field-group">
        <div className="sip-label-row">
          <label htmlFor="lumpsum-duration-input" className="sip-field-label">
            Investment Duration
          </label>
          <div className="sip-input-badge">
            <input
              id="lumpsum-duration-input"
              type="number"
              min={1}
              max={50}
              step={1}
              value={years}
              onChange={(e) => handleYearsChange(e.target.value)}
              className="sip-number-input"
              style={{ width: '60px' }}
              aria-label="Investment Duration in Years"
            />
            <span className="unit-suffix">Yr{years > 1 ? 's' : ''}</span>
          </div>
        </div>

        <input
          type="range"
          min={1}
          max={50}
          step={1}
          value={years || 1}
          onChange={(e) => handleYearsChange(e.target.value)}
          className="sip-slider"
          aria-label="Investment Duration Slider"
        />
        <div className="sip-slider-ticks">
          <span>1 Yr</span>
          <span>25 Yrs</span>
          <span>50 Yrs</span>
        </div>
        {errors.years && <p className="sip-error-msg">{errors.years}</p>}
      </div>

      {/* Input C: Expected Annual Return */}
      <div className="sip-field-group">
        <div className="sip-label-row">
          <label htmlFor="lumpsum-return-input" className="sip-field-label">
            Expected Annual Return
          </label>
          <div className="sip-input-badge">
            <input
              id="lumpsum-return-input"
              type="number"
              min={0}
              max={30}
              step={0.5}
              value={annualReturn}
              onChange={(e) => handleReturnChange(e.target.value)}
              className="sip-number-input"
              style={{ width: '60px' }}
              aria-label="Expected Annual Return Percentage"
            />
            <span className="unit-suffix">%</span>
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={30}
          step={0.5}
          value={annualReturn !== '' ? annualReturn : 0}
          onChange={(e) => handleReturnChange(e.target.value)}
          className="sip-slider"
          aria-label="Expected Annual Return Slider"
        />
        <div className="sip-slider-ticks">
          <span>0%</span>
          <span>15%</span>
          <span>30%</span>
        </div>
        {errors.annualReturn && <p className="sip-error-msg">{errors.annualReturn}</p>}
      </div>
    </div>
  );
}
