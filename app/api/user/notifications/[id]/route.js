import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import { getCurrentUserFromReq } from '@/lib/auth';
import UserNotification from '@/models/UserNotification';

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const currentUser = await getCurrentUserFromReq(req);
    if (!currentUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid notification ID' }, { status: 400 });
    }

    const notif = await UserNotification.findOneAndUpdate(
      { _id: id, userId: currentUser.id },
      { $set: { read: true } },
      { new: true }
    );

    if (!notif) {
      return NextResponse.json({ success: false, message: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Notification marked as read.' });
  } catch (err) {
    console.error('[PUT /api/user/notifications/[id] Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to update notification.' }, { status: 500 });
  }
}
