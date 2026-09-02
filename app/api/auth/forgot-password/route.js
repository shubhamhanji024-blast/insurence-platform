import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import PasswordResetToken from '@/models/PasswordResetToken';
import { checkRateLimit } from '@/lib/rateLimit';
import { isValidEmail } from '@/lib/sanitizer';

export async function POST(req) {
  try {
    await connectToDatabase();

    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    // Rate Limit: 5 forgot password requests per 15 mins per IP
    const rateLimit = checkRateLimit(`forgot_${clientIp}`, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json({ success: false, message: rateLimit.message }, { status: 429 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid payload.' }, { status: 400 });
    }

    const { email } = body || {};
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Always return generic message for security
    const genericSuccess = {
      success: true,
      message: 'If an account exists for this email, a password reset link has been sent.',
    };

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return NextResponse.json(genericSuccess, { status: 200 });
    }

    // Generate secure random token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Save reset token in MongoDB password_reset_tokens collection
    await PasswordResetToken.create({
      email: cleanEmail,
      tokenHash,
      expiresAt,
      used: false,
    });

    // Send email if configured
    if (process.env.EMAIL_ENABLED === 'true') {
      try {
        const nodemailer = await import('nodemailer');
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_SERVER_HOST,
          port: Number(process.env.EMAIL_SERVER_PORT) || 587,
          secure: Number(process.env.EMAIL_SERVER_PORT) === 465,
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        });

        const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password?token=${rawToken}&email=${encodeURIComponent(cleanEmail)}`;

        await transporter.sendMail({
          from: process.env.EMAIL_FROM || 'GrowthNest <no-reply@growthnest.com>',
          to: cleanEmail,
          subject: 'Reset Your Password — GrowthNest',
          text: `Hello ${user.fullName},\n\nWe received a request to reset your GrowthNest account password. Click the link below to set a new password:\n\n${resetUrl}\n\nThis link expires in 30 minutes. If you did not request this, please ignore this email.\n\nBest regards,\nGrowthNest Security Team`,
        });
      } catch (err) {
        console.error('[Forgot Password Email Error]:', err.message);
      }
    }

    return NextResponse.json(genericSuccess, { status: 200 });
  } catch (err) {
    console.error('[Forgot Password API Error]:', err.message);
    return NextResponse.json(
      { success: false, message: 'Unable to process password reset request.' },
      { status: 500 }
    );
  }
}
