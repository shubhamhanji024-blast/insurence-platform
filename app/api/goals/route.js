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

export async function GET(req) {
  try {
    await connectToDatabase();
    const user = await getCurrentUserFromReq(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const goals = await FinancialGoal.find({ userId: user.id }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, goals });
  } catch (err) {
    console.error('[GET /api/goals Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to fetch financial goals.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const user = await getCurrentUserFromReq(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { name, goalType, targetAmount, currentAmount = 0, targetDate, description } = body;

    const errors = {};

    const cleanName = typeof name === 'string' ? name.trim() : '';
    if (!cleanName) {
      errors.name = 'Goal name is required.';
    } else if (cleanName.length > 100) {
      errors.name = 'Goal name cannot exceed 100 characters.';
    }

    const mappedType = GOAL_TYPE_MAP[goalType];
    if (!goalType || !mappedType) {
      errors.goalType = 'Please select a valid goal type.';
    }

    const parsedTarget = parseFloat(targetAmount);
    if (isNaN(parsedTarget) || parsedTarget <= 0) {
      errors.targetAmount = 'Target amount must be a number greater than 0.';
    }

    const parsedCurrent = parseFloat(currentAmount);
    if (isNaN(parsedCurrent) || parsedCurrent < 0) {
      errors.currentAmount = 'Current amount cannot be negative.';
    }

    let parsedTargetDate = null;
    if (targetDate) {
      const d = new Date(targetDate);
      if (isNaN(d.getTime())) {
        errors.targetDate = 'Invalid target date.';
      } else {
        parsedTargetDate = d;
      }
    }

    const cleanDescription = typeof description === 'string' ? description.trim() : '';
    if (cleanDescription.length > 1000) {
      errors.description = 'Description cannot exceed 1000 characters.';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors, message: 'Validation failed.' }, { status: 400 });
    }

    const status = parsedCurrent >= parsedTarget ? 'ACHIEVED' : 'ACTIVE';

    const goal = await FinancialGoal.create({
      userId: user.id,
      name: cleanName,
      goalType: mappedType,
      targetAmount: parsedTarget,
      currentAmount: parsedCurrent,
      targetDate: parsedTargetDate,
      description: cleanDescription || '',
      status,
    });

    await logActivity(
      user.id,
      'CREATE_GOAL',
      `Created financial goal "${cleanName}" (${mappedType})`,
      { goalId: goal._id.toString(), targetAmount: parsedTarget, goalType: mappedType }
    );

    return NextResponse.json({ success: true, goal, message: 'Goal created successfully!' }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/goals Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to create financial goal.' }, { status: 500 });
  }
}
