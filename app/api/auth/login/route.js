import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { comparePassword, hashPassword, signToken, COOKIE_NAME, toSafeUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';
import { logAdminActivity } from '@/lib/logActivity';

/**
 * Constant-time string comparison to prevent timing attacks.
 */
function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(Buffer.alloc(bufA.length), Buffer.alloc(bufA.length));
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(req) {
  try {
    await connectToDatabase();

    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    // Rate Limit: 10 login attempts per 15 mins per IP
    const rateLimit = checkRateLimit(`login_${clientIp}`, 10, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json({ success: false, message: rateLimit.message }, { status: 429 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid payload.' }, { status: 400 });
    }

    const { email, password, rememberMe } = body || {};
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !password) {
      return NextResponse.json(
        { success: false, message: 'Please enter your email and password.' },
        { status: 400 }
      );
    }

    const configuredAdminEmail = (process.env.ADMIN_EMAIL || 'growthnestconnect@gmail.com').trim().toLowerCase();
    const configuredAdminPassword = process.env.ADMIN_PASSWORD || 'Vishal@123';

    let targetUser = null;
    let isAdminLogin = false;

    // 1. Check if input matches configured Admin credentials
    if (
      configuredAdminPassword &&
      timingSafeEqual(cleanEmail, configuredAdminEmail) &&
      timingSafeEqual(password, configuredAdminPassword)
    ) {
      isAdminLogin = true;

      // Ensure MongoDB has the corresponding Admin user document
      targetUser = await User.findOne({ email: cleanEmail }).select('+passwordHash');
      if (!targetUser) {
        const passwordHash = await hashPassword(password);
        targetUser = await User.create({
          fullName: 'GrowthNest Admin',
          email: cleanEmail,
          passwordHash,
          role: 'ADMIN',
          status: 'ACTIVE',
          emailVerified: true,
        });
      } else {
        let needsSave = false;
        if (targetUser.role !== 'ADMIN') {
          targetUser.role = 'ADMIN';
          needsSave = true;
        }
        if (targetUser.status !== 'ACTIVE') {
          targetUser.status = 'ACTIVE';
          needsSave = true;
        }
        // Sync password hash if changed
        const isHashCurrent = await comparePassword(password, targetUser.passwordHash);
        if (!isHashCurrent) {
          targetUser.passwordHash = await hashPassword(password);
          needsSave = true;
        }
        if (needsSave) {
          await targetUser.save();
        }
      }
    } else {
      // 2. Standard User / Existing Admin DB Lookup
      targetUser = await User.findOne({ email: cleanEmail }).select('+passwordHash');

      const genericErr = 'Invalid email or password.';
      if (!targetUser) {
        return NextResponse.json({ success: false, message: genericErr }, { status: 401 });
      }

      if (targetUser.status === 'INACTIVE') {
        return NextResponse.json(
          { success: false, message: 'Your account has been deactivated. Please contact support.' },
          { status: 403 }
        );
      }

      // Verify Password against stored hash
      const isPasswordValid = await comparePassword(password, targetUser.passwordHash);
      if (!isPasswordValid) {
        return NextResponse.json({ success: false, message: genericErr }, { status: 401 });
      }

      if ((targetUser.role || '').toUpperCase() === 'ADMIN') {
        isAdminLogin = true;
      }
    }

    if (!targetUser) {
      return NextResponse.json({ success: false, message: 'Invalid email or password.' }, { status: 401 });
    }

    // 3. Update lastLoginAt timestamp
    targetUser.lastLoginAt = new Date();
    await targetUser.save();

    const role = (targetUser.role || 'USER').toUpperCase();
    const safeUser = toSafeUser(targetUser);
    // Ensure role is explicitly set on safeUser
    safeUser.role = role;
    const userIdStr = targetUser._id.toString();

    // 4. Sign JWT Token & Set HTTP-Only Cookie
    const token = signToken(
      { id: userIdStr, email: targetUser.email, role, fullName: targetUser.fullName },
      rememberMe === true || rememberMe === 'true'
    );

    const maxAge = rememberMe
      ? 30 * 24 * 60 * 60
      : role === 'ADMIN'
      ? 12 * 60 * 60
      : 7 * 24 * 60 * 60;
    const isProd = process.env.NODE_ENV === 'production';

    // 5. If Admin, log the activity
    if (role === 'ADMIN') {
      await logAdminActivity({
        adminEmail: targetUser.email,
        adminName: targetUser.fullName,
        action: 'ADMIN_LOGIN',
        targetType: 'AUTH',
        targetId: userIdStr,
        details: 'Admin logged in via unified login portal.',
        req,
      });
    }

    const response = NextResponse.json(
      {
        success: true,
        message: 'Signed in successfully.',
        user: safeUser,
      },
      { status: 200 }
    );

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge,
    });

    return response;
  } catch (err) {
    console.error('[Login API Error]:', err.message);
    return NextResponse.json(
      { success: false, message: 'Failed to sign in. Please try again.' },
      { status: 500 }
    );
  }
}
