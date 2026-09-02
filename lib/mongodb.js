import mongoose from 'mongoose';

/**
 * MongoDB Atlas connection module for Next.js (App Router).
 *
 * ─── HOW DNS IS HANDLED ───────────────────────────────────────────────────
 * DNS is set to Google (8.8.8.8) in instrumentation.js, which runs ONCE
 * at server startup before any route code. That file sets dns.setServers()
 * at the raw Node.js process level, before Turbopack/webpack sandboxing.
 * This file does NOT need to import or configure dns.
 * ──────────────────────────────────────────────────────────────────────────
 *
 * ─── CONNECTION CACHING ───────────────────────────────────────────────────
 * Uses a global cached connection to:
 *   - Survive Next.js hot-reloads in development without reconnecting
 *   - Reuse connections across serverless invocations on Vercel
 * ──────────────────────────────────────────────────────────────────────────
 *
 * ─── ENVIRONMENT ──────────────────────────────────────────────────────────
 * Connection string is read ONLY from process.env.MONGODB_URI.
 * Credentials are NEVER hardcoded in source code.
 *
 * Local dev  → set MONGODB_URI in .env (git-ignored)
 * Vercel     → set MONGODB_URI in Vercel Dashboard → Project → Settings → Environment Variables
 * ──────────────────────────────────────────────────────────────────────────
 */

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  // Return existing cached connection immediately
  if (cached.conn) {
    return cached.conn;
  }

  // MONGODB_URI is required — throw a clear error if missing
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      '[MongoDB Error]: MONGODB_URI environment variable is not set.\n' +
      '  → Local dev: add MONGODB_URI to your .env file\n' +
      '  → Vercel: add MONGODB_URI in Project → Settings → Environment Variables'
    );
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,       // Fail immediately — correct for serverless
      dbName: 'growthnest',        // Enforce database name regardless of URI
      family: 4,                   // Force IPv4 (avoids IPv6 routing issues on some networks)
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 30000,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((mongooseInstance) => {
        const dbName = mongooseInstance.connection.db?.databaseName || 'growthnest';
        // Safe log — never logs URI or password
        console.log(`[MongoDB]: ✅ Connected to database "${dbName}"`);
        return mongooseInstance;
      })
      .catch((err) => {
        // Reset so the next request retries the connection
        cached.promise = null;
        console.error('[MongoDB]: ❌ Connection failed —', err.message);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
