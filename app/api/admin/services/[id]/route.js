import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import Service from '@/models/Service';
import { logAdminActivity } from '@/lib/logActivity';

// GET /api/admin/services/[id]
export async function GET(req, { params }) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    const { id } = await params;
    const service = await Service.findById(id);
    if (!service) {
      return NextResponse.json({ success: false, message: 'Service not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { service } });
  } catch (err) {
    console.error('[Admin Service GET Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to fetch service.' }, { status: 500 });
  }
}

// PUT / PATCH /api/admin/services/[id] — Update service
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

    const { name, description, category, icon, status, features, order } = body || {};

    const updateDoc = {};
    if (name) {
      updateDoc.name = name.trim();
      updateDoc.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (description !== undefined) updateDoc.description = description.trim();
    if (category !== undefined) updateDoc.category = category.trim();
    if (icon !== undefined) updateDoc.icon = icon.trim();
    if (status !== undefined) {
      if (!['ACTIVE', 'INACTIVE'].includes(status)) {
        return NextResponse.json({ success: false, message: 'Status must be ACTIVE or INACTIVE.' }, { status: 400 });
      }
      updateDoc.status = status;
    }
    if (features !== undefined) {
      updateDoc.features = Array.isArray(features) ? features.filter(Boolean) : [];
    }
    if (order !== undefined) updateDoc.order = Number(order);

    const updated = await Service.findByIdAndUpdate(
      id,
      { $set: updateDoc },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Service not found.' }, { status: 404 });
    }

    await logAdminActivity({
      adminEmail: adminUser.email,
      adminName: adminUser.fullName,
      action: 'SERVICE_UPDATED',
      targetType: 'SERVICE',
      targetId: id,
      details: `Updated service "${updated.name}" (Status: ${updated.status})`,
      req,
    });

    return NextResponse.json({
      success: true,
      message: 'Service updated successfully.',
      data: { service: updated },
    });
  } catch (err) {
    console.error('[Admin Service Update Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to update service.' }, { status: 500 });
  }
}

// DELETE /api/admin/services/[id] — Delete service
export async function DELETE(req, { params }) {
  const { user: adminUser, error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    const { id } = await params;

    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      return NextResponse.json({ success: false, message: 'Service not found.' }, { status: 404 });
    }

    await logAdminActivity({
      adminEmail: adminUser.email,
      adminName: adminUser.fullName,
      action: 'SERVICE_DELETED',
      targetType: 'SERVICE',
      targetId: id,
      details: `Deleted service "${service.name}"`,
      req,
    });

    return NextResponse.json({
      success: true,
      message: `Service "${service.name}" deleted successfully.`,
    });
  } catch (err) {
    console.error('[Admin Service DELETE Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to delete service.' }, { status: 500 });
  }
}
