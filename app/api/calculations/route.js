import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { getCurrentUserFromReq } from '@/lib/auth';
import SavedCalculation from '@/models/SavedCalculation';
import { logActivity } from '@/lib/activityServer';

const VALID_CALCULATOR_TYPES = ['SIP', 'EMI', 'LUMPSUM', 'RETIREMENT'];

export async function GET(req) {
  try {
    await connectToDatabase();
    const user = await getCurrentUserFromReq(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const calculations = await SavedCalculation.find({ userId: user.id }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, calculations });
  } catch (err) {
    console.error('[GET /api/calculations Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to fetch saved calculations.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const user = await getCurrentUserFromReq(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { calculatorType, name, inputData, resultData } = body;

    const errors = {};

    if (!calculatorType || !VALID_CALCULATOR_TYPES.includes(calculatorType)) {
      errors.calculatorType = 'Invalid calculator type.';
    }

    const cleanName = typeof name === 'string' ? name.trim() : '';
    if (!cleanName) {
      errors.name = 'Calculation name is required.';
    } else if (cleanName.length > 100) {
      errors.name = 'Name cannot exceed 100 characters.';
    }

    if (!inputData) {
      errors.inputData = 'Input data is required.';
    }

    if (!resultData) {
      errors.resultData = 'Result data is required.';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors, message: 'Validation failed.' }, { status: 400 });
    }

    const parsedInputs = typeof inputData === 'string' ? JSON.parse(inputData) : inputData;
    const parsedResults = typeof resultData === 'string' ? JSON.parse(resultData) : resultData;

    const calculation = await SavedCalculation.create({
      userId: user.id,
      calculatorType,
      name: cleanName,
      inputData: parsedInputs,
      resultData: parsedResults,
    });

    await logActivity(
      user.id,
      `SAVE_${calculatorType}_CALCULATION`,
      `Saved ${calculatorType} calculation "${cleanName}"`,
      { calculationId: calculation._id.toString(), calculatorType }
    );

    return NextResponse.json(
      {
        success: true,
        calculation,
        message: 'Calculation saved successfully!',
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[POST /api/calculations Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to save calculation.' }, { status: 500 });
  }
}
