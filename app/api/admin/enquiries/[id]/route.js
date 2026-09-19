import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import ContactEnquiry from '@/models/ContactEnquiry';
import { logAdminActivity } from '@/lib/logActivity';

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

// PUT / PATCH /api/admin/enquiries/[id] — Update status
export async function PUT(req, { params }) {
  return handleUpdate(req, params);
}

export async function PATCH(req, { params }) {
  return handleUpdate(req, params);
}

async function handleUpdate(req, params) {
  const { user: adminUser, error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    const { id } = await params;

    let body;
    try { body = await req.json(); } catch {
      return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
    }

    const { status, adminNotes } = body || {};
    const validStatuses = ['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'READ', 'RESPONDED'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}.` }, { status: 400 });
    }

    const updateDoc = {};
    if (status) updateDoc.status = status;
    if (adminNotes !== undefined) updateDoc.adminNotes = adminNotes;

    const updated = await ContactEnquiry.findByIdAndUpdate(
      id,
      { $set: updateDoc },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Enquiry not found.' }, { status: 404 });
    }

    await logAdminActivity({
      adminEmail: adminUser.email,
      adminName: adminUser.fullName,
      action: 'ENQUIRY_UPDATED',
      targetType: 'ENQUIRY',
      targetId: id,
      details: `Updated enquiry status to ${status || 'unchanged'} for ${updated.email}`,
      req,
    });

    return NextResponse.json({
      success: true,
      message: `Enquiry updated successfully.`,
      data: { enquiry: updated },
    });
  } catch (err) {
    console.error('[Admin Enquiry Update Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to update enquiry.' }, { status: 500 });
  }
}

// DELETE /api/admin/enquiries/[id] — Delete enquiry
export async function DELETE(req, { params }) {
  const { user: adminUser, error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    const { id } = await params;

    const enquiry = await ContactEnquiry.findByIdAndDelete(id);
    if (!enquiry) {
      return NextResponse.json({ success: false, message: 'Enquiry not found.' }, { status: 404 });
    }

    await logAdminActivity({
      adminEmail: adminUser.email,
      adminName: adminUser.fullName,
      action: 'ENQUIRY_DELETED',
      targetType: 'ENQUIRY',
      targetId: id,
      details: `Deleted contact enquiry from ${enquiry.email} (${enquiry.name})`,
      req,
    });

    return NextResponse.json({
      success: true,
      message: 'Contact enquiry deleted successfully.',
    });
  } catch (err) {
    console.error('[Admin Enquiry DELETE Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to delete enquiry.' }, { status: 500 });
  }
}
