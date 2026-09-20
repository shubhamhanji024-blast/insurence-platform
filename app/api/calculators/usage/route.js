import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { getCurrentUserFromReq } from '@/lib/auth';
import CalculatorUsage from '@/models/CalculatorUsage';
import { logActivity } from '@/lib/activityServer';

const VALID_TYPES = ['SIP', 'EMI', 'LUMPSUM', 'RETIREMENT'];

export async function POST(req) {
  try {
    await connectToDatabase();
    const user = await getCurrentUserFromReq(req).catch(() => null);

    const body = await req.json().catch(() => ({}));
    const { calculatorType } = body || {};

    const type = typeof calculatorType === 'string' ? calculatorType.trim().toUpperCase() : '';

    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid calculator type. Must be SIP, EMI, LUMPSUM, or RETIREMENT.' },
        { status: 400 }
      );
    }

    const usage = await CalculatorUsage.create({
      userId: user?.id || null,
      calculatorType: type,
    });

    if (user?.id) {
      await logActivity(
        user.id,
        'CALCULATOR_USED',
        `Used ${type} Calculator`,
        { calculatorType: type }
      ).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      message: 'Calculator usage recorded.',
      data: {
        id: usage._id.toString(),
        calculatorType: type,
        createdAt: usage.createdAt,
      },
    }, { status: 201 });
  } catch (err) {
    console.error('[Calculator Usage Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to record usage.' }, { status: 500 });
  }
}
