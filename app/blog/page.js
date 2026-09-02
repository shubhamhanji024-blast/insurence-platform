'use client';
import { useState } from 'react';
import Link from 'next/link';
import { blogPosts, blogCategories } from '@/data/blog-posts';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find(p => p.featured) || blogPosts[0];

  return (
    <>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <span className="hero-badge">Financial Insights</span>
          <h1>Knowledge for Smarter Financial Decisions</h1>
          <p>
            Expert articles, market analyses, tax tips, and wealth creation strategies curated by GrowthNest advisors.
          </p>
        </div>
      </section>

      <section className="section bg-gray-50">
        <div className="container">

          {/* Featured Article */}
          {featuredPost && selectedCategory === 'All' && !searchQuery && (
            <div className="glass-card" style={{ padding: '0', overflow: 'hidden', marginBottom: '3.5rem', display: 'grid', gridTemplateColumns: '1fr', gap: '0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0' }}>
                <div className="split-grid" style={{ gap: '0' }}>
                  <div style={{ height: '320px', overflow: 'hidden', position: 'relative' }}>
                    <img 
                      src={featuredPost.image} 
                      alt={featuredPost.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                  <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <span className="blog-tag">{featuredPost.category}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Featured Article • {featuredPost.readTime}</span>
                    </div>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--primary-900)' }}>
                      <Link href={`/blog/${featuredPost.slug}`} style={{ color: 'inherit' }}>
                        {featuredPost.title}
                      </Link>
                    </h2>
                    <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem', lineHeight: 1.7, fontSize: '0.95rem' }}>
                      {featuredPost.excerpt}
                    </p>
                    <div>
                      <Link href={`/blog/${featuredPost.slug}`} className="btn btn-primary btn-sm">
                        Read Full Article →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search & Filter Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              {/* Category Pills */}
              <div className="insights-filter" style={{ marginBottom: 0 }}>
                {blogCategories.map(cat => (
                  <button
                    key={cat}
                    className={`filter-btn${selectedCategory === cat ? ' active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="search-input-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Search articles by title or keyword..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Articles Grid */}
          {filteredPosts.length > 0 ? (
            <div className="blog-grid">
              {filteredPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card">
                  <div className="blog-image">
                    <img src={post.image} alt={post.title} loading="lazy" />
                  </div>
                  <div className="blog-body">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <span className="blog-tag">{post.category}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{post.readTime}</span>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <span className="blog-link">
                      Read Article
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary-900)' }}>No articles found</h3>
              <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem' }}>Try adjusting your search query or selecting another category.</p>
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <span className="section-label" style={{ color: '#d4af37' }}>Stay Informed</span>
          <h2>Have specific financial questions?</h2>
          <p>Talk directly with our advisory team for personalized answers tailored to your financial situation.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-secondary btn-lg">Ask an Advisor</Link>
          </div>
        </div>
      </section>
    </>
  );
}
