import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import ContactEnquiry from '@/models/ContactEnquiry';

// GET /api/admin/contacts — List, search, filter contact requests
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
    if (status && validStatuses.includes(status.toUpperCase())) {
      query.status = status.toUpperCase();
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const [total, contacts, statusCounts] = await Promise.all([
      ContactEnquiry.countDocuments(query),
      ContactEnquiry.find(query).sort({ createdAt: sort }).skip(skip).limit(limit),
      Promise.all([
        ContactEnquiry.countDocuments({ status: 'NEW' }),
        ContactEnquiry.countDocuments({ status: 'IN_PROGRESS' }),
        ContactEnquiry.countDocuments({ status: { $in: ['RESPONDED', 'CLOSED'] } }),
      ]),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        contacts,
        counts: {
          total,
          new: statusCounts[0],
          inProgress: statusCounts[1],
          resolved: statusCounts[2],
        },
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (err) {
    console.error('[Admin Contacts GET Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to fetch contact requests.' }, { status: 500 });
  }
}
