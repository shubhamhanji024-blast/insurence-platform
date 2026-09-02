import connectToDatabase from '@/lib/mongodb';
import Activity from '@/models/Activity';

/**
 * Log user activity to MongoDB (Server-side only)
 */
export async function logActivity(userId, activityType, description, metadata = null) {
  try {
    if (!userId || !activityType || !description) return null;
    await connectToDatabase();
    return await Activity.create({
      userId,
      activityType,
      description,
      metadata: metadata || null,
    });
  } catch (err) {
    console.error('[Activity Log Error]:', err.message);
    return null;
  }
}
