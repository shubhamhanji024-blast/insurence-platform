import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { getCurrentUserFromReq } from '@/lib/auth';
import Appointment from '@/models/Appointment';
import UserNotification from '@/models/UserNotification';
import { logActivity } from '@/lib/activityServer';

export async function GET(req) {
  try {
    await connectToDatabase();
    const currentUser = await getCurrentUserFromReq(req);
    if (!currentUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const appointments = await Appointment.find({
      $or: [{ userId: currentUser.id }, { email: currentUser.email }],
    })
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .lean();

    const formatted = appointments.map((a) => ({
      id: a._id.toString(),
      clientName: a.clientName,
      email: a.email,
      phone: a.phone,
      service: a.service,
      appointmentDate: a.appointmentDate,
      appointmentTime: a.appointmentTime,
      status: a.status,
      notes: a.notes || '',
      advisor: a.advisor || 'GrowthNest Advisory Team',
      createdAt: a.createdAt,
    }));

    return NextResponse.json({ success: true, appointments: formatted });
  } catch (err) {
    console.error('[GET /api/user/appointments Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to fetch appointments.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const currentUser = await getCurrentUserFromReq(req);
    if (!currentUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { clientName, phone, service, appointmentDate, appointmentTime, notes } = body;

    const errors = {};

    const name = (clientName || currentUser.fullName || '').trim();
    if (!name) {
      errors.clientName = 'Your name is required.';
    }

    const contactPhone = (phone || currentUser.phone || '').trim();
    if (!contactPhone) {
      errors.phone = 'Phone number is required.';
    }

    const cleanService = typeof service === 'string' ? service.trim() : '';
    if (!cleanService) {
      errors.service = 'Please select a financial service.';
    }

    if (!appointmentDate) {
      errors.appointmentDate = 'Appointment date is required.';
    } else {
      const parsedDate = new Date(appointmentDate);
      if (isNaN(parsedDate.getTime())) {
        errors.appointmentDate = 'Invalid appointment date.';
      }
    }

    const cleanTime = typeof appointmentTime === 'string' ? appointmentTime.trim() : '';
    if (!cleanTime) {
      errors.appointmentTime = 'Appointment time is required.';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors, message: 'Validation failed.' }, { status: 400 });
    }

    const appointment = await Appointment.create({
      userId: currentUser.id,
      clientName: name,
      email: currentUser.email,
      phone: contactPhone,
      service: cleanService,
      appointmentDate: new Date(appointmentDate),
      appointmentTime: cleanTime,
      notes: typeof notes === 'string' ? notes.trim() : '',
      status: 'PENDING',
      advisor: 'GrowthNest Advisory Team',
    });

    // Log Activity
    await logActivity(
      currentUser.id,
      'BOOK_APPOINTMENT',
      `Booked appointment for "${cleanService}" on ${new Date(appointmentDate).toLocaleDateString('en-IN')}`,
      { appointmentId: appointment._id.toString(), service: cleanService }
    );

    // Create Notification for user
    await UserNotification.create({
      userId: currentUser.id,
      title: 'Appointment Booked',
      message: `Your appointment for ${cleanService} on ${new Date(appointmentDate).toLocaleDateString('en-IN')} at ${cleanTime} is pending confirmation.`,
      type: 'APPOINTMENT',
      link: '/dashboard/appointments',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Appointment booked successfully!',
        appointment: {
          id: appointment._id.toString(),
          clientName: appointment.clientName,
          email: appointment.email,
          phone: appointment.phone,
          service: appointment.service,
          appointmentDate: appointment.appointmentDate,
          appointmentTime: appointment.appointmentTime,
          status: appointment.status,
          notes: appointment.notes,
          advisor: appointment.advisor,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[POST /api/user/appointments Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to book appointment.' }, { status: 500 });
  }
}
