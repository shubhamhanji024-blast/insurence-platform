import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import FinancialGoal from '@/models/FinancialGoal';
import User from '@/models/User';

// GET /api/admin/goals — Aggregate goals data
export async function GET(req) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;
    const statusFilter = searchParams.get('status')?.trim() || '';

    const query = {};
    if (statusFilter) query.status = statusFilter;

    const [total, goals, stats] = await Promise.all([
      FinancialGoal.countDocuments(query),
      FinancialGoal.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'fullName email'),
      FinancialGoal.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        goals,
        stats: stats.reduce((acc, s) => { acc[s._id] = s.count; return acc; }, {}),
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (err) {
    console.error('[Admin Goals GET Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to fetch goals.' }, { status: 500 });
  }
}
