import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { getCurrentUserFromReq } from '@/lib/auth';
import ContactEnquiry from '@/models/ContactEnquiry';
import UserNotification from '@/models/UserNotification';
import { logActivity } from '@/lib/activityServer';

export async function GET(req) {
  try {
    await connectToDatabase();
    const currentUser = await getCurrentUserFromReq(req);
    if (!currentUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const enquiries = await ContactEnquiry.find({
      $or: [{ userId: currentUser.id }, { email: currentUser.email }],
    })
      .sort({ createdAt: -1 })
      .lean();

    const formatted = enquiries.map((e) => ({
      id: e._id.toString(),
      name: e.name,
      email: e.email,
      phone: e.phone,
      service: e.service,
      subject: e.subject || e.service || 'Financial Consultation',
      message: e.message,
      status: e.status === 'NEW' ? 'Submitted' : e.status === 'IN_PROGRESS' ? 'In Progress' : 'Resolved',
      rawStatus: e.status,
      createdAt: e.createdAt,
    }));

    return NextResponse.json({ success: true, enquiries: formatted });
  } catch (err) {
    console.error('[GET /api/user/contact Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to fetch contact requests.' }, { status: 500 });
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
    const { name, email, phone, subject, message } = body;

    const errors = {};

    const contactName = (name || currentUser.fullName || '').trim();
    if (!contactName) errors.name = 'Name is required.';

    const contactEmail = (email || currentUser.email || '').trim().toLowerCase();
    if (!contactEmail) errors.email = 'Email is required.';

    const contactPhone = (phone || currentUser.phone || '').trim();

    const cleanSubject = typeof subject === 'string' ? subject.trim() : '';
    if (!cleanSubject) errors.subject = 'Subject is required.';

    const cleanMessage = typeof message === 'string' ? message.trim() : '';
    if (!cleanMessage) errors.message = 'Message is required.';

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors, message: 'Validation failed.' }, { status: 400 });
    }

    const enquiry = await ContactEnquiry.create({
      userId: currentUser.id,
      name: contactName,
      email: contactEmail,
      phone: contactPhone || null,
      service: cleanSubject,
      subject: cleanSubject,
      message: cleanMessage,
      status: 'NEW',
    });

    await logActivity(
      currentUser.id,
      'CONTACT_ADVISOR',
      `Sent inquiry to advisor: "${cleanSubject}"`,
      { enquiryId: enquiry._id.toString() }
    );

    await UserNotification.create({
      userId: currentUser.id,
      title: 'Advisor Inquiry Received',
      message: `Your message regarding "${cleanSubject}" has been submitted to a senior advisor.`,
      type: 'CONTACT',
      link: '/dashboard/support',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Inquiry submitted successfully! An advisor will reach out shortly.',
        enquiry: {
          id: enquiry._id.toString(),
          name: enquiry.name,
          email: enquiry.email,
          phone: enquiry.phone,
          subject: enquiry.subject,
          service: enquiry.service,
          message: enquiry.message,
          status: 'Submitted',
          createdAt: enquiry.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[POST /api/user/contact Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to submit inquiry.' }, { status: 500 });
  }
}
