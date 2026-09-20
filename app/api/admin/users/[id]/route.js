import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import User from '@/models/User';
import FinancialGoal from '@/models/FinancialGoal';
import SavedCalculation from '@/models/SavedCalculation';
import { logAdminActivity } from '@/lib/logActivity';
import { isValidObjectId } from '@/lib/validateObjectId';

// GET /api/admin/users/[id] — User detail (no secrets)
export async function GET(req, { params }) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }

    const targetUser = await User.findById(id).select('-passwordHash -__v');
    if (!targetUser) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }

    const [goalCount, calcCount, recentGoals, recentCalculations] = await Promise.all([
      FinancialGoal.countDocuments({ userId: id }),
      SavedCalculation.countDocuments({ userId: id }),
      FinancialGoal.find({ userId: id }).sort({ createdAt: -1 }).limit(10).select('name goalType status targetAmount createdAt'),
      SavedCalculation.find({ userId: id }).sort({ createdAt: -1 }).limit(10).select('calculatorType calculationData createdAt'),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        user: targetUser,
        stats: { goalCount, calcCount },
        recentGoals,
        recentCalculations,
      },
    });
  } catch (err) {
    console.error('[Admin User Detail GET Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to fetch user.' }, { status: 500 });
  }
}

// PUT / PATCH /api/admin/users/[id] — Update user details / role / status
export async function PUT(req, { params }) {
  return handleUpdate(req, params);
}

export async function PATCH(req, { params }) {
  return handleUpdate(req, params);
}

async function handleUpdate(req, params) {
  const { user: adminUser, error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }

    let body;
    try { body = await req.json(); } catch {
      return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }

    const updateFields = {};

    if (body.fullName !== undefined) {
      const name = String(body.fullName).trim();
      if (!name) return NextResponse.json({ success: false, message: 'Name cannot be empty.' }, { status: 400 });
      updateFields.fullName = name;
    }

    if (body.phone !== undefined) {
      updateFields.phone = String(body.phone || '').trim();
    }

    if (body.status !== undefined) {
      const status = String(body.status).toUpperCase();
      if (!['ACTIVE', 'INACTIVE'].includes(status)) {
        return NextResponse.json({ success: false, message: 'Status must be ACTIVE or INACTIVE.' }, { status: 400 });
      }
      if (status === 'INACTIVE' && targetUser._id.toString() === adminUser._id.toString()) {
        return NextResponse.json({ success: false, message: 'You cannot deactivate your own admin account.' }, { status: 400 });
      }
      updateFields.status = status;
    }

    if (body.role !== undefined) {
      const role = String(body.role).toUpperCase();
      if (!['USER', 'ADMIN'].includes(role)) {
        return NextResponse.json({ success: false, message: 'Role must be USER or ADMIN.' }, { status: 400 });
      }
      // Prevent demoting the last admin or demoting self
      if (role === 'USER' && targetUser.role === 'ADMIN') {
        if (targetUser._id.toString() === adminUser._id.toString()) {
          return NextResponse.json({ success: false, message: 'You cannot demote your own account from ADMIN.' }, { status: 400 });
        }
        const adminCount = await User.countDocuments({ role: 'ADMIN' });
        if (adminCount <= 1) {
          return NextResponse.json({
            success: false,
            message: 'Cannot demote the last administrator. Promote another user to ADMIN first.',
          }, { status: 400 });
        }
      }
      updateFields.role = role;
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, select: '-passwordHash -__v' }
    );

    await logAdminActivity({
      adminEmail: adminUser.email,
      adminName: adminUser.fullName,
      action: 'USER_UPDATED',
      targetType: 'USER',
      targetId: id,
      details: `Updated fields: ${Object.keys(updateFields).join(', ')} for ${updated.email}`,
      req,
    });

    return NextResponse.json({
      success: true,
      message: 'User updated successfully.',
      data: { user: updated },
    });
  } catch (err) {
    console.error('[Admin User Update Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to update user.' }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id] — Delete user
export async function DELETE(req, { params }) {
  const { user: adminUser, error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }

    if (targetUser._id.toString() === adminUser._id.toString()) {
      return NextResponse.json({ success: false, message: 'You cannot delete your own admin account.' }, { status: 400 });
    }

    if (targetUser.role === 'ADMIN') {
      const adminCount = await User.countDocuments({ role: 'ADMIN' });
      if (adminCount <= 1) {
        return NextResponse.json({ success: false, message: 'Cannot delete the only administrator account.' }, { status: 400 });
      }
    }

    await User.findByIdAndDelete(id);

    await logAdminActivity({
      adminEmail: adminUser.email,
      adminName: adminUser.fullName,
      action: 'USER_DELETED',
      targetType: 'USER',
      targetId: id,
      details: `Deleted user ${targetUser.email} (${targetUser.fullName})`,
      req,
    });

    return NextResponse.json({
      success: true,
      message: `User ${targetUser.email} deleted successfully.`,
    });
  } catch (err) {
    console.error('[Admin User DELETE Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to delete user.' }, { status: 500 });
  }
}
