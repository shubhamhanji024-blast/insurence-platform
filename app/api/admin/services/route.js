import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import Service from '@/models/Service';
import { logAdminActivity } from '@/lib/logActivity';
import { escapeRegex } from '@/lib/sanitizer';

const DEFAULT_SERVICES = [
  {
    name: 'Financial Planning',
    slug: 'financial-planning',
    description: 'Comprehensive financial roadmaps tailored to your goals, life stages, and risk preferences.',
    category: 'Planning',
    icon: '📊',
    status: 'ACTIVE',
    features: ['Cash Flow Analysis', 'Emergency Fund Planning', 'Debt Management Strategy', 'Net Worth Tracking'],
    order: 1,
  },
  {
    name: 'Investment Planning',
    slug: 'investment-planning',
    description: 'Strategic portfolio construction across equities, mutual funds, bonds, and structured products.',
    category: 'Investments',
    icon: '📈',
    status: 'ACTIVE',
    features: ['Asset Allocation Modeling', 'SIP Optimization', 'Risk Profile Assessment', 'Quarterly Rebalancing'],
    order: 2,
  },
  {
    name: 'Wealth Management',
    slug: 'wealth-management',
    description: 'Bespoke advisory and portfolio oversight for high-net-worth individuals and family offices.',
    category: 'Wealth',
    icon: '💎',
    status: 'ACTIVE',
    features: ['High-Net-Worth Advisory', 'Estate Planning Support', 'Private Equity & AIFs', 'Dedicated Wealth Advisor'],
    order: 3,
  },
  {
    name: 'Retirement Planning',
    slug: 'retirement-planning',
    description: 'Corpus projection, pension setup, and annuity structures ensuring lifelong financial freedom.',
    category: 'Retirement',
    icon: '🏖️',
    status: 'ACTIVE',
    features: ['Corpus Gap Analysis', 'Inflation-Adjusted Projections', 'NPS & Pension Strategy', 'Post-Retirement Cash Flows'],
    order: 4,
  },
  {
    name: 'Tax Planning',
    slug: 'tax-planning',
    description: 'Proactive tax mitigation, Section 80C/80D optimization, and capital gains tax planning.',
    category: 'Taxation',
    icon: '⚖️',
    status: 'ACTIVE',
    features: ['Section 80C/80D Guidance', 'Capital Gains Optimization', 'Advance Tax Estimation', 'Annual Tax Harvesting'],
    order: 5,
  },
  {
    name: 'Insurance Planning',
    slug: 'insurance-planning',
    description: 'Robust risk protection covering term life, comprehensive health, critical illness, and asset cover.',
    category: 'Insurance',
    icon: '🛡️',
    status: 'ACTIVE',
    features: ['Human Life Value (HLV) Calc', 'Health Cover Gap Analysis', 'Critical Illness Riders', 'Claim Assistance Support'],
    order: 6,
  },
];

// GET /api/admin/services — List services (auto-seed defaults if empty)
export async function GET(req) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    let count = await Service.countDocuments();
    if (count === 0) {
      await Service.insertMany(DEFAULT_SERVICES);
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() || '';
    const status = searchParams.get('status')?.trim() || '';

    const query = {};
    if (status && ['ACTIVE', 'INACTIVE'].includes(status)) {
      query.status = status;
    }
    if (search) {
      const safeSearch = escapeRegex(search);
      query.$or = [
        { name: { $regex: safeSearch, $options: 'i' } },
        { description: { $regex: safeSearch, $options: 'i' } },
        { category: { $regex: safeSearch, $options: 'i' } },
      ];
    }

    const services = await Service.find(query).sort({ order: 1, createdAt: 1 });

    return NextResponse.json({
      success: true,
      data: {
        services,
        total: services.length,
      },
    });
  } catch (err) {
    console.error('[Admin Services GET Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to fetch services.' }, { status: 500 });
  }
}

// POST /api/admin/services — Create new service
export async function POST(req) {
  const { user: adminUser, error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    let body;
    try { body = await req.json(); } catch {
      return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
    }

    const { name, description, category, icon, status, features, order } = body || {};

    if (!name || !description) {
      return NextResponse.json({ success: false, message: 'Service name and description are required.' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existing = await Service.findOne({ $or: [{ name: name.trim() }, { slug }] });
    if (existing) {
      return NextResponse.json({ success: false, message: 'A service with this name already exists.' }, { status: 400 });
    }

    const maxOrderDoc = await Service.findOne().sort({ order: -1 });
    const nextOrder = order !== undefined ? Number(order) : (maxOrderDoc?.order || 0) + 1;

    const service = await Service.create({
      name: name.trim(),
      slug,
      description: description.trim(),
      category: category ? category.trim() : 'Financial Planning',
      icon: icon ? icon.trim() : '💼',
      status: status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
      features: Array.isArray(features) ? features.filter(Boolean) : [],
      order: nextOrder,
    });

    await logAdminActivity({
      adminEmail: adminUser.email,
      adminName: adminUser.fullName,
      action: 'SERVICE_CREATED',
      targetType: 'SERVICE',
      targetId: service._id.toString(),
      details: `Created service "${service.name}"`,
      req,
    });

    return NextResponse.json({
      success: true,
      message: 'Service created successfully.',
      data: { service },
    }, { status: 201 });
  } catch (err) {
    console.error('[Admin Services POST Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to create service.' }, { status: 500 });
  }
}
