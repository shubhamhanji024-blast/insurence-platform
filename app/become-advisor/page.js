'use client';
import Link from 'next/link';

export default function BecomeAdvisorPage() {
  return (
    <>
      <section className="section-sm" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-glass)' }}>
        <div className="container">
          <div className="section-heading" style={{ marginBottom: '2rem' }}>
            <span className="label">Your Opportunity</span>
            <h2>Build a Rewarding Career as an <span className="text-gradient">Insurance Advisor</span></h2>
            <p>Financial independence, flexible hours, and unlimited earning potential.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-2 gap-2xl">
            <div>
              <h3 style={{ marginBottom: '1.5rem' }}>Eligibility Criteria</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {[
                  'Minimum Age: 18 Years',
                  'Minimum Qualification: 10th Standard Pass',
                  'Valid Aadhaar Card & PAN Card',
                  'Active Bank Account',
                  'Basic Smartphone / Computer knowledge',
                  'No prior experience required'
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 style={{ marginBottom: '1.5rem' }}>Required Documents</h3>
              <div className="glass-card-static" style={{ padding: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="doc-item">
                    <span className="doc-icon">🪪</span>
                    <p>Aadhaar Card</p>
                  </div>
                  <div className="doc-item">
                    <span className="doc-icon">💳</span>
                    <p>PAN Card</p>
                  </div>
                  <div className="doc-item">
                    <span className="doc-icon">🎓</span>
                    <p>10th/12th Marksheet</p>
                  </div>
                  <div className="doc-item">
                    <span className="doc-icon">🏦</span>
                    <p>Bank Passbook / Cheque</p>
                  </div>
                  <div className="doc-item">
                    <span className="doc-icon">📸</span>
                    <p>Passport Photos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-heading">
            <h2>The GrowthNest <span className="text-gradient">Advantage</span></h2>
          </div>
          <div className="grid grid-3">
            {[
              { icon: '💸', title: 'High Commission', desc: 'Earn up to 35% on first year premium and up to 7.5% on renewals.' },
              { icon: '📈', title: 'Career Growth', desc: 'Clear path to become a Team Manager and earn overriding commissions.' },
              { icon: '💻', title: 'Digital Tools', desc: 'Free access to our CRM, lead management, and marketing portal.' },
              { icon: '🏆', title: 'Rewards & Recognition', desc: 'International trips, cash bonuses, and prestigious club memberships.' },
              { icon: '🎓', title: 'Expert Training', desc: 'Continuous learning through online modules and offline seminars.' },
              { icon: '🤝', title: 'Multiple Partners', desc: 'Don\'t limit yourself. Sell products from 20+ top insurance companies.' },
            ].map((adv, i) => (
              <div key={i} className="glass-card text-center" style={{ padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{adv.icon}</div>
                <h4 style={{ marginBottom: '0.5rem' }}>{adv.title}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>Career <span className="text-gradient">Progression Path</span></h2>
            <p>How you can grow with us over time.</p>
          </div>
          
          <div className="career-path">
            <div className="path-node">
              <div className="node-icon">🌱</div>
              <h4>Advisor</h4>
              <p>Sell policies, learn the ropes, build client base.</p>
            </div>
            <div className="path-connector"></div>
            <div className="path-node">
              <div className="node-icon">⭐</div>
              <h4>Senior Advisor</h4>
              <p>Consistent performer, higher bonus slabs, mentor others.</p>
            </div>
            <div className="path-connector"></div>
            <div className="path-node">
              <div className="node-icon">👔</div>
              <h4>Team Manager</h4>
              <p>Recruit and manage your own team of advisors. Earn overrides.</p>
            </div>
            <div className="path-connector"></div>
            <div className="path-node">
              <div className="node-icon">👑</div>
              <h4>Branch Director</h4>
              <p>Manage multiple teams, open your own franchise office.</p>
            </div>
          </div>
          
          <div className="text-center" style={{ marginTop: '4rem' }}>
            <Link href="/careers" className="btn btn-primary btn-lg">
              Start Your Journey Now 🚀
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .doc-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.5rem;
          padding: 1rem;
          background: rgba(255,255,255,0.02);
          border-radius: var(--radius-md);
        }
        
        .doc-icon {
          font-size: 2rem;
        }
        
        .career-path {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2rem 0;
          overflow-x: auto;
        }
        
        .path-node {
          flex: 1;
          text-align: center;
          min-width: 200px;
          position: relative;
          z-index: 2;
        }
        
        .node-icon {
          width: 80px;
          height: 80px;
          background: var(--bg-tertiary);
          border: 2px solid var(--primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          margin: 0 auto 1.5rem;
          box-shadow: 0 0 20px var(--primary-glow);
        }
        
        .path-node h4 {
          color: var(--primary);
          margin-bottom: 0.5rem;
        }
        
        .path-node p {
          font-size: 0.85rem;
        }
        
        .path-connector {
          flex: 1;
          height: 4px;
          background: var(--gradient-primary);
          min-width: 50px;
          margin-top: -60px;
          position: relative;
          z-index: 1;
        }
        
        @media (max-width: 768px) {
          .career-path {
            flex-direction: column;
            gap: 2rem;
          }
          .path-connector {
            width: 4px;
            height: 40px;
            min-width: auto;
            margin-top: 0;
          }
        }
      `}</style>
    </>
  );
}
