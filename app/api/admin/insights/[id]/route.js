import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import Insight from '@/models/Insight';
import { logAdminActivity } from '@/lib/logActivity';

// GET /api/admin/insights/[id]
export async function GET(req, { params }) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    const { id } = await params;
    const insight = await Insight.findById(id);
    if (!insight) {
      return NextResponse.json({ success: false, message: 'Article not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { insight } });
  } catch (err) {
    console.error('[Admin Insight Detail GET Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to fetch article.' }, { status: 500 });
  }
}

// PUT & PATCH /api/admin/insights/[id]
export async function PUT(req, { params }) {
  return handleUpdate(req, params);
}

export async function PATCH(req, { params }) {
  return handleUpdate(req, params);
}

async function handleUpdate(req, params) {
  const { user: adminUser, error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    const { id } = await params;

    let body;
    try { body = await req.json(); } catch {
      return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
    }

    const { title, shortDescription, content, category, featuredImageUrl, tags, status } = body || {};
    const updates = {};

    if (title?.trim()) updates.title = title.trim();
    if (shortDescription !== undefined) updates.shortDescription = shortDescription.trim();
    if (content?.trim()) updates.content = content.trim();
    if (category?.trim()) updates.category = category.trim();
    if (featuredImageUrl !== undefined) updates.featuredImageUrl = featuredImageUrl?.trim() || null;
    if (Array.isArray(tags)) updates.tags = tags;

    if (status && ['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
      updates.status = status;
      if (status === 'PUBLISHED') {
        const current = await Insight.findById(id).select('publishedAt status');
        if (current && current.status !== 'PUBLISHED') {
          updates.publishedAt = new Date();
        }
      }
    }

    const updated = await Insight.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Article not found.' }, { status: 404 });
    }

    await logAdminActivity({
      adminEmail: adminUser.email,
      adminName: adminUser.fullName,
      action: status === 'PUBLISHED' ? 'ARTICLE_PUBLISHED' : 'ARTICLE_UPDATED',
      targetType: 'ARTICLE',
      targetId: id,
      details: `Updated article "${updated.title}" (Status: ${updated.status})`,
      req,
    });

    return NextResponse.json({ success: true, message: 'Article updated.', data: { insight: updated } });
  } catch (err) {
    console.error('[Admin Insight Update Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to update article.' }, { status: 500 });
  }
}

// DELETE /api/admin/insights/[id]
export async function DELETE(req, { params }) {
  const { user: adminUser, error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    const { id } = await params;
    const deleted = await Insight.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Article not found.' }, { status: 404 });
    }

    await logAdminActivity({
      adminEmail: adminUser.email,
      adminName: adminUser.fullName,
      action: 'ARTICLE_DELETED',
      targetType: 'ARTICLE',
      targetId: id,
      details: `Deleted article "${deleted.title}"`,
      req,
    });

    return NextResponse.json({ success: true, message: 'Article deleted.' });
  } catch (err) {
    console.error('[Admin Insight DELETE Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to delete article.' }, { status: 500 });
  }
}
