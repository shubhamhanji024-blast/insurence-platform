import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import User from '@/models/User';
import FinancialGoal from '@/models/FinancialGoal';
import SavedCalculation from '@/models/SavedCalculation';

// GET /api/admin/users/[id] — User detail (no secrets)
export async function GET(req, { params }) {
  const { user: adminUser, error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    const { id } = await params;

    const targetUser = await User.findById(id).select('-passwordHash -__v');
    if (!targetUser) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }

    const [goalCount, calcCount, recentGoals] = await Promise.all([
      FinancialGoal.countDocuments({ userId: id }),
      SavedCalculation.countDocuments({ userId: id }),
      FinancialGoal.find({ userId: id }).sort({ createdAt: -1 }).limit(5).select('name goalType status targetAmount createdAt'),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        user: targetUser,
        stats: { goalCount, calcCount },
        recentGoals,
      },
    });
  } catch (err) {
    console.error('[Admin User Detail GET Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to fetch user.' }, { status: 500 });
  }
}

// PATCH /api/admin/users/[id] — Update user role
export async function PATCH(req, { params }) {
  const { user: adminUser, error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    const { id } = await params;

    let body;
    try { body = await req.json(); } catch {
      return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
    }

    const { role } = body || {};
    if (!role || !['USER', 'ADMIN'].includes(role)) {
      return NextResponse.json({ success: false, message: 'Invalid role. Must be USER or ADMIN.' }, { status: 400 });
    }

    // Prevent removing the last admin
    if (role === 'USER') {
      const targetUser = await User.findById(id);
      if (!targetUser) {
        return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
      }
      if (targetUser.role === 'ADMIN') {
        const adminCount = await User.countDocuments({ role: 'ADMIN' });
        if (adminCount <= 1) {
          return NextResponse.json({
            success: false,
            message: 'Cannot demote the last administrator. Please promote another user to ADMIN first.',
          }, { status: 400 });
        }
      }
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, select: '-passwordHash -__v' }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `User role updated to ${role}.`,
      data: { user: updated },
    });
  } catch (err) {
    console.error('[Admin User PATCH Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to update user.' }, { status: 500 });
  }
}
