import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import User from '@/models/User';
import ContactEnquiry from '@/models/ContactEnquiry';
import FinancialGoal from '@/models/FinancialGoal';
import SavedCalculation from '@/models/SavedCalculation';

// GET /api/admin/dashboard — Summary stats from MongoDB
export async function GET(req) {
  const { user, error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();

    const now = new Date();
    const last7Days = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      newUsersWeek,
      newUsersMonth,
      totalEnquiries,
      newEnquiries,
      totalGoals,
      activeGoals,
      totalCalculations,
      recentUsers,
      recentEnquiries,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: last7Days } }),
      User.countDocuments({ createdAt: { $gte: last30Days } }),
      ContactEnquiry.countDocuments(),
      ContactEnquiry.countDocuments({ status: 'NEW' }),
      FinancialGoal.countDocuments(),
      FinancialGoal.countDocuments({ status: 'ACTIVE' }),
      SavedCalculation.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5).select('fullName email createdAt role'),
      ContactEnquiry.find().sort({ createdAt: -1 }).limit(5).select('name email service status createdAt'),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          newUsersWeek,
          newUsersMonth,
          totalEnquiries,
          newEnquiries,
          totalGoals,
          activeGoals,
          totalCalculations,
        },
        recentUsers,
        recentEnquiries,
        adminName: user.fullName,
      },
    });
  } catch (err) {
    console.error('[Admin Dashboard GET Error]:', err.message);
    return NextResponse.json(
      { success: false, message: 'Failed to load dashboard data.' },
      { status: 500 }
    );
  }
}
