import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import VerificationToken from '@/models/VerificationToken';

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email')?.toLowerCase();

    if (!token || !email) {
      return NextResponse.json({ success: false, message: 'Invalid token or email.' }, { status: 400 });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const record = await VerificationToken.findOne({
      email,
      tokenHash,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!record) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired email verification link.' },
        { status: 400 }
      );
    }

    await User.findOneAndUpdate({ email }, { emailVerified: true });
    record.used = true;
    await record.save();

    // Redirect to login with success indicator
    return NextResponse.redirect(new URL('/login?verified=true', req.url));
  } catch (err) {
    console.error('[Verify Email GET Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Verification failed.' }, { status: 500 });
  }
}
