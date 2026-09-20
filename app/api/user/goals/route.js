import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { getCurrentUserFromReq } from '@/lib/auth';
import FinancialGoal from '@/models/FinancialGoal';
import UserNotification from '@/models/UserNotification';
import { logActivity } from '@/lib/activityServer';

const GOAL_CATEGORY_MAP = {
  'Retirement': 'RETIREMENT',
  'Buy a House': 'HOME_PURCHASE',
  'Home Purchase': 'HOME_PURCHASE',
  'Emergency Fund': 'EMERGENCY_FUND',
  'Higher Education': 'EDUCATION',
  'Education': 'EDUCATION',
  'Buy a Car': 'VEHICLE',
  'Vehicle': 'VEHICLE',
  'Travel': 'TRAVEL',
  'Investment': 'INVESTMENT',
  'Custom Goal': 'OTHER',
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
    const currentUser = await getCurrentUserFromReq(req);
    if (!currentUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const goals = await FinancialGoal.find({ userId: currentUser.id }).sort({ createdAt: -1 }).lean();

    const formattedGoals = goals.map((g) => {
      const target = Number(g.targetAmount) || 0;
      const current = Number(g.currentAmount) || 0;
      const progress = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

      return {
        id: g._id.toString(),
        name: g.name,
        goalType: g.goalType,
        category: g.goalType,
        targetAmount: target,
        currentAmount: current,
        monthlyContribution: Number(g.monthlyContribution) || 0,
        targetDate: g.targetDate,
        description: g.description || '',
        status: g.status || 'ACTIVE',
        progress,
        createdAt: g.createdAt,
      };
    });

    return NextResponse.json({ success: true, goals: formattedGoals });
  } catch (err) {
    console.error('[GET /api/user/goals Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to fetch financial goals.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const currentUser = await getCurrentUserFromReq(req);
    if (!currentUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const {
      name,
      goalCategory,
      goalType,
      targetAmount,
      currentAmount = 0,
      monthlyContribution = 0,
      targetDate,
      description,
    } = body;

    const errors = {};

    const cleanName = typeof name === 'string' ? name.trim() : '';
    if (!cleanName) {
      errors.name = 'Goal name is required.';
    } else if (cleanName.length > 100) {
      errors.name = 'Goal name cannot exceed 100 characters.';
    }

    const categoryInput = goalCategory || goalType;
    const mappedType = GOAL_CATEGORY_MAP[categoryInput] || 'OTHER';

    const parsedTarget = parseFloat(targetAmount);
    if (isNaN(parsedTarget) || parsedTarget <= 0) {
      errors.targetAmount = 'Target amount must be a number greater than 0.';
    }

    const parsedCurrent = parseFloat(currentAmount);
    if (isNaN(parsedCurrent) || parsedCurrent < 0) {
      errors.currentAmount = 'Current amount cannot be negative.';
    }

    const parsedMonthly = parseFloat(monthlyContribution);
    if (isNaN(parsedMonthly) || parsedMonthly < 0) {
      errors.monthlyContribution = 'Monthly contribution cannot be negative.';
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
      userId: currentUser.id,
      name: cleanName,
      goalType: mappedType,
      targetAmount: parsedTarget,
      currentAmount: parsedCurrent,
      monthlyContribution: parsedMonthly || 0,
      targetDate: parsedTargetDate,
      description: cleanDescription,
      status,
    });

    // Log Activity
    await logActivity(
      currentUser.id,
      'CREATE_GOAL',
      `Created financial goal "${cleanName}" (${mappedType})`,
      { goalId: goal._id.toString(), targetAmount: parsedTarget }
    );

    // Create Notification
    await UserNotification.create({
      userId: currentUser.id,
      title: 'Goal Created Successfully',
      message: `Your financial goal "${cleanName}" with target ₹${parsedTarget.toLocaleString('en-IN')} has been created.`,
      type: 'GOAL',
      link: '/dashboard/goals',
    });

    const target = Number(goal.targetAmount) || 0;
    const current = Number(goal.currentAmount) || 0;
    const progress = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

    return NextResponse.json(
      {
        success: true,
        message: 'Goal created successfully!',
        goal: {
          id: goal._id.toString(),
          name: goal.name,
          goalType: goal.goalType,
          category: goal.goalType,
          targetAmount: target,
          currentAmount: current,
          monthlyContribution: Number(goal.monthlyContribution) || 0,
          targetDate: goal.targetDate,
          description: goal.description || '',
          status: goal.status,
          progress,
          createdAt: goal.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[POST /api/user/goals Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to create financial goal.' }, { status: 500 });
  }
}
