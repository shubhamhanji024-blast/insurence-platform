import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { getCurrentUserFromReq, toSafeUser } from '@/lib/auth';
import User from '@/models/User';
import { logActivity } from '@/lib/activityServer';

export async function PATCH(req) {
  try {
    await connectToDatabase();
    const user = await getCurrentUserFromReq(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { fullName, phone } = body;

    const errors = {};

    const cleanName = typeof fullName === 'string' ? fullName.trim() : '';
    if (!cleanName) {
      errors.fullName = 'Full name is required.';
    } else if (cleanName.length < 2) {
      errors.fullName = 'Name must be at least 2 characters.';
    } else if (cleanName.length > 100) {
      errors.fullName = 'Name cannot exceed 100 characters.';
    }

    let cleanPhone = null;
    if (phone) {
      const numPhone = String(phone).replace(/[\s\-\(\)\+]/g, '');
      if (!/^\d{7,15}$/.test(numPhone)) {
        errors.phone = 'Please enter a valid phone number.';
      } else {
        cleanPhone = String(phone).trim();
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors, message: 'Validation failed.' }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      {
        fullName: cleanName,
        phone: cleanPhone,
      },
      { new: true }
    );

    await logActivity(
      user.id,
      'UPDATE_PROFILE',
      `Updated profile details (${cleanName})`
    );

    return NextResponse.json({
      success: true,
      user: toSafeUser(updatedUser),
      message: 'Profile updated successfully!',
    });
  } catch (err) {
    console.error('[PATCH /api/auth/profile Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to update profile.' }, { status: 500 });
  }
}
