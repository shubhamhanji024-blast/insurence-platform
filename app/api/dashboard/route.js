import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { getCurrentUserFromReq } from '@/lib/auth';
import FinancialGoal from '@/models/FinancialGoal';
import SavedCalculation from '@/models/SavedCalculation';
import Activity from '@/models/Activity';
import Appointment from '@/models/Appointment';
import UserNotification from '@/models/UserNotification';

export async function GET(req) {
  try {
    await connectToDatabase();
    const user = await getCurrentUserFromReq(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Aggregate user-specific metrics strictly by userId
    const [
      goals,
      savedCalculationCount,
      recentActivities,
      upcomingAppointments,
      unreadNotificationsCount,
    ] = await Promise.all([
      FinancialGoal.find({ userId: user.id }).sort({ createdAt: -1 }).lean(),
      SavedCalculation.countDocuments({ userId: user.id }),
      Activity.find({ userId: user.id }).sort({ createdAt: -1 }).limit(6).lean(),
      Appointment.find({
        $or: [{ userId: user.id }, { email: user.email }],
        status: { $in: ['PENDING', 'CONFIRMED'] },
      })
        .sort({ appointmentDate: 1, appointmentTime: 1 })
        .limit(3)
        .lean(),
      UserNotification.countDocuments({ userId: user.id, read: false }),
    ]);

    const goalCount = goals.length;
    const activeGoalCount = goals.filter((g) => g.status === 'ACTIVE').length;

    // Calculate sum of current amounts and monthly contributions from goals
    let totalSavedInGoals = 0;
    let totalMonthlySipFromGoals = 0;
    goals.forEach((g) => {
      totalSavedInGoals += Number(g.currentAmount) || 0;
      totalMonthlySipFromGoals += Number(g.monthlyContribution) || 0;
    });

    // Real financial values (Strictly NO fake values)
    // If user has saved amounts in goals, we can reflect them, otherwise 0
    const totalInvestments = totalSavedInGoals;
    const portfolioValue = totalSavedInGoals;
    const monthlySIP = totalMonthlySipFromGoals;
    const hasInvestmentData = totalInvestments > 0 || monthlySIP > 0;

    const formattedGoals = goals.slice(0, 4).map((g) => {
      const target = Number(g.targetAmount) || 0;
      const current = Number(g.currentAmount) || 0;
      const progress = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
      return {
        id: g._id.toString(),
        name: g.name,
        category: g.goalType,
        targetAmount: target,
        currentAmount: current,
        targetDate: g.targetDate,
        monthlyContribution: Number(g.monthlyContribution) || 0,
        progress,
        status: g.status,
      };
    });

    const formattedActivities = recentActivities.map((a) => ({
      id: a._id.toString(),
      activityType: a.activityType,
      description: a.description,
      createdAt: a.createdAt,
    }));

    const formattedAppointments = upcomingAppointments.map((a) => ({
      id: a._id.toString(),
      service: a.service,
      appointmentDate: a.appointmentDate,
      appointmentTime: a.appointmentTime,
      status: a.status,
      advisor: a.advisor || 'GrowthNest Advisory Team',
    }));

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone || '',
          role: user.role,
          createdAt: user.createdAt,
          emailVerified: user.emailVerified,
        },
        financialOverview: {
          totalInvestments,
          portfolioValue,
          monthlySIP,
          goalCount,
          hasInvestmentData,
        },
        goalCount,
        activeGoalCount,
        savedCalculationCount,
        recentGoals: formattedGoals,
        recentActivities: formattedActivities,
        upcomingAppointments: formattedAppointments,
        unreadNotificationsCount,
      },
    });
  } catch (err) {
    console.error('[Dashboard API Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
