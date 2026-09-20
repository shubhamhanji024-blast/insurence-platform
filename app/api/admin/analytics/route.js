import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import User from '@/models/User';
import ContactEnquiry from '@/models/ContactEnquiry';
import Appointment from '@/models/Appointment';
import CalculatorUsage from '@/models/CalculatorUsage';
import SavedCalculation from '@/models/SavedCalculation';
import FinancialGoal from '@/models/FinancialGoal';

export async function GET(req) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();

    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      newUsersWeek,
      newUsersMonth,
      totalEnquiries,
      newEnquiries,
      inProgressEnquiries,
      resolvedEnquiries,
      totalAppointments,
      pendingAppointments,
      confirmedAppointments,
      completedAppointments,
      cancelledAppointments,
      totalCalcUsages,
      sipUsage,
      emiUsage,
      lumpUsage,
      retUsage,
      totalGoals,
      activeGoals,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: 'ACTIVE' }),
      User.countDocuments({ status: 'INACTIVE' }),
      User.countDocuments({ createdAt: { $gte: last7Days } }),
      User.countDocuments({ createdAt: { $gte: last30Days } }),
      ContactEnquiry.countDocuments(),
      ContactEnquiry.countDocuments({ status: 'NEW' }),
      ContactEnquiry.countDocuments({ status: 'IN_PROGRESS' }),
      ContactEnquiry.countDocuments({ status: { $in: ['RESPONDED', 'CLOSED'] } }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'PENDING' }),
      Appointment.countDocuments({ status: 'CONFIRMED' }),
      Appointment.countDocuments({ status: 'COMPLETED' }),
      Appointment.countDocuments({ status: 'CANCELLED' }),
      CalculatorUsage.countDocuments(),
      CalculatorUsage.countDocuments({ calculatorType: 'SIP' }),
      CalculatorUsage.countDocuments({ calculatorType: 'EMI' }),
      CalculatorUsage.countDocuments({ calculatorType: 'LUMPSUM' }),
      CalculatorUsage.countDocuments({ calculatorType: 'RETIREMENT' }),
      FinancialGoal.countDocuments(),
      FinancialGoal.countDocuments({ status: 'ACTIVE' }),
    ]);

    // Also count saved calculations
    const savedCalcCount = await SavedCalculation.countDocuments();

    return NextResponse.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: inactiveUsers,
          newThisWeek: newUsersWeek,
          newThisMonth: newUsersMonth,
        },
        contactRequests: {
          total: totalEnquiries,
          new: newEnquiries,
          inProgress: inProgressEnquiries,
          resolved: resolvedEnquiries,
        },
        appointments: {
          total: totalAppointments,
          pending: pendingAppointments,
          confirmed: confirmedAppointments,
          completed: completedAppointments,
          cancelled: cancelledAppointments,
        },
        calculatorUsage: {
          totalEvents: totalCalcUsages,
          savedCalculations: savedCalcCount,
          totalCalculatorUses: totalCalcUsages + savedCalcCount,
          breakdown: {
            sip: sipUsage,
            emi: emiUsage,
            lumpsum: lumpUsage,
            retirement: retUsage,
          },
        },
        financialGoals: {
          total: totalGoals,
          active: activeGoals,
        },
      },
    });
  } catch (err) {
    console.error('[Admin Analytics GET Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to fetch analytics.' }, { status: 500 });
  }
}
