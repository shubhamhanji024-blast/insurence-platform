import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { getCurrentUserFromReq } from '@/lib/auth';
import User from '@/models/User';
import { logActivity } from '@/lib/activityServer';

export async function GET(req) {
  try {
    await connectToDatabase();
    const currentUser = await getCurrentUserFromReq(req);
    if (!currentUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findById(currentUser.id).select('-passwordHash -__v');
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        createdAt: user.createdAt,
        emailVerified: user.emailVerified,
      },
    });
  } catch (err) {
    console.error('[GET /api/user/profile Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectToDatabase();
    const currentUser = await getCurrentUserFromReq(req);
    if (!currentUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { fullName, phone } = body;

    const errors = {};

    const cleanName = typeof fullName === 'string' ? fullName.trim() : '';
    if (!cleanName) {
      errors.fullName = 'Full name is required.';
    } else if (cleanName.length < 2) {
      errors.fullName = 'Full name must be at least 2 characters.';
    } else if (cleanName.length > 80) {
      errors.fullName = 'Full name cannot exceed 80 characters.';
    }

    let cleanPhone = null;
    if (phone !== undefined && phone !== null && phone !== '') {
      const strippedPhone = String(phone).replace(/[\s\-\(\)\+]/g, '');
      if (!/^\d{7,15}$/.test(strippedPhone)) {
        errors.phone = 'Please enter a valid phone number (7-15 digits).';
      } else {
        cleanPhone = String(phone).trim();
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors, message: 'Validation failed.' }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      currentUser.id,
      {
        $set: {
          fullName: cleanName,
          phone: cleanPhone,
        },
      },
      { new: true, runValidators: true }
    ).select('-passwordHash -__v');

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    await logActivity(
      currentUser.id,
      'UPDATE_PROFILE',
      'Updated personal profile information',
      { updatedFields: ['fullName', cleanPhone ? 'phone' : null].filter(Boolean) }
    );

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: updatedUser._id.toString(),
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone || '',
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
        emailVerified: updatedUser.emailVerified,
      },
    });
  } catch (err) {
    console.error('[PUT /api/user/profile Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to update profile.' }, { status: 500 });
  }
}
