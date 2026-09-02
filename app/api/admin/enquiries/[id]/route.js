import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import ContactEnquiry from '@/models/ContactEnquiry';

// GET /api/admin/enquiries/[id]
export async function GET(req, { params }) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    const { id } = await params;
    const enquiry = await ContactEnquiry.findById(id);
    if (!enquiry) {
      return NextResponse.json({ success: false, message: 'Enquiry not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { enquiry } });
  } catch (err) {
    console.error('[Admin Enquiry Detail GET Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to fetch enquiry.' }, { status: 500 });
  }
}

// PATCH /api/admin/enquiries/[id] — Update status
export async function PATCH(req, { params }) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    const { id } = await params;

    let body;
    try { body = await req.json(); } catch {
      return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
    }

    const { status } = body || {};
    const validStatuses = ['NEW', 'READ', 'IN_PROGRESS', 'RESPONDED', 'CLOSED'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}.` }, { status: 400 });
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
      message: `Enquiry status updated to ${status}.`,
      data: { enquiry: updated },
    });
  } catch (err) {
    console.error('[Admin Enquiry PATCH Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to update enquiry.' }, { status: 500 });
  }
}
