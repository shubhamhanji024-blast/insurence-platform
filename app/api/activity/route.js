import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { getCurrentUserFromReq } from '@/lib/auth';
import Activity from '@/models/Activity';

export async function GET(req) {
  try {
    await connectToDatabase();
    const user = await getCurrentUserFromReq(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const activities = await Activity.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json({ success: true, activities });
  } catch (err) {
    console.error('[GET /api/activity Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to fetch activity history.' }, { status: 500 });
  }
}
