import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ContactEnquiry from '@/models/ContactEnquiry';

function isAuthorized(req) {
  const adminKey = req.headers.get('x-admin-key');
  const secretKey = process.env.ADMIN_API_KEY || 'growthnest_admin_secret_key_2026';
  return adminKey === secretKey;
}

const VALID_STATUSES = ['NEW', 'READ', 'IN_PROGRESS', 'RESPONDED', 'CLOSED'];

// GET /api/admin/enquiries/[id] - Fetch single enquiry
export async function GET(req, { params }) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, message: 'Unauthorized access.' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { id } = await params;
    const enquiry = await ContactEnquiry.findById(id);

    if (!enquiry) {
      return NextResponse.json({ success: false, message: 'Enquiry not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: enquiry });
  } catch (err) {
    console.error('[Admin Enquiry GET ID Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to fetch enquiry.' }, { status: 500 });
  }
}

// PATCH /api/admin/enquiries/[id] - Update enquiry status
export async function PATCH(req, { params }) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, message: 'Unauthorized access.' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { status } = body || {};

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
        },
        { status: 400 }
      );
    }

    const updated = await ContactEnquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Enquiry not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Enquiry status updated to ${status}`,
      data: updated,
    });
  } catch (err) {
    console.error('[Admin Enquiry PATCH Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to update enquiry status.' }, { status: 500 });
  }
}
