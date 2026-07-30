'use client';
import { useState } from 'react';

export default function CareersPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', city: '',
    education: '', experience: '', currentJob: '',
    language: '', source: '', resume: null
  });

  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, resume: e.target.files[0] }));
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  const steps = [
    { num: 1, label: 'Personal', icon: '👤' },
    { num: 2, label: 'Experience', icon: '💼' },
    { num: 3, label: 'Preferences', icon: '⚙️' },
    { num: 4, label: 'Upload', icon: '📎' },
  ];

  if (isSuccess) {
    return (
      <section className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container text-center">
          <div className="success-confetti">🎉</div>
          <h2 className="animate-fade-in-up" style={{ marginBottom: '1rem' }}>
            Application Submitted <span className="text-gradient">Successfully!</span>
          </h2>
          <p className="animate-fade-in-up" style={{ maxWidth: '550px', margin: '0 auto 1.5rem', fontSize: '1.05rem' }}>
            Thank you, <strong>{formData.name}</strong>! Our recruitment team has received your details and will contact you within <strong>24–48 hours</strong>.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary animate-fade-in-up" onClick={() => window.location.href = '/'}>
              ← Back to Home
            </button>
            <button className="btn btn-secondary animate-fade-in-up" onClick={() => window.location.href = '/training'}>
              Explore Training →
            </button>
          </div>
        </div>
        <style jsx>{`
          .success-confetti {
            font-size: 5rem;
            margin-bottom: 1.5rem;
            display: inline-block;
            animation: float 2s ease-in-out infinite;
          }
        `}</style>
      </section>
    );
  }

  return (
    <section className="section careers-section">
      <div className="container">
        <div className="careers-split">
          {/* Left: Benefits Panel */}
          <div className="careers-benefits">
            <span className="label">Join Our Team</span>
            <h2 style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
              Start Your <span className="text-gradient">Insurance Career</span> Today
            </h2>
            <p style={{ marginBottom: '2rem' }}>
              No experience needed. Join 5,000+ advisors building financial freedom with GrowthNest.
            </p>

            {/* Income Calculator Mini */}
            <div className="income-calc-mini glass-card-static" style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                💡 Potential First-Year Earnings
              </div>
              <div className="income-range-bar">
                <div className="income-range-fill" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>₹60K/year</span>
                <span className="text-gradient" style={{ fontWeight: 700 }}>Avg ₹3.6L/year</span>
                <span style={{ color: 'var(--text-muted)' }}>₹38L+/year</span>
              </div>
            </div>

            {/* Benefits List */}
            <div className="benefits-list">
              {[
                { icon: '📚', title: 'Free Training', desc: 'World-class IRDAI exam prep & product knowledge at zero cost.' },
                { icon: '💰', title: 'Unlimited Earnings', desc: 'No income ceiling. Your effort directly maps to your rewards.' },
                { icon: '🏆', title: '20+ Partners', desc: 'Access India\'s top insurance companies through a single platform.' },
                { icon: '📱', title: 'Digital Tools', desc: 'CRM, lead tracker, income dashboard — all in one app.' },
                { icon: '🤝', title: 'Mentorship', desc: 'Dedicated mentor and weekly team meetings to keep you on track.' },
                { icon: '🎓', title: 'Certifications', desc: 'IRDAI-recognized certificates that boost your credibility.' },
              ].map((b, i) => (
                <div key={i} className="benefit-item">
                  <div className="benefit-icon">{b.icon}</div>
                  <div>
                    <h5 style={{ margin: 0, marginBottom: '2px' }}>{b.title}</h5>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust logos */}
            <div className="partner-logos-mini">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Sell products from:</span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['LIC', 'HDFC', 'ICICI', 'SBI', 'Tata AIA', 'Max'].map((p, i) => (
                  <span key={i} style={{ fontSize: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)', padding: '3px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Application Form */}
          <div className="careers-form-wrap">
            <div className="glass-card form-card">
              {/* Step indicator */}
              <div className="form-steps">
                {steps.map((s, i) => (
                  <div key={s.num} className="form-step-item">
                    <div className={`step-circle ${step > s.num ? 'done' : step === s.num ? 'current' : ''}`}>
                      {step > s.num ? '✓' : s.icon}
                    </div>
                    <span className={`step-lbl ${step >= s.num ? 'active-lbl' : ''}`}>{s.label}</span>
                    {i < steps.length - 1 && (
                      <div className="step-connector">
                        <div className="step-connector-fill" style={{ width: step > s.num ? '100%' : '0%' }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
                {/* Step 1 */}
                {step === 1 && (
                  <div className="form-step-content animate-fade-in">
                    <h3 style={{ marginBottom: '0.25rem' }}>Personal Information</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Tell us about yourself so we can tailor the onboarding.</p>
                    <div className="grid grid-2">
                      <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className={`form-input ${touched.name && formData.name ? 'input-valid' : ''}`} required placeholder="Your full name" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email Address *</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className={`form-input ${touched.email && formData.email ? 'input-valid' : ''}`} required placeholder="you@email.com" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone Number *</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`form-input ${touched.phone && formData.phone ? 'input-valid' : ''}`} required placeholder="10-digit mobile" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">City *</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} className={`form-input ${touched.city && formData.city ? 'input-valid' : ''}`} required placeholder="Your current city" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <div className="form-step-content animate-fade-in">
                    <h3 style={{ marginBottom: '0.25rem' }}>Education &amp; Experience</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Help us understand your background.</p>
                    <div className="grid grid-2">
                      <div className="form-group">
                        <label className="form-label">Highest Education *</label>
                        <select name="education" value={formData.education} onChange={handleChange} className="form-select" required>
                          <option value="">Select Education Level</option>
                          <option value="10th">10th Standard</option>
                          <option value="12th">12th Standard</option>
                          <option value="diploma">Diploma</option>
                          <option value="bachelors">Bachelor&apos;s Degree</option>
                          <option value="masters">Master&apos;s Degree or higher</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Work Experience *</label>
                        <select name="experience" value={formData.experience} onChange={handleChange} className="form-select" required>
                          <option value="">Select Experience</option>
                          <option value="none">No experience (Fresher)</option>
                          <option value="1-3">1 – 3 years</option>
                          <option value="3-5">3 – 5 years</option>
                          <option value="5-10">5 – 10 years</option>
                          <option value="10+">10+ years</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Current Job / Occupation</label>
                        <input type="text" name="currentJob" value={formData.currentJob} onChange={handleChange} className="form-input" placeholder="e.g., Software Engineer, Homemaker, Sales Manager" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <div className="form-step-content animate-fade-in">
                    <h3 style={{ marginBottom: '0.25rem' }}>Preferences</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Help us match you with the right advisor path.</p>
                    <div className="grid grid-2">
                      <div className="form-group">
                        <label className="form-label">Preferred Language *</label>
                        <select name="language" value={formData.language} onChange={handleChange} className="form-select" required>
                          <option value="">Select Language</option>
                          <option value="english">English</option>
                          <option value="hindi">Hindi</option>
                          <option value="marathi">Marathi</option>
                          <option value="gujarati">Gujarati</option>
                          <option value="tamil">Tamil</option>
                          <option value="telugu">Telugu</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">How did you hear about us?</label>
                        <select name="source" value={formData.source} onChange={handleChange} className="form-select">
                          <option value="">Select Source</option>
                          <option value="social">Social Media (FB, IG, LinkedIn)</option>
                          <option value="google">Google Search</option>
                          <option value="friend">Friend / Referral</option>
                          <option value="event">GrowthNest Event</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4 */}
                {step === 4 && (
                  <div className="form-step-content animate-fade-in">
                    <h3 style={{ marginBottom: '0.25rem' }}>Upload Resume</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                      Optional but recommended — helps us fast-track your application.
                    </p>
                    <div className="file-upload-zone">
                      <input type="file" id="resume-upload" onChange={handleFileChange} accept=".pdf,.doc,.docx" className="file-input" />
                      <label htmlFor="resume-upload" className="file-label">
                        <div className="upload-icon">{formData.resume ? '✅' : '📄'}</div>
                        <div className="upload-text">
                          {formData.resume ? formData.resume.name : 'Click to upload or drag and drop'}
                        </div>
                        <div className="upload-hint">PDF, DOC, DOCX up to 5MB</div>
                      </label>
                    </div>

                    {/* Summary */}
                    <div className="application-summary">
                      <h5 style={{ margin: '0 0 0.75rem' }}>📋 Application Summary</h5>
                      <div className="summary-grid">
                        {[
                          { label: 'Name', val: formData.name || '—' },
                          { label: 'Email', val: formData.email || '—' },
                          { label: 'Phone', val: formData.phone || '—' },
                          { label: 'City', val: formData.city || '—' },
                          { label: 'Education', val: formData.education || '—' },
                          { label: 'Experience', val: formData.experience || '—' },
                        ].map((item, i) => (
                          <div key={i} className="summary-item">
                            <span className="summary-label">{item.label}</span>
                            <span className="summary-val">{item.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Nav Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-glass)' }}>
                  {step > 1 ? (
                    <button type="button" className="btn btn-secondary" onClick={prevStep}>← Back</button>
                  ) : <div />}

                  {step < 4 ? (
                    <button type="submit" className="btn btn-primary">Next →</button>
                  ) : (
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                      {isSubmitting ? '⏳ Submitting...' : '✅ Submit Application'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .careers-section { padding-top: calc(var(--nav-height) + 3rem); }

        .careers-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: start;
        }

        .careers-benefits { position: sticky; top: calc(var(--nav-height) + 2rem); }

        /* Income bar */
        .income-range-bar {
          height: 8px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .income-range-fill {
          height: 100%;
          width: 60%;
          background: var(--gradient-primary);
          border-radius: var(--radius-full);
          position: relative;
        }

        .income-range-fill::after {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 3px; height: 100%;
          background: white;
          border-radius: 2px;
        }

        /* Benefits */
        .benefits-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .benefit-item {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .benefit-icon {
          width: 36px; height: 36px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-sm);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .partner-logos-mini { margin-top: 1.5rem; }

        /* Form */
        .form-card {
          padding: 2.5rem;
        }

        .form-steps {
          display: flex;
          align-items: flex-start;
          margin-bottom: 2.5rem;
          position: relative;
        }

        .form-step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          gap: 6px;
          position: relative;
        }

        .step-circle {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: var(--bg-tertiary);
          border: 2px solid var(--border-glass);
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem;
          transition: all 0.3s ease;
          z-index: 2;
          position: relative;
        }

        .step-circle.current {
          background: var(--primary);
          border-color: var(--primary);
          color: var(--bg-primary);
          box-shadow: 0 0 0 4px rgba(0,212,170,0.2);
          font-size: 0.8rem;
        }

        .step-circle.done {
          background: rgba(0,212,170,0.15);
          border-color: var(--primary);
          color: var(--primary);
          font-size: 0.9rem;
        }

        .step-lbl {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 500;
          text-align: center;
        }

        .step-lbl.active-lbl { color: var(--primary); }

        .step-connector {
          position: absolute;
          top: 20px;
          left: 60%;
          right: -40%;
          height: 2px;
          background: var(--bg-tertiary);
          z-index: 1;
        }

        .step-connector-fill {
          height: 100%;
          background: var(--primary);
          transition: width 0.4s ease;
          border-radius: 2px;
        }

        .form-step-content {
          min-height: 240px;
        }

        /* Input valid state */
        :global(.input-valid) {
          border-color: var(--primary) !important;
          background: rgba(0,212,170,0.03) !important;
        }

        /* File upload */
        .file-upload-zone { position: relative; margin-bottom: 1.5rem; }

        .file-input {
          position: absolute; width: 1px; height: 1px;
          padding: 0; margin: -1px; overflow: hidden;
          clip: rect(0,0,0,0); border: 0;
        }

        .file-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 2rem;
          background: var(--bg-tertiary);
          border: 2px dashed var(--border-glass);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .file-label:hover {
          border-color: var(--primary);
          background: rgba(0,212,170,0.04);
        }

        .upload-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
        .upload-text { font-weight: 600; font-size: 0.9rem; margin-bottom: 0.4rem; color: var(--primary); }
        .upload-hint { font-size: 0.8rem; color: var(--text-muted); }

        /* Summary */
        .application-summary {
          padding: 1.25rem;
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
          margin-top: 1rem;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .summary-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .summary-label {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .summary-val {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        @media (max-width: 1024px) {
          .careers-split { grid-template-columns: 1fr; gap: 3rem; }
          .careers-benefits { position: static; }
        }

        @media (max-width: 768px) {
          .form-card { padding: 1.5rem; }
          .step-connector { display: none; }
        }
      `}</style>
    </section>
  );
}
