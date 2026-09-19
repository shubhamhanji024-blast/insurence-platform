import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { comparePassword, hashPassword, signToken, COOKIE_NAME, toSafeUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';
import { logAdminActivity } from '@/lib/logActivity';

export async function POST(req) {
  try {
    await connectToDatabase();

    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    // Rate Limit: 10 admin login attempts per 15 mins
    const rateLimit = checkRateLimit(`admin_login_${clientIp}`, 10, 15 * 60 * 1000);
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
        { success: false, message: 'Invalid admin email or password.' },
        { status: 400 }
      );
    }

    const configuredAdminEmail = (process.env.ADMIN_EMAIL || 'shubhamhanji024@gmail.com').trim().toLowerCase();
    const configuredAdminPassword = process.env.ADMIN_PASSWORD;

    let adminAuthenticated = false;
    let targetUser = await User.findOne({ email: cleanEmail }).select('+passwordHash');

    // 1. Check against securely stored environment variable credentials
    if (
      configuredAdminPassword &&
      cleanEmail === configuredAdminEmail &&
      password === configuredAdminPassword
    ) {
      adminAuthenticated = true;

      // Ensure MongoDB user is provisioned with role: ADMIN and hashed password
      if (!targetUser) {
        const passwordHash = await hashPassword(password);
        targetUser = await User.create({
          fullName: 'Shubham Hanji',
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
    } else if (targetUser && targetUser.role === 'ADMIN' && targetUser.status !== 'INACTIVE') {
      // 2. Fallback check against securely hashed MongoDB password for existing admins
      const isPasswordValid = await comparePassword(password, targetUser.passwordHash);
      if (isPasswordValid) {
        adminAuthenticated = true;
      }
    }

    if (!adminAuthenticated || !targetUser || targetUser.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Invalid admin email or password.' },
        { status: 401 }
      );
    }

    // Update lastLoginAt
    targetUser.lastLoginAt = new Date();
    await targetUser.save();

    const safeUser = toSafeUser(targetUser);
    const userIdStr = targetUser._id.toString();

    // Sign JWT session token
    const token = signToken(
      { id: userIdStr, email: targetUser.email, role: 'ADMIN', fullName: targetUser.fullName },
      rememberMe === true || rememberMe === 'true'
    );

    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 12 * 60 * 60; // 12 hours default for admin
    const isProd = process.env.NODE_ENV === 'production';

    // Log Activity
    await logAdminActivity({
      adminEmail: targetUser.email,
      adminName: targetUser.fullName,
      action: 'ADMIN_LOGIN',
      targetType: 'AUTH',
      targetId: userIdStr,
      details: 'Admin authenticated successfully via dedicated admin credentials.',
      req,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: 'Administrator authenticated successfully.',
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
    console.error('[Admin Login API Error]:', err.message);
    return NextResponse.json(
      { success: false, message: 'Administrative authentication failed.' },
      { status: 500 }
    );
  }
}
