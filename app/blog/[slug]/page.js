'use client';
import { use } from 'react';
import Link from 'next/link';
import { blogPosts } from '@/data/blog-posts';

export default function BlogPostPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const post = blogPosts.find(p => p.slug === slug) || blogPosts[0];

  const relatedPosts = blogPosts.filter(p => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      {/* Article Header */}
      <section className="page-hero" style={{ paddingBottom: '4rem' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="hero-badge">{post.category}</span>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '1rem', lineHeight: 1.25 }}>{post.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
            <span>By {post.author}</span>
            <span>•</span>
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section bg-gray-50">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="glass-card" style={{ padding: '2.5rem', background: '#ffffff', marginBottom: '3rem' }}>
            {post.image && (
              <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '2rem', maxHeight: '400px' }}>
                <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}

            <div style={{ fontSize: '1.05rem', color: 'var(--gray-700)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {post.content}
            </div>

            <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link href="/blog" style={{ color: 'var(--primary-700)', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                ← Back to Insights
              </Link>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Share:</span>
                <a href="#" style={{ fontSize: '0.85rem', color: 'var(--primary-700)', padding: '0.2rem 0.5rem' }}>LinkedIn</a>
                <a href="#" style={{ fontSize: '0.85rem', color: 'var(--primary-700)', padding: '0.2rem 0.5rem' }}>Twitter</a>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--primary-900)' }}>Related Articles</h3>
          <div className="blog-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {relatedPosts.map(rel => (
              <Link key={rel.slug} href={`/blog/${rel.slug}`} className="blog-card">
                <div className="blog-body">
                  <span className="blog-tag">{rel.category}</span>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{rel.title}</h4>
                  <p style={{ fontSize: '0.825rem' }}>{rel.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
