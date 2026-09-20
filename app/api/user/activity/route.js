import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { getCurrentUserFromReq } from '@/lib/auth';
import Activity from '@/models/Activity';

export async function GET(req) {
  try {
    await connectToDatabase();
    const currentUser = await getCurrentUserFromReq(req);
    if (!currentUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const activities = await Activity.find({ userId: currentUser.id })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    const formatted = activities.map((a) => ({
      id: a._id.toString(),
      activityType: a.activityType,
      description: a.description,
      metadata: a.metadata,
      createdAt: a.createdAt,
    }));

    return NextResponse.json({ success: true, activities: formatted });
  } catch (err) {
    console.error('[GET /api/user/activity Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to fetch user activities.' }, { status: 500 });
  }
}
