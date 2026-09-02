import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectToDatabase from '@/lib/mongodb';
import VerificationToken from '@/models/VerificationToken';
import { getCurrentUserFromReq } from '@/lib/auth';

export async function POST(req) {
  try {
    await connectToDatabase();
    const currentUser = await getCurrentUserFromReq(req);

    if (!currentUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    }

    if (currentUser.emailVerified) {
      return NextResponse.json(
        { success: true, message: 'Email is already verified.' },
        { status: 200 }
      );
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await VerificationToken.create({
      email: currentUser.email,
      tokenHash,
      expiresAt,
      used: false,
    });

    // Optional email sending logic when SMTP is configured
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

        const verifyUrl = `${process.env.APP_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${rawToken}&email=${encodeURIComponent(currentUser.email)}`;

        await transporter.sendMail({
          from: process.env.EMAIL_FROM || 'GrowthNest <no-reply@growthnest.com>',
          to: currentUser.email,
          subject: 'Verify Your Email Address — GrowthNest',
          text: `Hello ${currentUser.fullName},\n\nPlease verify your email address by clicking the link below:\n\n${verifyUrl}\n\nThank you,\nGrowthNest Team`,
        });
      } catch (err) {
        console.error('[Send Verification Email Error]:', err.message);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Verification link generated. (Email integration ready when SMTP is enabled).',
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[Send Verification Error]:', err.message);
    return NextResponse.json(
      { success: false, message: 'Failed to generate verification request.' },
      { status: 500 }
    );
  }
}
