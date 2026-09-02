'use client';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="container" style={{ maxWidth: '560px' }}>
        <div style={{ fontSize: '5rem', fontFamily: 'Playfair Display, serif', fontWeight: 700, color: 'var(--primary-700)', lineHeight: 1, marginBottom: '1rem' }}>
          404
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary-900)' }}>
          Page Not Found
        </h1>
        <p style={{ color: 'var(--gray-600)', marginBottom: '2rem', lineHeight: 1.7, fontSize: '1rem' }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let&apos;s get you back on track.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-primary">
            ← Return to Homepage
          </Link>
          <Link href="/services" className="btn btn-outline">
            Explore Services
          </Link>
        </div>
      </div>
    </div>
  );
}
