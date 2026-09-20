import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import ContactEnquiry from '@/models/ContactEnquiry';
import { logAdminActivity } from '@/lib/logActivity';

export async function PUT(req, { params }) {
  const { user: adminUser, error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid enquiry ID' }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const { status } = body;

    const validStatuses = ['NEW', 'READ', 'IN_PROGRESS', 'RESPONDED', 'CLOSED'];
    const newStatus = typeof status === 'string' ? status.toUpperCase() : '';

    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json({ success: false, message: 'Invalid status value' }, { status: 400 });
    }

    const updated = await ContactEnquiry.findByIdAndUpdate(
      id,
      { $set: { status: newStatus } },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Contact enquiry not found' }, { status: 404 });
    }

    await logAdminActivity({
      adminEmail: adminUser.email,
      adminName: adminUser.fullName,
      action: 'ENQUIRY_UPDATED',
      targetType: 'ENQUIRY',
      targetId: id,
      details: `Updated status to ${newStatus} for ${updated.email}`,
      req,
    });

    return NextResponse.json({
      success: true,
      message: 'Contact enquiry updated successfully.',
      data: { enquiry: updated },
    });
  } catch (err) {
    console.error('[Admin Contact PUT Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to update contact enquiry.' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { user: adminUser, error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid enquiry ID' }, { status: 400 });
    }

    const deleted = await ContactEnquiry.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Contact enquiry not found' }, { status: 404 });
    }

    await logAdminActivity({
      adminEmail: adminUser.email,
      adminName: adminUser.fullName,
      action: 'ENQUIRY_DELETED',
      targetType: 'ENQUIRY',
      targetId: id,
      details: `Deleted enquiry from ${deleted.email}`,
      req,
    });

    return NextResponse.json({
      success: true,
      message: 'Contact enquiry deleted successfully.',
    });
  } catch (err) {
    console.error('[Admin Contact DELETE Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to delete contact enquiry.' }, { status: 500 });
  }
}
