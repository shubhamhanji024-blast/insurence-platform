import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import PasswordResetToken from '@/models/PasswordResetToken';
import { hashPassword, checkPasswordStrength } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(req) {
  try {
    await connectToDatabase();

    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    // Rate limit
    const rateLimit = checkRateLimit(`reset_${clientIp}`, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json({ success: false, message: rateLimit.message }, { status: 429 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid payload.' }, { status: 400 });
    }

    const { email, token, newPassword, confirmPassword } = body || {};
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !token || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Missing required reset token or password details.' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Passwords do not match.', errors: { confirmPassword: 'Passwords do not match.' } },
        { status: 400 }
      );
    }

    const strength = checkPasswordStrength(newPassword);
    if (!strength.isStrongEnough) {
      return NextResponse.json(
        {
          success: false,
          message: 'Password must be at least 8 characters long with uppercase, lowercase, and numbers.',
          errors: { newPassword: 'Password must contain uppercase, lowercase, and numbers.' },
        },
        { status: 400 }
      );
    }

    // Hash token to query DB
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const resetTokenRecord = await PasswordResetToken.findOne({
      email: cleanEmail,
      tokenHash,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetTokenRecord) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid or expired password reset link. Please request a new link.',
        },
        { status: 400 }
      );
    }

    // Hash new password and update user record
    const newPasswordHash = await hashPassword(newPassword);

    await User.findOneAndUpdate({ email: cleanEmail }, { passwordHash: newPasswordHash });
    resetTokenRecord.used = true;
    await resetTokenRecord.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Password has been reset successfully. You can now log in with your new password.',
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[Reset Password API Error]:', err.message);
    return NextResponse.json(
      { success: false, message: 'Failed to reset password. Please try again.' },
      { status: 500 }
    );
  }
}
