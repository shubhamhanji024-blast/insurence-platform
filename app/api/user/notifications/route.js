import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { getCurrentUserFromReq } from '@/lib/auth';
import UserNotification from '@/models/UserNotification';

export async function GET(req) {
  try {
    await connectToDatabase();
    const currentUser = await getCurrentUserFromReq(req);
    if (!currentUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const [notifications, unreadCount] = await Promise.all([
      UserNotification.find({ userId: currentUser.id }).sort({ createdAt: -1 }).limit(25).lean(),
      UserNotification.countDocuments({ userId: currentUser.id, read: false }),
    ]);

    const formatted = notifications.map((n) => ({
      id: n._id.toString(),
      title: n.title,
      message: n.message,
      type: n.type,
      read: n.read,
      link: n.link || '',
      createdAt: n.createdAt,
    }));

    return NextResponse.json({
      success: true,
      notifications: formatted,
      unreadCount,
    });
  } catch (err) {
    console.error('[GET /api/user/notifications Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to fetch notifications.' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectToDatabase();
    const currentUser = await getCurrentUserFromReq(req);
    if (!currentUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Mark all notifications as read for current user
    await UserNotification.updateMany({ userId: currentUser.id, read: false }, { $set: { read: true } });

    return NextResponse.json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) {
    console.error('[PUT /api/user/notifications Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to update notifications.' }, { status: 500 });
  }
}
