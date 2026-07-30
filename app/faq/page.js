'use client';
import { useState } from 'react';
import Link from 'next/link';
import { faqs, faqCategories } from '@/data/faqs';

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItem, setOpenItem] = useState(null);

  const allQuestions = faqs.flatMap(cat =>
    cat.questions.map(q => ({ ...q, category: cat.category }))
  );

  const searchResults = searchQuery
    ? allQuestions.filter(q =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  const displayedCategories = searchResults
    ? [{ category: `Results for "${searchQuery}"`, questions: searchResults }]
    : activeCategory === 'All'
      ? faqs
      : faqs.filter(cat => cat.category === activeCategory);

  return (
    <>
      {/* Hero */}
      <section className="faq-hero">
        <div className="faq-hero-bg" />
        <div className="container text-center">
          <span className="label">Have Questions?</span>
          <h1 style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            Frequently Asked <span className="text-gradient">Questions</span>
          </h1>
          <p style={{ maxWidth: '550px', margin: '0 auto 2rem', color: 'var(--text-secondary)' }}>
            Everything you need to know about joining GrowthNest as an insurance advisor.
          </p>
          {/* Search */}
          <div className="faq-search-wrap">
            <span className="faq-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search questions…"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setOpenItem(null); }}
              className="faq-search-input"
            />
            {searchQuery && (
              <button className="faq-search-clear" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="faq-layout">
            {/* Sidebar */}
            {!searchQuery && (
              <div className="faq-sidebar">
                <h4 style={{ marginBottom: '1rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Categories</h4>
                {faqCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setOpenItem(null); }}
                    className={`faq-sidebar-item ${activeCategory === cat ? 'active' : ''}`}
                  >
                    {cat === 'All' ? '📋 All Questions' :
                     cat === 'Getting Started' ? '🚀 Getting Started' :
                     cat === 'Earnings' ? '💰 Earnings' :
                     cat === 'Training' ? '📚 Training' :
                     cat === 'Work & Lifestyle' ? '🏠 Work & Lifestyle' :
                     '🤝 Support'}
                  </button>
                ))}
                <div className="faq-cta-box">
                  <h5 style={{ margin: '0 0 0.5rem' }}>Still have questions?</h5>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 1rem' }}>Our team is here to help you.</p>
                  <Link href="/contact" className="btn btn-primary btn-sm" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                    Contact Us →
                  </Link>
                </div>
              </div>
            )}

            {/* FAQ Content */}
            <div className="faq-content">
              {displayedCategories.length === 0 ? (
                <div className="text-center" style={{ padding: '4rem 0', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                  <p>No results found. Try a different search term.</p>
                </div>
              ) : displayedCategories.map((group, gi) => (
                <div key={gi} className="faq-group">
                  <h3 className="faq-group-title">{group.category}</h3>
                  <div className="faq-list">
                    {group.questions.map((item, qi) => {
                      const key = `${gi}-${qi}`;
                      const isOpen = openItem === key;
                      return (
                        <div key={qi} className={`faq-item ${isOpen ? 'open' : ''}`} onClick={() => setOpenItem(isOpen ? null : key)}>
                          <div className="faq-question">
                            <span>{item.q}</span>
                            <span className="faq-chevron">{isOpen ? '▲' : '▼'}</span>
                          </div>
                          {isOpen && (
                            <div className="faq-answer animate-fade-in">
                              {item.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container text-center">
          <h3 style={{ marginBottom: '1rem' }}>Ready to Get <span className="text-gradient">Started?</span></h3>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            Join 5,000+ advisors building financial freedom with GrowthNest.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/careers" className="btn btn-primary">🚀 Apply Now — It's Free</Link>
            <Link href="/contact" className="btn btn-secondary">Talk to Us</Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .faq-hero {
          padding: calc(var(--nav-height) + 3rem) 0 3rem;
          position: relative; overflow: hidden;
          background: var(--bg-secondary); border-bottom: 1px solid var(--border-glass);
        }
        .faq-hero-bg {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(255,215,0,0.06), transparent 60%);
        }
        .faq-search-wrap {
          position: relative; max-width: 500px; margin: 0 auto;
          display: flex; align-items: center;
        }
        .faq-search-icon {
          position: absolute; left: 1rem; font-size: 1rem; z-index: 2;
        }
        .faq-search-input {
          width: 100%; padding: 0.85rem 3rem;
          background: var(--bg-card); border: 1px solid var(--border-glass);
          border-radius: var(--radius-full); color: var(--text-primary);
          font-family: var(--font-body); font-size: 0.95rem;
          outline: none; transition: border-color 0.2s;
        }
        .faq-search-input:focus { border-color: var(--primary); }
        .faq-search-clear {
          position: absolute; right: 1rem; background: none; border: none;
          color: var(--text-muted); cursor: pointer; font-size: 0.85rem;
        }
        .faq-layout {
          display: grid; grid-template-columns: 220px 1fr; gap: 3rem; align-items: start;
        }
        .faq-sidebar {
          position: sticky; top: calc(var(--nav-height) + 1rem);
          display: flex; flex-direction: column; gap: 0.4rem;
        }
        .faq-sidebar-item {
          padding: 0.65rem 1rem; border-radius: var(--radius-md);
          background: transparent; border: none; text-align: left;
          color: var(--text-secondary); cursor: pointer; font-size: 0.88rem;
          transition: all 0.2s; font-family: var(--font-body);
        }
        .faq-sidebar-item:hover { background: var(--bg-tertiary); color: var(--text-primary); }
        .faq-sidebar-item.active { background: rgba(0,212,170,0.1); color: var(--primary); font-weight: 600; }
        .faq-cta-box {
          margin-top: 1.5rem; padding: 1.25rem;
          background: var(--bg-tertiary); border-radius: var(--radius-md);
          border: 1px solid var(--border-glass);
        }
        .faq-group { margin-bottom: 2.5rem; }
        .faq-group-title {
          font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem;
          padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-glass);
          color: var(--text-primary);
        }
        .faq-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .faq-item {
          background: var(--bg-card); border: 1px solid var(--border-glass);
          border-radius: var(--radius-md); cursor: pointer; overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .faq-item:hover { border-color: rgba(0,212,170,0.3); }
        .faq-item.open { border-color: var(--primary); box-shadow: 0 0 20px rgba(0,212,170,0.08); }
        .faq-question {
          display: flex; justify-content: space-between; align-items: center;
          padding: 1rem 1.25rem; gap: 1rem; font-weight: 500;
          font-size: 0.95rem;
        }
        .faq-chevron { color: var(--primary); font-size: 0.7rem; flex-shrink: 0; }
        .faq-answer {
          padding: 0 1.25rem 1rem; font-size: 0.88rem; color: var(--text-secondary);
          line-height: 1.7; border-top: 1px solid var(--border-glass);
          padding-top: 0.75rem;
        }
        @media (max-width: 768px) {
          .faq-layout { grid-template-columns: 1fr; }
          .faq-sidebar { position: static; flex-direction: row; flex-wrap: wrap; }
          .faq-sidebar-item { font-size: 0.8rem; padding: 0.4rem 0.75rem; }
          .faq-cta-box { display: none; }
        }
      `}</style>
    </>
  );
}
