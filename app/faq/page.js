'use client';
import { useState } from 'react';
import Link from 'next/link';

const faqCategories = [
  {
    category: 'General Questions',
    questions: [
      {
        q: 'What services does GrowthNest provide?',
        a: 'GrowthNest provides a comprehensive suite of financial services including Financial Planning, Investment Planning, Wealth Management, Retirement Planning, Tax Planning, and Insurance Planning. Our expert advisors create personalized strategies tailored to your unique financial goals.'
      },
      {
        q: 'Is GrowthNest a SEBI-registered advisory?',
        a: 'Yes, GrowthNest is a SEBI-registered investment advisory firm. We adhere strictly to SEBI regulations and fiduciary standards to ensure that all recommendations are unbiased and in our clients’ best interests.'
      },
      {
        q: 'How does financial planning work with GrowthNest?',
        a: 'Our financial planning process starts with an in-depth assessment of your current financial health, income, liabilities, and goals. We then create a customized roadmap, implement the chosen strategy, and provide continuous monitoring and periodic rebalancing.'
      }
    ]
  },
  {
    category: 'Investment & Wealth Management',
    query: 'investments',
    questions: [
      {
        q: 'Can I create a customized investment plan?',
        a: 'Absolutely. We design bespoke portfolios based on your risk appetite, horizon, tax bracket, and specific life goals. We curate investments across equities, mutual funds, debt, gold, and alternative assets.'
      },
      {
        q: 'What is the minimum amount needed to start investing?',
        a: 'You can start a Systematic Investment Plan (SIP) with as little as ₹500 per month. For comprehensive wealth management services, we recommend speaking with a senior advisor to evaluate your asset base.'
      },
      {
        q: 'How often will my portfolio be reviewed?',
        a: 'We monitor portfolios continuously. Formal portfolio reviews and rebalancing consultations are conducted quarterly or semi-annually depending on market conditions and your service tier.'
      }
    ]
  },
  {
    category: 'Retirement & Tax Planning',
    questions: [
      {
        q: 'How much money do I need to retire comfortably?',
        a: 'As a rule of thumb, aiming for 25x your annual post-retirement expenses is a common starting benchmark. However, we calculate your exact corpus requirement using inflation-adjusted models customized to your retirement age and lifestyle expectations.'
      },
      {
        q: 'How can GrowthNest help me save taxes?',
        a: 'We evaluate deductions under Section 80C, 80D, 80CCD (NPS), and capital gains tax harvesting to structure your income and investments legally for maximum tax efficiency under both old and new tax regimes.'
      }
    ]
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState('0-0');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFaq = (key) => {
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <span className="hero-badge">Knowledge Base</span>
          <h1>Frequently Asked Questions</h1>
          <p>
            Find quick answers to common questions about our financial advisory services, investment planning, and client experience.
          </p>
        </div>
      </section>

      {/* Main FAQ List */}
      <section className="section bg-gray-50">
        <div className="container" style={{ maxWidth: '840px' }}>
          
          {/* Search Box */}
          <div className="search-input-wrap" style={{ maxWidth: '100%', marginBottom: '3rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input 
              type="text" 
              placeholder="Search questions by keyword (e.g. SIP, Tax, Retirement, SEBI)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', borderRadius: 'var(--radius-lg)' }}
            />
          </div>

          {/* FAQ Groups */}
          {faqCategories.map((group, gIdx) => {
            const filteredQuestions = group.questions.filter(q => 
              searchQuery === '' ||
              q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
              q.a.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filteredQuestions.length === 0) return null;

            return (
              <div key={gIdx} style={{ marginBottom: '3rem' }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-900)', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--primary-700)' }}>
                  {group.category}
                </h3>

                <div className="faq-list">
                  {filteredQuestions.map((faq, qIdx) => {
                    const key = `${gIdx}-${qIdx}`;
                    const isOpen = openIndex === key;
                    return (
                      <div key={qIdx} className={`faq-item${isOpen ? ' open' : ''}`}>
                        <button className="faq-trigger" onClick={() => toggleFaq(key)} aria-expanded={isOpen}>
                          <span>{faq.q}</span>
                          <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>
                        <div className="faq-answer" aria-hidden={!isOpen}>
                          <div className="faq-answer-inner">{faq.a}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <span className="section-label" style={{ color: '#d4af37' }}>Still Have Questions?</span>
          <h2>We&apos;re here to answer all your queries.</h2>
          <p>Contact our support team or schedule a 1-on-1 discovery call with an advisor.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-secondary btn-lg">Contact Us</Link>
            <Link href="/register" className="btn btn-outline-white btn-lg">Get Started</Link>
          </div>
        </div>
      </section>
    </>
  );
}
