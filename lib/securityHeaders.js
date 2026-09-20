/**
 * Security Headers Helper
 * ───────────────────────
 * Applies standard security HTTP headers to every Next.js API response.
 * Call applySecurityHeaders(response) before returning from any API route,
 * OR use the applySecurityHeadersToNextConfig() export in next.config.mjs.
 */

/**
 * Apply security headers to a NextResponse object.
 * @param {import('next/server').NextResponse} res
 * @returns {import('next/server').NextResponse}
 */
export function applySecurityHeaders(res) {
  // Prevent clickjacking
  res.headers.set('X-Frame-Options', 'DENY');
  // Prevent MIME-type sniffing
  res.headers.set('X-Content-Type-Options', 'nosniff');
  // Referrer privacy
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Disable browser features not used by the app
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  // Force HTTPS for 1 year (only meaningful in production, ignored on HTTP)
  res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  // Basic XSS protection for legacy browsers
  res.headers.set('X-XSS-Protection', '1; mode=block');

  return res;
}

/**
 * Security headers config for use in next.config.mjs headers() function.
 * These are applied at the edge to ALL responses (HTML, API, assets).
 */
export const SECURITY_HEADERS = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
];
