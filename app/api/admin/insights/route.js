import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import Insight from '@/models/Insight';

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 100);
}

// GET /api/admin/insights — List insights (all statuses for admin)
export async function GET(req) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;
    const statusFilter = searchParams.get('status')?.trim() || '';
    const search = searchParams.get('search')?.trim() || '';

    const query = {};
    if (statusFilter && ['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(statusFilter)) {
      query.status = statusFilter;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    const [total, insights] = await Promise.all([
      Insight.countDocuments(query),
      Insight.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-content'), // Don't send full content in list
    ]);

    return NextResponse.json({
      success: true,
      data: {
        insights,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (err) {
    console.error('[Admin Insights GET Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to fetch insights.' }, { status: 500 });
  }
}

// POST /api/admin/insights — Create insight
export async function POST(req) {
  const { user, error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    let body;
    try { body = await req.json(); } catch {
      return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
    }

    const { title, shortDescription, content, category, featuredImageUrl, tags, status } = body || {};

    if (!title?.trim()) return NextResponse.json({ success: false, message: 'Title is required.' }, { status: 400 });
    if (!content?.trim()) return NextResponse.json({ success: false, message: 'Content is required.' }, { status: 400 });

    // Generate unique slug
    let slug = generateSlug(title);
    const existing = await Insight.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    const finalStatus = ['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status) ? status : 'DRAFT';

    const insight = await Insight.create({
      title: title.trim(),
      slug,
      shortDescription: shortDescription?.trim() || '',
      content: content.trim(),
      category: category?.trim() || 'General',
      featuredImageUrl: featuredImageUrl?.trim() || null,
      author: user.fullName || 'GrowthNest Team',
      authorId: user.id,
      tags: Array.isArray(tags) ? tags : [],
      status: finalStatus,
      publishedAt: finalStatus === 'PUBLISHED' ? new Date() : null,
    });

    return NextResponse.json(
      { success: true, message: 'Article created successfully.', data: { insight } },
      { status: 201 }
    );
  } catch (err) {
    console.error('[Admin Insights POST Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to create article.' }, { status: 500 });
  }
}
