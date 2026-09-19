import ActivityLog from '@/models/ActivityLog';
import connectToDatabase from '@/lib/mongodb';

export async function logAdminActivity({
  adminEmail,
  adminName = 'Admin',
  action,
  targetType = 'SYSTEM',
  targetId = '',
  details = '',
  req = null,
}) {
  try {
    await connectToDatabase();
    const ip = req
      ? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        req.headers.get('x-real-ip') ||
        '127.0.0.1'
      : '127.0.0.1';

    await ActivityLog.create({
      adminEmail: adminEmail || 'admin@growthnest.com',
      adminName: adminName || 'Admin',
      action,
      targetType,
      targetId: String(targetId || ''),
      details: typeof details === 'object' ? JSON.stringify(details) : String(details),
      ip,
    });
  } catch (err) {
    console.error('[logAdminActivity Error]:', err.message);
  }
}
