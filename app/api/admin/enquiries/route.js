import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import ContactEnquiry from '@/models/ContactEnquiry';

// GET /api/admin/enquiries — List, search, filter enquiries
export async function GET(req) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() || '';
    const status = searchParams.get('status')?.trim() || '';
    const sort = searchParams.get('sort') === 'oldest' ? 1 : -1;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    const query = {};
    const validStatuses = ['NEW', 'READ', 'IN_PROGRESS', 'RESPONDED', 'CLOSED'];
    if (status && validStatuses.includes(status)) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const [total, enquiries] = await Promise.all([
      ContactEnquiry.countDocuments(query),
      ContactEnquiry.find(query).sort({ createdAt: sort }).skip(skip).limit(limit),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        enquiries,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (err) {
    console.error('[Admin Enquiries GET Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to fetch enquiries.' }, { status: 500 });
  }
}
