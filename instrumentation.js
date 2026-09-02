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
  if (process.env.NEXT_RUNTIME === 'edge') return;
  // DNS is set by dns-preload.cjs (loaded via NODE_OPTIONS --require)
  // No additional setup needed here
}
