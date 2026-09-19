import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { comparePassword, signToken, COOKIE_NAME, toSafeUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';
import { logAdminActivity } from '@/lib/logActivity';

export async function POST(req) {
  try {
    await connectToDatabase();

    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    // Rate Limit: 8 admin login attempts per 15 mins
    const rateLimit = checkRateLimit(`admin_login_${clientIp}`, 8, 15 * 60 * 1000);
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
        { success: false, message: 'Please enter your admin email and password.' },
        { status: 400 }
      );
    }

    // 1. Find User by Email
    const user = await User.findOne({ email: cleanEmail }).select('+passwordHash');
    const genericErr = 'Invalid administrative credentials.';

    if (!user) {
      return NextResponse.json({ success: false, message: genericErr }, { status: 401 });
    }

    // 2. Strict Role Check: Must be ADMIN
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Access denied. You do not have administrator permissions.' },
        { status: 403 }
      );
    }

    // 3. Compare Password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: genericErr }, { status: 401 });
    }

    // 4. Update lastLoginAt
    user.lastLoginAt = new Date();
    await user.save();

    const safeUser = toSafeUser(user);
    const userIdStr = user._id.toString();

    // 5. Sign Token & Cookie
    const token = signToken(
      { id: userIdStr, email: user.email, role: user.role, fullName: user.fullName },
      rememberMe === true || rememberMe === 'true'
    );

    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 12 * 60 * 60; // 12 hours default for admin
    const isProd = process.env.NODE_ENV === 'production';

    // 6. Log Activity
    await logAdminActivity({
      adminEmail: user.email,
      adminName: user.fullName,
      action: 'ADMIN_LOGIN',
      targetType: 'AUTH',
      targetId: userIdStr,
      details: 'Admin successfully authenticated into console.',
      req,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: 'Administrator signed in successfully.',
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
