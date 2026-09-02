/**
 * MongoDB Atlas Connection & Insertion Test Script
 * ------------------------------------------------
 * Run from project root:
 *   node scratch/test-atlas.mjs
 *
 * This script will:
 *   1. Read MONGODB_URI from .env
 *   2. Connect to MongoDB Atlas
 *   3. Insert a test document into growthnest.contact_enquiries
 *   4. Read it back and confirm insertion
 *   5. Print the document ID visible in Atlas Data Explorer
 *
 * Prerequisites:
 *   - Set MONGODB_URI in .env to your Atlas connection string
 *   - Run: npm install (to ensure mongoose is available)
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// ── Load .env manually (no dotenv dependency required) ──────────────────────
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
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
  console.log('[Test]: Loaded .env file');
} catch {
  console.error('[Test]: Could not read .env file — make sure it exists at project root');
  process.exit(1);
}

// ── Validate MONGODB_URI ─────────────────────────────────────────────────────
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('\n[Test ERROR]: MONGODB_URI is not set in your .env file.');
  console.error('Please add your MongoDB Atlas connection string:');
  console.error('  MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxx.mongodb.net/growthnest?retryWrites=true&w=majority\n');
  process.exit(1);
}

const isAtlas = uri.includes('mongodb+srv://') || uri.includes('mongodb.net');
const isLocal = uri.includes('127.0.0.1') || uri.includes('localhost');

console.log('\n[Test]: MongoDB URI type detected:', isAtlas ? '☁️  MongoDB Atlas' : isLocal ? '🖥️  Local MongoDB' : '❓ Unknown');
console.log('[Test]: Database: growthnest');
console.log('[Test]: Collection: contact_enquiries');
console.log('');

// ── Connect & Test ───────────────────────────────────────────────────────────
import mongoose from 'mongoose';

const ContactEnquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, default: null },
    service: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['NEW', 'READ', 'IN_PROGRESS', 'RESPONDED', 'CLOSED'], default: 'NEW' },
  },
  { timestamps: true }
);

const ContactEnquiry =
  mongoose.models.ContactEnquiry ||
  mongoose.model('ContactEnquiry', ContactEnquirySchema, 'contact_enquiries');

const testDoc = {
  name: 'Atlas Test User',
  email: 'atlas-test@growthnest.com',
  phone: '9876543210',
  service: 'General Enquiry',
  message: 'This is an automated test document inserted by test-atlas.mjs to verify MongoDB Atlas connection.',
  status: 'NEW',
};

let connection;

try {
  console.log('[Test]: Connecting to MongoDB...');
  connection = await mongoose.connect(uri, {
    bufferCommands: false,
    dbName: 'growthnest',
    serverSelectionTimeoutMS: 10000, // 10 second timeout
  });

  const dbName = connection.connection.db?.databaseName || 'growthnest';
  console.log(`[Test]: ✅ Connected to database: "${dbName}"`);

  // Insert test document
  console.log('[Test]: Inserting test document into contact_enquiries...');
  const inserted = await ContactEnquiry.create(testDoc);

  console.log('\n════════════════════════════════════════════════════════');
  console.log('✅ TEST PASSED — Document inserted successfully!');
  console.log('════════════════════════════════════════════════════════');
  console.log('  Document ID :', inserted._id.toString());
  console.log('  Name        :', inserted.name);
  console.log('  Email       :', inserted.email);
  console.log('  Service     :', inserted.service);
  console.log('  Status      :', inserted.status);
  console.log('  Created At  :', inserted.createdAt);
  console.log('════════════════════════════════════════════════════════');
  console.log('\n📌 You should now see this document in:');
  console.log('   MongoDB Atlas → Data Explorer → growthnest → contact_enquiries\n');

} catch (err) {
  console.error('\n════════════════════════════════════════════════════════');
  console.error('❌ TEST FAILED');
  console.error('════════════════════════════════════════════════════════');
  console.error('Error:', err.message);
  console.error('');

  if (err.message.includes('ECONNREFUSED')) {
    console.error('💡 Hint: Could not connect to local MongoDB. Is it running?');
  } else if (err.message.includes('Authentication failed') || err.message.includes('bad auth')) {
    console.error('💡 Hint: Wrong username or password in your Atlas URI. Check Atlas → Database Access.');
  } else if (err.message.includes('IP') || err.message.includes('whitelist') || err.message.includes('not allowed')) {
    console.error('💡 Hint: Your IP is not whitelisted in Atlas. Go to Atlas → Network Access → Add IP Address.');
  } else if (err.message.includes('ETIMEDOUT') || err.message.includes('ServerSelectionTimeoutError')) {
    console.error('💡 Hint: Connection timed out. Check:');
    console.error('   1. Your Atlas cluster is running (not paused)');
    console.error('   2. Network Access in Atlas allows your IP (or 0.0.0.0/0 for testing)');
  }

  console.error('════════════════════════════════════════════════════════\n');
  process.exit(1);

} finally {
  if (connection) {
    await mongoose.disconnect();
    console.log('[Test]: Disconnected from MongoDB.');
  }
}
