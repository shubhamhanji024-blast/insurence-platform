import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import User from '@/models/User';
import ContactEnquiry from '@/models/ContactEnquiry';
import FinancialGoal from '@/models/FinancialGoal';
import SavedCalculation from '@/models/SavedCalculation';
import CalculatorUsage from '@/models/CalculatorUsage';
import Appointment from '@/models/Appointment';
import Service from '@/models/Service';
import ActivityLog from '@/models/ActivityLog';

// GET /api/admin/dashboard — Real aggregated database metrics & trend charts
export async function GET(req) {
  const { user, error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();

    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      activeUsers,
      newUsersWeek,
      newUsersMonth,
      totalEnquiries,
      newEnquiries,
      totalAppointments,
      pendingAppointments,
      totalCalculations,
      totalServices,
      activeServices,
      totalGoals,
      recentUsers,
      recentEnquiries,
      recentAppointments,
      recentActivity,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: { $ne: 'INACTIVE' } }),
      User.countDocuments({ createdAt: { $gte: last7Days } }),
      User.countDocuments({ createdAt: { $gte: last30Days } }),
      ContactEnquiry.countDocuments(),
      ContactEnquiry.countDocuments({ status: 'NEW' }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'PENDING' }),
      SavedCalculation.countDocuments(),
      Service.countDocuments(),
      Service.countDocuments({ status: 'ACTIVE' }),
      FinancialGoal.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(6).select('fullName email phone role status createdAt lastLoginAt'),
      ContactEnquiry.find().sort({ createdAt: -1 }).limit(6).select('name email phone service status createdAt'),
      Appointment.find().sort({ appointmentDate: 1 }).limit(6).select('clientName email service appointmentDate appointmentTime status'),
      ActivityLog.find().sort({ createdAt: -1 }).limit(8),
    ]);

    // Daily breakdown for the last 7 days (charts)
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(d);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(d);
      dayEnd.setHours(23, 59, 59, 999);

      const label = dayStart.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
      days.push({ dayStart, dayEnd, label });
    }

    const chartData = await Promise.all(
      days.map(async ({ dayStart, dayEnd, label }) => {
        const [usersCount, enquiriesCount, calcsCount] = await Promise.all([
          User.countDocuments({ createdAt: { $gte: dayStart, $lte: dayEnd } }),
          ContactEnquiry.countDocuments({ createdAt: { $gte: dayStart, $lte: dayEnd } }),
          SavedCalculation.countDocuments({ createdAt: { $gte: dayStart, $lte: dayEnd } }),
        ]);

        return {
          date: label,
          users: usersCount,
          enquiries: enquiriesCount,
          calculations: calcsCount,
        };
      })
    );

    // Calculator breakdown by type (combines CalculatorUsage events and SavedCalculations)
    const [
      sipSaved, emiSaved, lumpSaved, retSaved,
      sipUsed, emiUsed, lumpUsed, retUsed,
      totalUsages
    ] = await Promise.all([
      SavedCalculation.countDocuments({ calculatorType: { $regex: /sip/i } }),
      SavedCalculation.countDocuments({ calculatorType: { $regex: /emi/i } }),
      SavedCalculation.countDocuments({ calculatorType: { $regex: /lump/i } }),
      SavedCalculation.countDocuments({ calculatorType: { $regex: /retir/i } }),
      CalculatorUsage.countDocuments({ calculatorType: 'SIP' }),
      CalculatorUsage.countDocuments({ calculatorType: 'EMI' }),
      CalculatorUsage.countDocuments({ calculatorType: 'LUMPSUM' }),
      CalculatorUsage.countDocuments({ calculatorType: 'RETIREMENT' }),
      CalculatorUsage.countDocuments(),
    ]);

    const grandTotalCalculations = totalCalculations + totalUsages;

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          activeUsers,
          newUsersWeek,
          newUsersMonth,
          totalEnquiries,
          newEnquiries,
          totalAppointments,
          pendingAppointments,
          totalCalculations: grandTotalCalculations,
          totalServices,
          activeServices,
          totalGoals,
        },
        calculatorBreakdown: {
          sip: sipSaved + sipUsed,
          emi: emiSaved + emiUsed,
          lumpsum: lumpSaved + lumpUsed,
          retirement: retSaved + retUsed,
        },
        chartData,
        recentUsers,
        recentEnquiries,
        recentAppointments,
        recentActivity,
        adminUser: {
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err) {
    console.error('[Admin Dashboard GET Error]:', err.message);
    return NextResponse.json(
      { success: false, message: 'Failed to load dashboard metrics.' },
      { status: 500 }
    );
  }
}
