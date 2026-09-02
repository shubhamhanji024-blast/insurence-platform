/**
 * dns-preload.cjs — Node.js DNS Preloader
 * ─────────────────────────────────────────
 * This CommonJS file is loaded via NODE_OPTIONS=--require before
 * Next.js starts. It sets Google DNS globally at the raw Node.js
 * process level, before any bundler (Turbopack/webpack) is initialized.
 *
 * This ensures MongoDB Atlas SRV records resolve correctly on local networks
 * where the ISP DNS refuses SRV queries (ECONNREFUSED).
 *
 * On Vercel: This file is NOT used — Vercel's infrastructure DNS works fine.
 * On local dev: NODE_OPTIONS in package.json loads this before `next dev`.
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const dns = require('dns');

// Set Google DNS + Cloudflare as DNS resolvers
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

// Safe log — no secrets
console.log('[dns-preload]: DNS set to Google (8.8.8.8) + Cloudflare (1.1.1.1) for MongoDB Atlas SRV resolution.');
