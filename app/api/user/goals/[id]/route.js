import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import { getCurrentUserFromReq } from '@/lib/auth';
import FinancialGoal from '@/models/FinancialGoal';
import { logActivity } from '@/lib/activityServer';

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const currentUser = await getCurrentUserFromReq(req);
    if (!currentUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid goal ID' }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const { name, targetAmount, currentAmount, monthlyContribution, targetDate, description, status } = body;

    const goal = await FinancialGoal.findOne({ _id: id, userId: currentUser.id });
    if (!goal) {
      return NextResponse.json({ success: false, message: 'Goal not found' }, { status: 404 });
    }

    if (name !== undefined) {
      const cleanName = String(name).trim();
      if (!cleanName) return NextResponse.json({ success: false, message: 'Goal name cannot be empty' }, { status: 400 });
      goal.name = cleanName;
    }

    if (targetAmount !== undefined) {
      const parsed = parseFloat(targetAmount);
      if (isNaN(parsed) || parsed <= 0) return NextResponse.json({ success: false, message: 'Target amount must be positive' }, { status: 400 });
      goal.targetAmount = parsed;
    }

    if (currentAmount !== undefined) {
      const parsed = parseFloat(currentAmount);
      if (isNaN(parsed) || parsed < 0) return NextResponse.json({ success: false, message: 'Current amount cannot be negative' }, { status: 400 });
      goal.currentAmount = parsed;
    }

    if (monthlyContribution !== undefined) {
      const parsed = parseFloat(monthlyContribution);
      if (!isNaN(parsed) && parsed >= 0) goal.monthlyContribution = parsed;
    }

    if (targetDate !== undefined) {
      goal.targetDate = targetDate ? new Date(targetDate) : null;
    }

    if (description !== undefined) {
      goal.description = String(description).trim();
    }

    if (status !== undefined) {
      const validStatuses = ['ACTIVE', 'ACHIEVED', 'PAUSED', 'ARCHIVED'];
      if (validStatuses.includes(status)) goal.status = status;
    } else if (goal.currentAmount >= goal.targetAmount) {
      goal.status = 'ACHIEVED';
    }

    await goal.save();

    await logActivity(
      currentUser.id,
      'UPDATE_GOAL',
      `Updated financial goal "${goal.name}"`,
      { goalId: goal._id.toString() }
    );

    return NextResponse.json({ success: true, message: 'Goal updated successfully', goal });
  } catch (err) {
    console.error('[PUT /api/user/goals/[id] Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to update goal' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const currentUser = await getCurrentUserFromReq(req);
    if (!currentUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid goal ID' }, { status: 400 });
    }

    const deleted = await FinancialGoal.findOneAndDelete({ _id: id, userId: currentUser.id });
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Goal not found' }, { status: 404 });
    }

    await logActivity(
      currentUser.id,
      'DELETE_GOAL',
      `Deleted financial goal "${deleted.name}"`,
      { goalId: deleted._id.toString() }
    );

    return NextResponse.json({ success: true, message: 'Goal deleted successfully' });
  } catch (err) {
    console.error('[DELETE /api/user/goals/[id] Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to delete goal' }, { status: 500 });
  }
}
