import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import SavedCalculation from '@/models/SavedCalculation';

// GET /api/admin/calculations
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
    if (typeFilter && validTypes.includes(typeFilter)) query.calculatorType = typeFilter;

    const [total, calculations, typeStats] = await Promise.all([
      SavedCalculation.countDocuments(query),
      SavedCalculation.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'fullName email')
        .select('-inputData -resultData'), // Don't expose full private calculation details in list
      SavedCalculation.aggregate([
        { $group: { _id: '$calculatorType', count: { $sum: 1 } } },
      ]),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        calculations,
        typeStats: typeStats.reduce((acc, s) => { acc[s._id] = s.count; return acc; }, {}),
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (err) {
    console.error('[Admin Calculations GET Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to fetch calculations.' }, { status: 500 });
  }
}
