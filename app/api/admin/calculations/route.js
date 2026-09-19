import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import SavedCalculation from '@/models/SavedCalculation';

// GET /api/admin/calculations — Analytics & Paginated Calculations
export async function GET(req) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;
    const typeFilter = searchParams.get('type')?.trim() || '';

    const query = {};
    const validTypes = ['SIP', 'EMI', 'LUMPSUM', 'RETIREMENT'];
    if (typeFilter && validTypes.includes(typeFilter.toUpperCase())) {
      query.calculatorType = { $regex: new RegExp(`^${typeFilter}$`, 'i') };
    }

    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalAll,
      todayCount,
      weekCount,
      monthCount,
      totalFiltered,
      calculations,
      typeStatsRaw,
    ] = await Promise.all([
      SavedCalculation.countDocuments(),
      SavedCalculation.countDocuments({ createdAt: { $gte: startOfToday } }),
      SavedCalculation.countDocuments({ createdAt: { $gte: startOfWeek } }),
      SavedCalculation.countDocuments({ createdAt: { $gte: startOfMonth } }),
      SavedCalculation.countDocuments(query),
      SavedCalculation.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'fullName email')
        .select('-inputData -resultData'),
      SavedCalculation.aggregate([
        { $group: { _id: { $toUpper: '$calculatorType' }, count: { $sum: 1 } } },
      ]),
    ]);

    // 7-day trend
    const timeline = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(d);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(d);
      dayEnd.setHours(23, 59, 59, 999);

      const count = await SavedCalculation.countDocuments({ createdAt: { $gte: dayStart, $lte: dayEnd } });
      timeline.push({
        date: dayStart.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }),
        count,
      });
    }

    const typeStats = typeStatsRaw.reduce((acc, s) => {
      acc[s._id] = s.count;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: {
        metrics: {
          total: totalAll,
          today: todayCount,
          week: weekCount,
          month: monthCount,
        },
        typeStats,
        timeline,
        calculations,
        pagination: { total: totalFiltered, page, limit, totalPages: Math.ceil(totalFiltered / limit) },
      },
    });
  } catch (err) {
    console.error('[Admin Calculations GET Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to fetch calculations analytics.' }, { status: 500 });
  }
}
