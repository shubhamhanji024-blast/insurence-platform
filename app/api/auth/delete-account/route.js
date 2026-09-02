import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { getCurrentUserFromReq, COOKIE_NAME } from '@/lib/auth';
import User from '@/models/User';
import FinancialGoal from '@/models/FinancialGoal';
import SavedCalculation from '@/models/SavedCalculation';
import Activity from '@/models/Activity';

export async function POST(req) {
  try {
    await connectToDatabase();
    const user = await getCurrentUserFromReq(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { confirmText } = body;

    if (confirmText !== 'DELETE') {
      return NextResponse.json(
        { success: false, message: 'Please type "DELETE" to confirm account deletion.' },
        { status: 400 }
      );
    }

    // Cascade delete user and associated records in MongoDB
    await Promise.all([
      User.findByIdAndDelete(user.id),
      FinancialGoal.deleteMany({ userId: user.id }),
      SavedCalculation.deleteMany({ userId: user.id }),
      Activity.deleteMany({ userId: user.id }),
    ]);

    const response = NextResponse.json({
      success: true,
      message: 'Account deleted successfully.',
    });

    // Clear session cookie
    response.cookies.set(COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(0),
    });

    return response;
  } catch (err) {
    console.error('[POST /api/auth/delete-account Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to delete account.' }, { status: 500 });
  }
}
