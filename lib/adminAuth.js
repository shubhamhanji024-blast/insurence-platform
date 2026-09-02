/**
 * Admin Authentication Middleware
 * ─────────────────────────────────
 * Validates that the request comes from an authenticated user with role=ADMIN.
 * Used in every /api/admin/* route handler.
 *
 * Usage in a route:
 *   const { user, error } = await requireAdmin(req);
 *   if (error) return error;   // NextResponse with 401/403
 *   // use user.id, user.email, etc.
 */

import { NextResponse } from 'next/server';
import { getCurrentUserFromReq } from '@/lib/auth';

/**
 * Verify the request has a valid admin session.
 * Returns { user } on success or { error: NextResponse } on failure.
 */
export async function requireAdmin(req) {
  const user = await getCurrentUserFromReq(req);

  if (!user) {
    return {
      error: NextResponse.json(
        { success: false, message: 'Authentication required. Please log in.' },
        { status: 401 }
      ),
    };
  }

  if (user.role !== 'ADMIN') {
    return {
      error: NextResponse.json(
        { success: false, message: 'Access denied. Admin privileges required.' },
        { status: 403 }
      ),
    };
  }

  return { user };
}
