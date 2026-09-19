import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import Appointment from '@/models/Appointment';
import { logAdminActivity } from '@/lib/logActivity';

// GET /api/admin/appointments — List, filter, search, paginate appointments
export async function GET(req) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() || '';
    const status = searchParams.get('status')?.trim() || '';
    const service = searchParams.get('service')?.trim() || '';
    const date = searchParams.get('date')?.trim() || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    const query = {};
    if (status && ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].includes(status)) {
      query.status = status;
    }
    if (service) {
      query.service = { $regex: service, $options: 'i' };
    }
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.appointmentDate = { $gte: startOfDay, $lte: endOfDay };
    }
    if (search) {
      query.$or = [
        { clientName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { service: { $regex: search, $options: 'i' } },
      ];
    }

    const [total, appointments] = await Promise.all([
      Appointment.countDocuments(query),
      Appointment.find(query).sort({ appointmentDate: 1, appointmentTime: 1 }).skip(skip).limit(limit),
    ]);

    // Summary counts by status
    const [pendingCount, confirmedCount, completedCount, cancelledCount] = await Promise.all([
      Appointment.countDocuments({ status: 'PENDING' }),
      Appointment.countDocuments({ status: 'CONFIRMED' }),
      Appointment.countDocuments({ status: 'COMPLETED' }),
      Appointment.countDocuments({ status: 'CANCELLED' }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        appointments,
        counts: {
          total,
          pending: pendingCount,
          confirmed: confirmedCount,
          completed: completedCount,
          cancelled: cancelledCount,
        },
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (err) {
    console.error('[Admin Appointments GET Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to fetch appointments.' }, { status: 500 });
  }
}

// POST /api/admin/appointments — Create appointment
export async function POST(req) {
  const { user: adminUser, error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    let body;
    try { body = await req.json(); } catch {
      return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
    }

    const { clientName, email, phone, service, appointmentDate, appointmentTime, notes, advisor } = body || {};

    if (!clientName || !email || !phone || !service || !appointmentDate || !appointmentTime) {
      return NextResponse.json({
        success: false,
        message: 'Client name, email, phone, service, date, and time are required.',
      }, { status: 400 });
    }

    const appointment = await Appointment.create({
      clientName: String(clientName).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone).trim(),
      service: String(service).trim(),
      appointmentDate: new Date(appointmentDate),
      appointmentTime: String(appointmentTime).trim(),
      notes: String(notes || '').trim(),
      advisor: String(advisor || 'GrowthNest Advisory Team').trim(),
      status: 'CONFIRMED',
    });

    await logAdminActivity({
      adminEmail: adminUser.email,
      adminName: adminUser.fullName,
      action: 'APPOINTMENT_CREATED',
      targetType: 'APPOINTMENT',
      targetId: appointment._id.toString(),
      details: `Scheduled appointment for ${appointment.clientName} (${appointment.service}) on ${appointmentDate}`,
      req,
    });

    return NextResponse.json({
      success: true,
      message: 'Appointment created successfully.',
      data: { appointment },
    }, { status: 201 });
  } catch (err) {
    console.error('[Admin Appointments POST Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to create appointment.' }, { status: 500 });
  }
}
