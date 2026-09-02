/**
 * GrowthNest Admin Seeding Script
 * ────────────────────────────────
 * Usage:
 *   node scripts/seed-admin.mjs <user-email> [admin-password]
 */

import dns from 'dns';
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch {
  // Ignore DNS set failures
}

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

if (!process.env.MONGODB_URI) {
  try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || '';
          if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
            value = value.replace(/^"|"$/g, '');
          }
          process.env[key] = value.trim();
        }
      });
    }
  } catch (e) {
    console.error('Warning: could not read .env file:', e.message);
  }
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is missing.');
  process.exit(1);
}

const targetEmail = process.argv[2]?.trim()?.toLowerCase();

if (!targetEmail) {
  console.log('Usage: node scripts/seed-admin.mjs <user-email> [admin-password]');
  process.exit(1);
}

const targetPassword = process.argv[3] || 'Admin12345!';

async function seedAdmin() {
  try {
    console.log('[SeedAdmin] Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, { dbName: 'growthnest', family: 4 });
    console.log('[SeedAdmin] Connected successfully to database "growthnest"');

    const UserSchema = new mongoose.Schema({
      fullName: String,
      email: { type: String, unique: true },
      phone: String,
      passwordHash: String,
      role: { type: String, default: 'USER' },
      emailVerified: { type: Boolean, default: false },
    }, { timestamps: true });

    const User = mongoose.models.User || mongoose.model('User', UserSchema, 'users');

    const existingUser = await User.findOne({ email: targetEmail });

    if (existingUser) {
      existingUser.role = 'ADMIN';
      existingUser.emailVerified = true;
      await existingUser.save();
      console.log(`✅ User "${targetEmail}" was successfully elevated to ADMIN role.`);
    } else {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(targetPassword, salt);

      const newAdmin = await User.create({
        fullName: 'GrowthNest Admin',
        email: targetEmail,
        passwordHash,
        role: 'ADMIN',
        emailVerified: true,
      });

      console.log(`✅ Created new ADMIN user: "${targetEmail}" with ID: ${newAdmin._id}`);
    }

    await mongoose.disconnect();
    console.log('[SeedAdmin] Done!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Admin Seeding Error:', err.message);
    process.exit(1);
  }
}

seedAdmin();
