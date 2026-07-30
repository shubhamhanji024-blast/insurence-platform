import { blogPosts } from '@/data/blog-posts';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }) {
  const { slug } = params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Get related posts (same category, excluding current)
  const relatedPosts = blogPosts
    .filter(p => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);
    
  // If not enough in same category, just get some other posts
  if (relatedPosts.length < 3) {
      const more = blogPosts.filter(p => p.slug !== post.slug && !relatedPosts.find(r => r.slug === p.slug)).slice(0, 3 - relatedPosts.length);
      relatedPosts.push(...more);
  }

  // Format content (basic markdown-like formatting for demo)
  const formatContent = (content) => {
    return content.split('\n\n').map((paragraph, i) => {
      // Check for bold text like **text**
      const formattedPara = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return (
        <p key={i} dangerouslySetInnerHTML={{ __html: formattedPara }} style={{ marginBottom: '1.5rem', lineHeight: 1.8, fontSize: '1.05rem', color: 'var(--text-secondary)' }} />
      );
    });
  };

  return (
    <>
      {/* Article Header */}
      <section className="section" style={{ background: 'var(--bg-secondary)', paddingBottom: '3rem', borderBottom: '1px solid var(--border-glass)' }}>
        <div className="container-narrow text-center">
          <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 500 }}>
            ← Back to Blog
          </Link>
          
          <div className="flex justify-center" style={{ marginBottom: '1.5rem' }}>
            <span className="badge badge-primary">{post.category}</span>
          </div>
          
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', marginBottom: '1.5rem', lineHeight: 1.2 }}>
            {post.title}
          </h1>
          
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '800px', margin: '0 auto 2.5rem' }}>
            {post.excerpt}
          </p>
          
          <div className="flex justify-center items-center gap-xl" style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                👤
              </div>
              <div className="text-left">
                <p style={{ margin: 0, fontWeight: 600 }}>{post.author}</p>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>GrowthNest Expert</p>
              </div>
            </div>
            
            <div style={{ width: '1px', height: '40px', background: 'var(--border-glass)' }}></div>
            
            <div className="text-left">
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Published</p>
              <p style={{ margin: 0, fontWeight: 500 }}>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
            
            <div style={{ width: '1px', height: '40px', background: 'var(--border-glass)' }}></div>
            
            <div className="text-left">
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Read Time</p>
              <p style={{ margin: 0, fontWeight: 500 }}>{post.readTime}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <div className="container-narrow" style={{ marginTop: '-2rem', position: 'relative', zIndex: 10 }}>
        <div className="glass-card-static" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8rem', background: 'linear-gradient(135deg, var(--bg-tertiary), var(--bg-secondary))' }}>
          {post.image}
        </div>
      </div>

      {/* Content */}
      <section className="section" style={{ paddingTop: '4rem' }}>
        <div className="container-narrow">
          <div className="article-content">
            {formatContent(post.content)}
          </div>
          
          {/* Share & Tags */}
          <div className="flex justify-between items-center flex-wrap" style={{ marginTop: '4rem', padding: '2rem 0', borderTop: '1px solid var(--border-glass)', borderBottom: '1px solid var(--border-glass)' }}>
            <div>
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Tags:</p>
              <div className="flex gap-sm">
                <span className="chip">Insurance</span>
                <span className="chip">{post.category}</span>
              </div>
            </div>
            
            <div>
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Share this article:</p>
              <div className="flex gap-sm">
                <button className="social-share-btn">FB</button>
                <button className="social-share-btn">TW</button>
                <button className="social-share-btn">IN</button>
                <button className="social-share-btn">WA</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="section" style={{ background: 'var(--bg-secondary)', paddingTop: '4rem' }}>
        <div className="container">
          <h3 style={{ marginBottom: '2rem', textAlign: 'center' }}>Related Articles</h3>
          <div className="grid grid-3">
            {relatedPosts.map(rp => (
              <Link href={`/blog/${rp.slug}`} key={rp.slug} style={{ display: 'block' }}>
                <div className="glass-card blog-card" style={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '180px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem' }}>
                    {rp.image}
                  </div>
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', lineHeight: 1.4 }} className="blog-title">{rp.title}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 'auto' }}>
                      {new Date(rp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {rp.readTime}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


    </>
  );
}
