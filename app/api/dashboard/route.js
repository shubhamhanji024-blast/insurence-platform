import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { getCurrentUserFromReq } from '@/lib/auth';
import FinancialGoal from '@/models/FinancialGoal';
import SavedCalculation from '@/models/SavedCalculation';
import Activity from '@/models/Activity';

export async function GET(req) {
  try {
    await connectToDatabase();
    const user = await getCurrentUserFromReq(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Aggregate counts & recent activities for authenticated user ONLY
    const [goalCount, activeGoalCount, savedCalculationCount, recentActivities] = await Promise.all([
      FinancialGoal.countDocuments({ userId: user.id }),
      FinancialGoal.countDocuments({ userId: user.id, status: 'ACTIVE' }),
      SavedCalculation.countDocuments({ userId: user.id }),
      Activity.find({ userId: user.id }).sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    const formattedActivities = recentActivities.map((a) => ({
      ...a,
      id: a._id.toString(),
      _id: undefined,
    }));

    return NextResponse.json({
      success: true,
      data: {
        goalCount,
        activeGoalCount,
        savedCalculationCount,
        recentActivities: formattedActivities,
        user,
      },
    });
  } catch (err) {
    console.error('[Dashboard API Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
