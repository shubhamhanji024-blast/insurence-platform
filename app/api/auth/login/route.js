import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { comparePassword, signToken, COOKIE_NAME, toSafeUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';

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

    // 1. Find User by Email (include passwordHash for comparison)
    const user = await User.findOne({ email: cleanEmail }).select('+passwordHash');
    const genericErr = 'Invalid email or password.';

    if (!user) {
      return NextResponse.json({ success: false, message: genericErr }, { status: 401 });
    }

    // 2. Compare Password Hash
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: genericErr }, { status: 401 });
    }

    // 3. Update lastLoginAt timestamp
    user.lastLoginAt = new Date();
    await user.save();

    const safeUser = toSafeUser(user);
    const userIdStr = user._id.toString();

    // 4. Sign JWT Token & Set HTTP-Only Cookie
    const token = signToken(
      { id: userIdStr, email: user.email, role: user.role, fullName: user.fullName },
      rememberMe === true || rememberMe === 'true'
    );

    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60; // 30d vs 7d
    const isProd = process.env.NODE_ENV === 'production';

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
