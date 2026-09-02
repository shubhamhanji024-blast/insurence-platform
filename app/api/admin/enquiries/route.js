import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ContactEnquiry from '@/models/ContactEnquiry';

function isAuthorized(req) {
  const adminKey = req.headers.get('x-admin-key');
  const secretKey = process.env.ADMIN_API_KEY || 'growthnest_admin_secret_key_2026';
  return adminKey === secretKey;
}

// GET /api/admin/enquiries - List, Search, Filter Enquiries
export async function GET(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, message: 'Unauthorized access.' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() || '';
    const status = searchParams.get('status')?.trim() || '';
    const service = searchParams.get('service')?.trim() || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (service) {
      query.service = service;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const [total, enquiries] = await Promise.all([
      ContactEnquiry.countDocuments(query),
      ContactEnquiry.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        enquiries,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    console.error('[Admin Enquiries GET Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to fetch enquiries.' }, { status: 500 });
  }
}
