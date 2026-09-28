/**
 * Next.js Instrumentation File
 *
 * DNS for MongoDB Atlas SRV resolution is handled at process startup
 * via dns-preload.cjs (loaded through NODE_OPTIONS=--require in package.json dev script).
 *
 * This file exists as a placeholder for any future server-side startup logic.
 * On Vercel, no DNS override is needed — Vercel's infrastructure DNS works fine.
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.VERCEL !== '1' && !process.env.AWS_LAMBDA_FUNCTION_NAME && !process.env.VERCEL_ENV) {
    try {
      const dns = await import('node:dns');
      dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
    } catch {
      // Ignore
    }
  }
}
