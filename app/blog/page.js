'use client';
import { useState } from 'react';
import Link from 'next/link';
import { blogPosts, blogCategories } from '@/data/blog-posts';

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredPosts = activeCategory === 'All'
    ? blogPosts
    : blogPosts.filter(p => p.category === activeCategory);

  const featuredPost = blogPosts.find(p => p.featured) || blogPosts[0];
  const regularPosts = filteredPosts.filter(p => p.slug !== featuredPost.slug);

  return (
    <>
      {/* Hero */}
      <section className="blog-hero">
        <div className="blog-hero-bg" />
        <div className="container text-center">
          <span className="label">Knowledge Hub</span>
          <h1 style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            Insights for <span className="text-gradient">Insurance Advisors</span>
          </h1>
          <p style={{ maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            Expert tips, career guides, and industry updates to help you grow as an insurance professional.
          </p>
          {/* Category Pills */}
          <div className="blog-cats">
            {blogCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`blog-cat-pill ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {activeCategory === 'All' && (
        <section className="section" style={{ paddingBottom: '2rem' }}>
          <div className="container">
            <div className="blog-featured card-hover-glow">
              <div className="blog-featured-icon">{featuredPost.image}</div>
              <div className="blog-featured-body">
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-primary">⭐ Featured</span>
                  <span className="blog-cat-tag">{featuredPost.category}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>⏱️ {featuredPost.readTime}</span>
                </div>
                <h2 style={{ marginBottom: '0.75rem', fontSize: '1.6rem' }}>{featuredPost.title}</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1rem', lineHeight: 1.7 }}>{featuredPost.excerpt}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="author-avatar">{featuredPost.author[0]}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{featuredPost.author}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(featuredPost.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                  </div>
                  <Link href={`/blog/${featuredPost.slug}`} className="btn btn-primary btn-sm">
                    Read Article →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Post Grid */}
      <section className="section" style={{ paddingTop: '1rem' }}>
        <div className="container">
          {regularPosts.length === 0 && activeCategory !== 'All' ? (
            <div className="text-center" style={{ padding: '4rem 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
              <p>No articles in this category yet. Check back soon!</p>
            </div>
          ) : (
            <div className="blog-grid">
              {(activeCategory === 'All' ? regularPosts : filteredPosts).map(post => (
                <div key={post.slug} className="blog-card glass-card card-hover-glow">
                  <div className="blog-card-emoji">{post.image}</div>
                  <div className="blog-card-body">
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span className="blog-cat-tag">{post.category}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>⏱️ {post.readTime}</span>
                    </div>
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem', lineHeight: 1.4 }}>{post.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.6 }}>{post.excerpt}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <div className="author-avatar-sm">{post.author[0]}</div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{post.author}</span>
                      </div>
                      <Link href={`/blog/${post.slug}`} style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600 }}>
                        Read →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Strip */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container text-center">
          <h3 style={{ marginBottom: '0.75rem' }}>Want to <span className="text-gradient">Write for Us?</span></h3>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Share your insurance expertise and reach 5,000+ advisors.</p>
          <Link href="/contact" className="btn btn-primary">Submit Your Article →</Link>
        </div>
      </section>

      <style jsx>{`
        .blog-hero {
          padding: calc(var(--nav-height) + 3rem) 0 3rem;
          position: relative;
          overflow: hidden;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-glass);
        }
        .blog-hero-bg {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(108,99,255,0.08), transparent 60%);
        }
        .blog-cats {
          display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem;
        }
        .blog-cat-pill {
          padding: 0.4rem 1rem; border-radius: var(--radius-full);
          border: 1px solid var(--border-glass); background: transparent;
          color: var(--text-secondary); cursor: pointer; font-size: 0.85rem;
          transition: all 0.2s; font-family: var(--font-body);
        }
        .blog-cat-pill:hover, .blog-cat-pill.active {
          background: var(--primary); border-color: var(--primary);
          color: var(--bg-primary); font-weight: 600;
        }
        .blog-featured {
          display: grid; grid-template-columns: 200px 1fr; gap: 2.5rem;
          align-items: center; padding: 2.5rem;
          background: var(--bg-card); border: 1px solid var(--border-glass);
          border-radius: var(--radius-xl);
          border-left: 4px solid var(--primary);
        }
        .blog-featured-icon {
          font-size: 6rem; text-align: center;
          background: var(--bg-tertiary); border-radius: var(--radius-lg);
          padding: 2rem; line-height: 1;
        }
        .blog-cat-tag {
          font-size: 0.72rem; padding: 2px 8px; border-radius: var(--radius-full);
          background: rgba(108,99,255,0.12); color: var(--secondary);
          font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;
        }
        .author-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: var(--gradient-primary); display: flex; align-items: center;
          justify-content: center; font-weight: 700; color: var(--bg-primary); font-size: 0.85rem;
        }
        .author-avatar-sm {
          width: 24px; height: 24px; border-radius: 50%;
          background: var(--gradient-primary); display: flex; align-items: center;
          justify-content: center; font-weight: 700; color: var(--bg-primary); font-size: 0.7rem;
        }
        .blog-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;
        }
        .blog-card { padding: 0; overflow: hidden; display: flex; flex-direction: column; }
        .blog-card-emoji {
          font-size: 3rem; padding: 1.5rem 1.5rem 0.5rem; text-align: center;
          background: var(--bg-tertiary); border-bottom: 1px solid var(--border-glass);
        }
        .blog-card-body {
          padding: 1.25rem; display: flex; flex-direction: column; flex: 1;
        }
        @media (max-width: 900px) {
          .blog-grid { grid-template-columns: repeat(2, 1fr); }
          .blog-featured { grid-template-columns: 1fr; }
          .blog-featured-icon { font-size: 4rem; padding: 1rem; }
        }
        @media (max-width: 600px) {
          .blog-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
