import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { getCurrentUserFromReq } from '@/lib/auth';
import SavedCalculation from '@/models/SavedCalculation';
import { logActivity } from '@/lib/activityServer';

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const user = await getCurrentUserFromReq(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const calc = await SavedCalculation.findById(id);

    if (!calc || calc.userId.toString() !== user.id) {
      return NextResponse.json({ success: false, message: 'Saved calculation not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      calculation: calc,
    });
  } catch (err) {
    console.error('[GET /api/calculations/[id] Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const user = await getCurrentUserFromReq(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const calc = await SavedCalculation.findById(id);

    if (!calc || calc.userId.toString() !== user.id) {
      return NextResponse.json({ success: false, message: 'Saved calculation not found.' }, { status: 404 });
    }

    await SavedCalculation.findByIdAndDelete(id);

    await logActivity(
      user.id,
      'DELETE_CALCULATION',
      `Deleted ${calc.calculatorType} calculation "${calc.name}"`,
      { calculationId: id, calculatorType: calc.calculatorType }
    );

    return NextResponse.json({ success: true, message: 'Calculation deleted successfully.' });
  } catch (err) {
    console.error('[DELETE /api/calculations/[id] Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to delete calculation.' }, { status: 500 });
  }
}
