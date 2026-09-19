import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import Appointment from '@/models/Appointment';
import { logAdminActivity } from '@/lib/logActivity';

// GET /api/admin/appointments/[id]
export async function GET(req, { params }) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    const { id } = await params;
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return NextResponse.json({ success: false, message: 'Appointment not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { appointment } });
  } catch (err) {
    console.error('[Admin Appointment GET Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to fetch appointment.' }, { status: 500 });
  }
}

// PUT / PATCH /api/admin/appointments/[id] — Update status / details
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

    const { status, appointmentDate, appointmentTime, notes, advisor } = body || {};
    const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

    const updateDoc = {};
    if (status) {
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}.` }, { status: 400 });
      }
      updateDoc.status = status;
    }
    if (appointmentDate) updateDoc.appointmentDate = new Date(appointmentDate);
    if (appointmentTime) updateDoc.appointmentTime = String(appointmentTime).trim();
    if (notes !== undefined) updateDoc.notes = String(notes).trim();
    if (advisor !== undefined) updateDoc.advisor = String(advisor).trim();

    const updated = await Appointment.findByIdAndUpdate(
      id,
      { $set: updateDoc },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Appointment not found.' }, { status: 404 });
    }

    await logAdminActivity({
      adminEmail: adminUser.email,
      adminName: adminUser.fullName,
      action: 'APPOINTMENT_UPDATED',
      targetType: 'APPOINTMENT',
      targetId: id,
      details: `Updated appointment for ${updated.clientName} (Status: ${updated.status})`,
      req,
    });

    return NextResponse.json({
      success: true,
      message: 'Appointment updated successfully.',
      data: { appointment: updated },
    });
  } catch (err) {
    console.error('[Admin Appointment Update Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to update appointment.' }, { status: 500 });
  }
}

// DELETE /api/admin/appointments/[id] — Delete appointment
export async function DELETE(req, { params }) {
  const { user: adminUser, error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    const { id } = await params;

    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) {
      return NextResponse.json({ success: false, message: 'Appointment not found.' }, { status: 404 });
    }

    await logAdminActivity({
      adminEmail: adminUser.email,
      adminName: adminUser.fullName,
      action: 'APPOINTMENT_DELETED',
      targetType: 'APPOINTMENT',
      targetId: id,
      details: `Deleted appointment for ${appointment.clientName} on ${new Date(appointment.appointmentDate).toLocaleDateString()}`,
      req,
    });

    return NextResponse.json({
      success: true,
      message: 'Appointment deleted successfully.',
    });
  } catch (err) {
    console.error('[Admin Appointment DELETE Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to delete appointment.' }, { status: 500 });
  }
}
