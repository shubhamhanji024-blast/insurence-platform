import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import AdminNotification from '@/models/AdminNotification';
import User from '@/models/User';
import ContactEnquiry from '@/models/ContactEnquiry';

// GET /api/admin/notifications — Fetch notifications and unread count
export async function GET(req) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();

    // Auto-seed initial notifications from recent events if collection is empty
    const notifCount = await AdminNotification.countDocuments();
    if (notifCount === 0) {
      const recentUsers = await User.find().sort({ createdAt: -1 }).limit(3);
      const recentEnquiries = await ContactEnquiry.find().sort({ createdAt: -1 }).limit(3);

      const seeds = [];
      recentUsers.forEach(u => {
        seeds.push({
          type: 'USER',
          title: 'New User Registered',
          message: `${u.fullName} (${u.email}) joined GrowthNest.`,
          link: `/admin/users/${u._id}`,
          read: false,
          createdAt: u.createdAt,
        });
      });
      recentEnquiries.forEach(e => {
        seeds.push({
          type: 'ENQUIRY',
          title: 'New Advisory Enquiry',
          message: `${e.name} submitted a request for ${e.service || 'Advisory'}.`,
          link: '/admin/enquiries',
          read: false,
          createdAt: e.createdAt,
        });
      });
      seeds.push({
        type: 'SYSTEM',
        title: 'Admin Console Initialized',
        message: 'GrowthNest Admin security and RBAC monitoring active.',
        link: '/admin',
        read: true,
      });

      if (seeds.length > 0) {
        await AdminNotification.insertMany(seeds);
      }
    }

    const [unreadCount, notifications] = await Promise.all([
      AdminNotification.countDocuments({ read: false }),
      AdminNotification.find().sort({ createdAt: -1 }).limit(30),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        notifications,
        unreadCount,
      },
    });
  } catch (err) {
    console.error('[Admin Notifications GET Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to fetch notifications.' }, { status: 500 });
  }
}

// PUT /api/admin/notifications — Mark single as read or mark all as read
export async function PUT(req) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    let body;
    try { body = await req.json(); } catch {
      return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
    }

    const { id, markAll } = body || {};

    if (markAll) {
      await AdminNotification.updateMany({ read: false }, { $set: { read: true } });
      return NextResponse.json({ success: true, message: 'All notifications marked as read.' });
    }

    if (id) {
      await AdminNotification.findByIdAndUpdate(id, { $set: { read: true } });
      return NextResponse.json({ success: true, message: 'Notification marked as read.' });
    }

    return NextResponse.json({ success: false, message: 'Specify id or markAll: true.' }, { status: 400 });
  } catch (err) {
    console.error('[Admin Notifications PUT Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to update notifications.' }, { status: 500 });
  }
}
