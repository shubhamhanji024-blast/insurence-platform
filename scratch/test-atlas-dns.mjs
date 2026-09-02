/**
 * MongoDB Atlas Connection Test — with forced Google DNS (8.8.8.8)
 * This bypasses ISP DNS that blocks MongoDB SRV records.
 * Run: node scratch/test-atlas-dns.mjs
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';

// ── Force Google DNS to resolve MongoDB SRV records ──────────────────────────
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
console.log('[Test]: DNS servers set to Google (8.8.8.8) and Cloudflare (1.1.1.1)');

// ── Load .env manually ───────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env');

try {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
  console.log('[Test]: Loaded .env file');
} catch {
  console.error('[Test ERROR]: Could not read .env — make sure it exists at project root');
  process.exit(1);
}

// ── Validate MONGODB_URI ─────────────────────────────────────────────────────
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('[Test ERROR]: MONGODB_URI is not set in .env');
  process.exit(1);
}

console.log('\n[Test]: MongoDB URI type:', uri.includes('mongodb+srv') ? '☁️  MongoDB Atlas' : '🖥️  Local');
console.log('[Test]: Database: growthnest');
console.log('[Test]: Collection: contact_enquiries\n');

// ── Connect & Insert ─────────────────────────────────────────────────────────
import mongoose from 'mongoose';

const ContactEnquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, default: null },
    service: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['NEW', 'READ', 'IN_PROGRESS', 'RESPONDED', 'CLOSED'],
      default: 'NEW',
    },
  },
  { timestamps: true }
);

const ContactEnquiry =
  mongoose.models.ContactEnquiry ||
  mongoose.model('ContactEnquiry', ContactEnquirySchema, 'contact_enquiries');

let connection;
try {
  console.log('[Test]: Connecting to MongoDB Atlas...');
  connection = await mongoose.connect(uri, {
    bufferCommands: false,
    dbName: 'growthnest',
    serverSelectionTimeoutMS: 15000,
    family: 4, // Force IPv4
  });

  const dbName = connection.connection.db?.databaseName || 'growthnest';
  console.log(`[Test]: ✅ Connected to database: "${dbName}"`);

  // Insert a test document
  console.log('[Test]: Inserting test document...');
  const inserted = await ContactEnquiry.create({
    name: 'Atlas DNS Test',
    email: 'dns-test@growthnest.com',
    phone: '9876543210',
    service: 'General Enquiry',
    message: 'This document was inserted by test-atlas-dns.mjs to verify Atlas connection works via Google DNS override.',
    status: 'NEW',
  });

  console.log('\n════════════════════════════════════════════════════════');
  console.log('✅ TEST PASSED — Document inserted into MongoDB Atlas!');
  console.log('════════════════════════════════════════════════════════');
  console.log('  Document ID :', inserted._id.toString());
  console.log('  Name        :', inserted.name);
  console.log('  Email       :', inserted.email);
  console.log('  Service     :', inserted.service);
  console.log('  Created At  :', inserted.createdAt);
  console.log('════════════════════════════════════════════════════════');
  console.log('\n📌 Check in Atlas → Data Explorer → growthnest → contact_enquiries\n');

} catch (err) {
  console.error('\n════════════════════════════════════════════════════════');
  console.error('❌ TEST FAILED:', err.message);
  console.error('════════════════════════════════════════════════════════');
  if (err.message.includes('Authentication') || err.message.includes('bad auth')) {
    console.error('💡 Hint: Wrong password. Check Atlas → Database Access → growthnest_user');
  } else if (err.message.includes('ECONNREFUSED') || err.message.includes('querySrv')) {
    console.error('💡 Hint: DNS still failing. Try running test from a different network.');
  } else if (err.message.includes('ETIMEDOUT') || err.message.includes('ServerSelection')) {
    console.error('💡 Hint: Timeout. Check Atlas → Network Access → 0.0.0.0/0 is Active.');
  }
  process.exit(1);
} finally {
  if (connection) {
    await mongoose.disconnect();
    console.log('[Test]: Disconnected.\n');
  }
}
