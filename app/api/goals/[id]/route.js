import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { getCurrentUserFromReq } from '@/lib/auth';
import FinancialGoal from '@/models/FinancialGoal';
import { logActivity } from '@/lib/activityServer';

const GOAL_TYPE_MAP = {
  'Retirement': 'RETIREMENT',
  'Home Purchase': 'HOME_PURCHASE',
  'Emergency Fund': 'EMERGENCY_FUND',
  'Education': 'EDUCATION',
  'Vehicle': 'VEHICLE',
  'Travel': 'TRAVEL',
  'Investment': 'INVESTMENT',
  'Other': 'OTHER',
  'RETIREMENT': 'RETIREMENT',
  'HOME_PURCHASE': 'HOME_PURCHASE',
  'EMERGENCY_FUND': 'EMERGENCY_FUND',
  'EDUCATION': 'EDUCATION',
  'VEHICLE': 'VEHICLE',
  'TRAVEL': 'TRAVEL',
  'INVESTMENT': 'INVESTMENT',
  'OTHER': 'OTHER',
};

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const user = await getCurrentUserFromReq(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const goal = await FinancialGoal.findById(id);

    if (!goal || goal.userId.toString() !== user.id) {
      return NextResponse.json({ success: false, message: 'Goal not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, goal });
  } catch (err) {
    console.error('[GET /api/goals/[id] Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectToDatabase();
    const user = await getCurrentUserFromReq(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const existingGoal = await FinancialGoal.findById(id);

    if (!existingGoal || existingGoal.userId.toString() !== user.id) {
      return NextResponse.json({ success: false, message: 'Goal not found.' }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const { name, goalType, targetAmount, currentAmount, targetDate, description, status } = body;

    if (name !== undefined) {
      const cleanName = typeof name === 'string' ? name.trim() : '';
      if (!cleanName || cleanName.length > 100) {
        return NextResponse.json({ success: false, message: 'Invalid goal name.' }, { status: 400 });
      }
      existingGoal.name = cleanName;
    }

    if (goalType !== undefined) {
      const mappedType = GOAL_TYPE_MAP[goalType];
      if (!mappedType) {
        return NextResponse.json({ success: false, message: 'Invalid goal type.' }, { status: 400 });
      }
      existingGoal.goalType = mappedType;
    }

    if (targetAmount !== undefined) {
      const pTarget = parseFloat(targetAmount);
      if (isNaN(pTarget) || pTarget <= 0) {
        return NextResponse.json({ success: false, message: 'Target amount must be > 0.' }, { status: 400 });
      }
      existingGoal.targetAmount = pTarget;
    }

    if (currentAmount !== undefined) {
      const pCurrent = parseFloat(currentAmount);
      if (isNaN(pCurrent) || pCurrent < 0) {
        return NextResponse.json({ success: false, message: 'Current amount cannot be negative.' }, { status: 400 });
      }
      existingGoal.currentAmount = pCurrent;
    }

    if (targetDate !== undefined) {
      if (!targetDate) {
        existingGoal.targetDate = null;
      } else {
        const d = new Date(targetDate);
        if (isNaN(d.getTime())) {
          return NextResponse.json({ success: false, message: 'Invalid target date.' }, { status: 400 });
        }
        existingGoal.targetDate = d;
      }
    }

    if (description !== undefined) {
      const cleanDesc = typeof description === 'string' ? description.trim() : '';
      if (cleanDesc.length > 1000) {
        return NextResponse.json({ success: false, message: 'Description too long.' }, { status: 400 });
      }
      existingGoal.description = cleanDesc || '';
    }

    if (status !== undefined && ['ACTIVE', 'ACHIEVED', 'PAUSED', 'ARCHIVED'].includes(status)) {
      existingGoal.status = status;
    } else {
      existingGoal.status = existingGoal.currentAmount >= existingGoal.targetAmount ? 'ACHIEVED' : 'ACTIVE';
    }

    const updatedGoal = await existingGoal.save();

    await logActivity(
      user.id,
      'UPDATE_GOAL',
      `Updated financial goal "${updatedGoal.name}"`,
      { goalId: id, currentAmount: updatedGoal.currentAmount, targetAmount: updatedGoal.targetAmount }
    );

    return NextResponse.json({ success: true, goal: updatedGoal, message: 'Goal updated successfully!' });
  } catch (err) {
    console.error('[PATCH /api/goals/[id] Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to update goal.' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const user = await getCurrentUserFromReq(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const existingGoal = await FinancialGoal.findById(id);

    if (!existingGoal || existingGoal.userId.toString() !== user.id) {
      return NextResponse.json({ success: false, message: 'Goal not found.' }, { status: 404 });
    }

    await FinancialGoal.findByIdAndDelete(id);

    await logActivity(
      user.id,
      'DELETE_GOAL',
      `Deleted financial goal "${existingGoal.name}"`,
      { goalId: id }
    );

    return NextResponse.json({ success: true, message: 'Goal deleted successfully.' });
  } catch (err) {
    console.error('[DELETE /api/goals/[id] Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to delete goal.' }, { status: 500 });
  }
}
