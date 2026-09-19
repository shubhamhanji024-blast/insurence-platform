import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import User from '@/models/User';
import { logAdminActivity } from '@/lib/logActivity';

// GET /api/admin/profile — Fetch current admin profile
export async function GET(req) {
  const { user: adminUser, error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    const admin = await User.findById(adminUser._id).select('-passwordHash -__v');
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Admin user not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        profile: {
          id: admin._id,
          fullName: admin.fullName,
          email: admin.email,
          phone: admin.phone || '',
          role: admin.role,
          status: admin.status || 'ACTIVE',
          createdAt: admin.createdAt,
          lastLoginAt: admin.lastLoginAt,
        },
      },
    });
  } catch (err) {
    console.error('[Admin Profile GET Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to fetch profile.' }, { status: 500 });
  }
}

// PUT /api/admin/profile — Update name, phone, or change password
export async function PUT(req) {
  const { user: adminUser, error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    let body;
    try { body = await req.json(); } catch {
      return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
    }

    const { fullName, phone, currentPassword, newPassword } = body || {};

    const admin = await User.findById(adminUser._id).select('+passwordHash');
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Admin account not found.' }, { status: 404 });
    }

    const updateFields = {};

    if (fullName !== undefined) {
      const name = String(fullName).trim();
      if (!name) return NextResponse.json({ success: false, message: 'Name cannot be empty.' }, { status: 400 });
      updateFields.fullName = name;
    }

    if (phone !== undefined) {
      updateFields.phone = String(phone).trim();
    }

    // Password change flow
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ success: false, message: 'Current password is required to set a new password.' }, { status: 400 });
      }

      if (newPassword.length < 8) {
        return NextResponse.json({ success: false, message: 'New password must be at least 8 characters.' }, { status: 400 });
      }

      const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
      if (!isMatch) {
        return NextResponse.json({ success: false, message: 'Current password is incorrect.' }, { status: 400 });
      }

      const salt = await bcrypt.genSalt(12);
      updateFields.passwordHash = await bcrypt.hash(newPassword, salt);
    }

    const updated = await User.findByIdAndUpdate(
      adminUser._id,
      { $set: updateFields },
      { new: true, select: '-passwordHash -__v' }
    );

    await logAdminActivity({
      adminEmail: admin.email,
      adminName: updated.fullName,
      action: newPassword ? 'PASSWORD_CHANGED' : 'PROFILE_UPDATED',
      targetType: 'ADMIN',
      targetId: admin._id.toString(),
      details: newPassword ? 'Changed admin password and profile details' : 'Updated admin profile details',
      req,
    });

    return NextResponse.json({
      success: true,
      message: newPassword ? 'Profile and password updated successfully.' : 'Profile updated successfully.',
      data: {
        profile: {
          id: updated._id,
          fullName: updated.fullName,
          email: updated.email,
          phone: updated.phone || '',
          role: updated.role,
          status: updated.status || 'ACTIVE',
          createdAt: updated.createdAt,
          lastLoginAt: updated.lastLoginAt,
        },
      },
    });
  } catch (err) {
    console.error('[Admin Profile Update Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to update profile.' }, { status: 500 });
  }
}
