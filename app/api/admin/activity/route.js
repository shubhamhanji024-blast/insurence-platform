import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import ActivityLog from '@/models/ActivityLog';

// GET /api/admin/activity — List audit logs with pagination and filters
export async function GET(req) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() || '';
    const action = searchParams.get('action')?.trim() || '';
    const targetType = searchParams.get('targetType')?.trim() || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '30', 10)));
    const skip = (page - 1) * limit;

    const query = {};
    if (action) query.action = action;
    if (targetType) query.targetType = targetType;
    if (search) {
      query.$or = [
        { adminEmail: { $regex: search, $options: 'i' } },
        { adminName: { $regex: search, $options: 'i' } },
        { action: { $regex: search, $options: 'i' } },
        { details: { $regex: search, $options: 'i' } },
      ];
    }

    const [total, logs] = await Promise.all([
      ActivityLog.countDocuments(query),
      ActivityLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        logs,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (err) {
    console.error('[Admin Activity GET Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to fetch activity logs.' }, { status: 500 });
  }
}
