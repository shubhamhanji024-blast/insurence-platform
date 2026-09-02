import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { getCurrentUserFromReq, comparePassword, hashPassword, checkPasswordStrength } from '@/lib/auth';
import User from '@/models/User';
import { logActivity } from '@/lib/activityServer';

export async function POST(req) {
  try {
    await connectToDatabase();
    const user = await getCurrentUserFromReq(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { currentPassword, newPassword, confirmPassword } = body;

    const errors = {};

    if (!currentPassword) {
      errors.currentPassword = 'Current password is required.';
    }

    if (!newPassword) {
      errors.newPassword = 'New password is required.';
    } else if (newPassword.length < 8) {
      errors.newPassword = 'New password must be at least 8 characters long.';
    } else {
      const strength = checkPasswordStrength(newPassword);
      if (!strength.isStrongEnough) {
        errors.newPassword = 'New password must contain uppercase, lowercase, and numbers.';
      }
    }

    if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors, message: 'Validation failed.' }, { status: 400 });
    }

    // Fetch full user record including passwordHash
    const dbUser = await User.findById(user.id).select('+passwordHash');

    if (!dbUser) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }

    const isMatch = await comparePassword(currentPassword, dbUser.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, errors: { currentPassword: 'Current password is incorrect.' }, message: 'Current password is incorrect.' },
        { status: 400 }
      );
    }

    const newHash = await hashPassword(newPassword);
    dbUser.passwordHash = newHash;
    await dbUser.save();

    await logActivity(
      user.id,
      'CHANGE_PASSWORD',
      'Changed account password'
    );

    return NextResponse.json({ success: true, message: 'Password changed successfully!' });
  } catch (err) {
    console.error('[POST /api/auth/change-password Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to change password.' }, { status: 500 });
  }
}
