import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ContactEnquiry from '@/models/ContactEnquiry';
import { validateContactInput } from '@/lib/sanitizer';
import { checkRateLimit } from '@/lib/rateLimit';
import { sendEnquiryNotificationEmail } from '@/lib/emailService';

export async function POST(req) {
  try {
    const conn = await connectToDatabase();

    // 1. Rate Limiting Check by IP
    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    const rateLimit = checkRateLimit(clientIp, 10, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: rateLimit.message,
        },
        { status: 429 }
      );
    }

    // 2. Parse Request Body
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid payload format.',
        },
        { status: 400 }
      );
    }

    const { name, email, phone, service, message, website_hp } = body || {};

    // 3. Honeypot Spam Check
    if (website_hp && website_hp.trim() !== '') {
      return NextResponse.json(
        {
          success: true,
          message: 'Your enquiry has been submitted successfully.',
          data: { id: 'hp_filtered' },
        },
        { status: 200 }
      );
    }

    // 4. Server-Side Input Validation
    const validation = validateContactInput({ name, email, phone, service, message });
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please check the submitted information.',
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    // 5. Save Enquiry in MongoDB (contact_enquiries collection)
    const newEnquiry = await ContactEnquiry.create({
      name: validation.sanitized.name,
      email: validation.sanitized.email,
      phone: validation.sanitized.phone || null,
      service: validation.sanitized.service,
      message: validation.sanitized.message,
      status: 'NEW',
    });

    const activeDbName = conn.connection.db?.databaseName || 'growthnest';
    const collectionName = ContactEnquiry.collection.name || 'contact_enquiries';

    // Safe server-side logging (no secrets or sensitive data)
    console.log(
      `[Contact API]: Successfully inserted enquiry into database "${activeDbName}", collection "${collectionName}" with document ID: ${newEnquiry._id.toString()}`
    );

    // 6. Trigger Email Notification (non-blocking)
    sendEnquiryNotificationEmail(newEnquiry).catch((err) => {
      console.error('[ContactAPI Email Trigger Error]:', err.message);
    });

    // 7. Uniform Success Response
    return NextResponse.json(
      {
        success: true,
        message: 'Your enquiry has been submitted successfully.',
        data: {
          id: newEnquiry._id.toString(),
          database: activeDbName,
          collection: collectionName,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[Contact API MongoDB Error]:', err.message);
    return NextResponse.json(
      {
        success: false,
        message: 'Unable to submit your enquiry at the moment. Please try again later.',
      },
      { status: 500 }
    );
  }
}
