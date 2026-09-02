'use client';

export default function EMIInputs({
  loanType,
  setLoanType,
  loanAmount,
  setLoanAmount,
  interestRate,
  setInterestRate,
  tenureValue,
  setTenureValue,
  tenureUnit,
  setTenureUnit,
  onReset,
  errors,
}) {
  const loanTypes = [
    { id: 'home', label: 'Home Loan' },
    { id: 'personal', label: 'Personal Loan' },
    { id: 'car', label: 'Car Loan' },
    { id: 'education', label: 'Education Loan' },
  ];

  const handleAmountChange = (val) => {
    const num = Number(val);
    setLoanAmount(isNaN(num) ? '' : num);
  };

  const handleRateChange = (val) => {
    const num = Number(val);
    setInterestRate(isNaN(num) ? '' : num);
  };

  const handleTenureChange = (val) => {
    const num = Number(val);
    setTenureValue(isNaN(num) ? '' : num);
  };

  const maxTenure = tenureUnit === 'years' ? 30 : 360;
  const minTenure = tenureUnit === 'years' ? 1 : 12;
  const stepTenure = tenureUnit === 'years' ? 1 : 6;

  return (
    <div className="glass-card-static sip-inputs-card">
      {/* Loan Type Selector */}
      <div style={{ marginBottom: '1.5rem' }}>
        <span className="sip-field-label" style={{ display: 'block', marginBottom: '0.6rem' }}>
          Select Loan Type
        </span>
        <div className="emi-type-selector">
          {loanTypes.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`emi-type-btn ${loanType === t.id ? 'active' : ''}`}
              onClick={() => setLoanType(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="sip-inputs-header">
        <h3 className="sip-inputs-title">Loan Parameters</h3>
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

      {/* Input A: Loan Amount */}
      <div className="sip-field-group">
        <div className="sip-label-row">
          <label htmlFor="loan-amount-input" className="sip-field-label">
            Loan Amount
          </label>
          <div className="sip-input-badge">
            <span className="currency-prefix">₹</span>
            <input
              id="loan-amount-input"
              type="number"
              min={50000}
              max={20000000}
              step={10000}
              value={loanAmount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="sip-number-input"
              style={{ width: '120px' }}
              aria-label="Loan Amount in Rupees"
            />
          </div>
        </div>

        <input
          type="range"
          min={50000}
          max={20000000}
          step={10000}
          value={loanAmount || 50000}
          onChange={(e) => handleAmountChange(e.target.value)}
          className="sip-slider"
          aria-label="Loan Amount Slider"
        />
        <div className="sip-slider-ticks">
          <span>₹50K</span>
          <span>₹1 Cr</span>
          <span>₹2 Cr</span>
        </div>
        {errors.amount && <p className="sip-error-msg">{errors.amount}</p>}
      </div>

      {/* Input B: Interest Rate */}
      <div className="sip-field-group">
        <div className="sip-label-row">
          <label htmlFor="interest-rate-input" className="sip-field-label">
            Interest Rate (p.a.)
          </label>
          <div className="sip-input-badge">
            <input
              id="interest-rate-input"
              type="number"
              min={1}
              max={25}
              step={0.1}
              value={interestRate}
              onChange={(e) => handleRateChange(e.target.value)}
              className="sip-number-input"
              style={{ width: '60px' }}
              aria-label="Annual Interest Rate Percentage"
            />
            <span className="unit-suffix">%</span>
          </div>
        </div>

        <input
          type="range"
          min={1}
          max={25}
          step={0.1}
          value={interestRate || 1}
          onChange={(e) => handleRateChange(e.target.value)}
          className="sip-slider"
          aria-label="Interest Rate Slider"
        />
        <div className="sip-slider-ticks">
          <span>1%</span>
          <span>12.5%</span>
          <span>25%</span>
        </div>
        {errors.rate && <p className="sip-error-msg">{errors.rate}</p>}
      </div>

      {/* Input C: Loan Tenure (with Years/Months Toggle) */}
      <div className="sip-field-group">
        <div className="sip-label-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label htmlFor="loan-tenure-input" className="sip-field-label">
              Loan Tenure
            </label>
            <div className="tenure-unit-toggle">
              <button
                type="button"
                className={`tenure-toggle-btn ${tenureUnit === 'years' ? 'active' : ''}`}
                onClick={() => {
                  if (tenureUnit !== 'years') {
                    setTenureUnit('years');
                    setTenureValue(Math.max(1, Math.round((tenureValue || 12) / 12)));
                  }
                }}
              >
                Years
              </button>
              <button
                type="button"
                className={`tenure-toggle-btn ${tenureUnit === 'months' ? 'active' : ''}`}
                onClick={() => {
                  if (tenureUnit !== 'months') {
                    setTenureUnit('months');
                    setTenureValue(Math.max(12, (tenureValue || 1) * 12));
                  }
                }}
              >
                Months
              </button>
            </div>
          </div>

          <div className="sip-input-badge">
            <input
              id="loan-tenure-input"
              type="number"
              min={minTenure}
              max={maxTenure}
              step={stepTenure}
              value={tenureValue}
              onChange={(e) => handleTenureChange(e.target.value)}
              className="sip-number-input"
              style={{ width: '60px' }}
              aria-label="Loan Tenure"
            />
            <span className="unit-suffix">
              {tenureUnit === 'years' ? `Yr${tenureValue > 1 ? 's' : ''}` : 'Mo'}
            </span>
          </div>
        </div>

        <input
          type="range"
          min={minTenure}
          max={maxTenure}
          step={stepTenure}
          value={tenureValue || minTenure}
          onChange={(e) => handleTenureChange(e.target.value)}
          className="sip-slider"
          aria-label="Loan Tenure Slider"
        />
        <div className="sip-slider-ticks">
          <span>{minTenure} {tenureUnit === 'years' ? 'Yr' : 'Mo'}</span>
          <span>{Math.round(maxTenure / 2)} {tenureUnit === 'years' ? 'Yrs' : 'Mo'}</span>
          <span>{maxTenure} {tenureUnit === 'years' ? 'Yrs' : 'Mo'}</span>
        </div>
        {errors.tenure && <p className="sip-error-msg">{errors.tenure}</p>}
      </div>
    </div>
  );
}
