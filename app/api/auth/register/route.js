import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword, checkPasswordStrength, signToken, COOKIE_NAME, toSafeUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';
import { isValidEmail, isValidPhone, sanitizeText } from '@/lib/sanitizer';

export async function POST(req) {
  try {
    await connectToDatabase();

    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    // Rate limit: 5 registrations per 15 mins per IP
    const rateLimit = checkRateLimit(`register_${clientIp}`, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json({ success: false, message: rateLimit.message }, { status: 429 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid payload.' }, { status: 400 });
    }

    const { fullName, email, phone, password, confirmPassword, agreeTerms } = body || {};
    const errors = {};

    const cleanName = sanitizeText(fullName);
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = (phone || '').trim();

    // 1. Validate Full Name
    if (!cleanName) {
      errors.fullName = 'Please enter your full name.';
    } else if (cleanName.length < 2) {
      errors.fullName = 'Full name must contain at least 2 characters.';
    } else if (cleanName.length > 100) {
      errors.fullName = 'Full name cannot exceed 100 characters.';
    }

    // 2. Validate Email
    if (!cleanEmail) {
      errors.email = 'Please enter your email address.';
    } else if (!isValidEmail(cleanEmail)) {
      errors.email = 'Please enter a valid email address.';
    }

    // 3. Validate Phone (Optional)
    if (cleanPhone && !isValidPhone(cleanPhone)) {
      errors.phone = 'Please enter a valid phone number.';
    }

    // 4. Validate Password
    if (!password) {
      errors.password = 'Please enter a password.';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    } else if (password.length > 128) {
      errors.password = 'Password cannot exceed 128 characters.';
    } else {
      const strength = checkPasswordStrength(password);
      if (!strength.isStrongEnough) {
        errors.password = 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.';
      }
    }

    // 5. Confirm Password
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    // 6. Terms Checkbox
    if (agreeTerms !== true && agreeTerms !== 'true') {
      errors.agreeTerms = 'You must agree to the Terms of Service and Privacy Policy.';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, message: 'Please fix the validation errors below.', errors },
        { status: 400 }
      );
    }

    // 7. Check if Email Already Exists
    const existingUser = await User.findOne({ email: cleanEmail });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'An account with this email already exists.',
          errors: { email: 'An account with this email already exists.' },
        },
        { status: 400 }
      );
    }

    // 8. Hash Password & Create User in MongoDB users collection
    const passwordHash = await hashPassword(password);
    const newUser = await User.create({
      fullName: cleanName,
      email: cleanEmail,
      phone: cleanPhone || null,
      passwordHash,
      role: 'USER',
      emailVerified: false,
    });

    const safeUser = toSafeUser(newUser);

    // 9. Sign JWT & Set HTTP-Only Cookie
    const userIdStr = newUser._id.toString();
    const token = signToken({ id: userIdStr, email: newUser.email, role: newUser.role, fullName: newUser.fullName });
    const response = NextResponse.json(
      {
        success: true,
        message: 'Account created successfully.',
        user: safeUser,
      },
      { status: 201 }
    );

    const isProd = process.env.NODE_ENV === 'production';
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err) {
    console.error('[Register API Error]:', err.message);
    return NextResponse.json(
      { success: false, message: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}
