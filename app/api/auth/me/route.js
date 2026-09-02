import { NextResponse } from 'next/server';
import { getCurrentUserFromReq } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = await getCurrentUserFromReq(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[Auth Me GET Error]:', err.message);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user session.' },
      { status: 500 }
    );
  }
}
