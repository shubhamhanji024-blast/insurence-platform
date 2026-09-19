import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import PlatformSetting from '@/models/PlatformSetting';
import { logAdminActivity } from '@/lib/logActivity';

const DEFAULT_SETTINGS = {
  siteName: 'GrowthNest',
  tagline: 'Smarter Financial Decisions for a Confident Future',
  supportEmail: 'support@growthnest.com',
  supportPhone: '+91 (800) 476-9840',
  officeAddress: 'GrowthNest Towers, Financial District, Bengaluru, Karnataka, India',
  emailNotifications: true,
  maintenanceMode: false,
  allowRegistrations: true,
  defaultCurrency: 'INR (₹)',
  maxCalculationsPerDay: 50,
  autoConfirmAppointments: false,
};

// GET /api/admin/settings — Retrieve platform configuration
export async function GET(req) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    const doc = await PlatformSetting.findOne({ key: 'platform_config' });
    const settings = doc ? { ...DEFAULT_SETTINGS, ...doc.value } : DEFAULT_SETTINGS;

    return NextResponse.json({
      success: true,
      data: { settings },
    });
  } catch (err) {
    console.error('[Admin Settings GET Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to fetch settings.' }, { status: 500 });
  }
}

// PUT /api/admin/settings — Update platform configuration
export async function PUT(req) {
  const { user: adminUser, error } = await requireAdmin(req);
  if (error) return error;

  try {
    await connectToDatabase();
    let body;
    try { body = await req.json(); } catch {
      return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
    }

    const {
      siteName,
      tagline,
      supportEmail,
      supportPhone,
      officeAddress,
      emailNotifications,
      maintenanceMode,
      allowRegistrations,
      defaultCurrency,
      maxCalculationsPerDay,
      autoConfirmAppointments,
    } = body || {};

    const cleanSettings = {
      siteName: siteName ? String(siteName).trim() : DEFAULT_SETTINGS.siteName,
      tagline: tagline ? String(tagline).trim() : DEFAULT_SETTINGS.tagline,
      supportEmail: supportEmail ? String(supportEmail).trim() : DEFAULT_SETTINGS.supportEmail,
      supportPhone: supportPhone ? String(supportPhone).trim() : DEFAULT_SETTINGS.supportPhone,
      officeAddress: officeAddress ? String(officeAddress).trim() : DEFAULT_SETTINGS.officeAddress,
      emailNotifications: Boolean(emailNotifications),
      maintenanceMode: Boolean(maintenanceMode),
      allowRegistrations: Boolean(allowRegistrations),
      defaultCurrency: defaultCurrency ? String(defaultCurrency).trim() : DEFAULT_SETTINGS.defaultCurrency,
      maxCalculationsPerDay: Number(maxCalculationsPerDay) || 50,
      autoConfirmAppointments: Boolean(autoConfirmAppointments),
    };

    const updated = await PlatformSetting.findOneAndUpdate(
      { key: 'platform_config' },
      {
        key: 'platform_config',
        value: cleanSettings,
        description: 'General platform and administrative preferences',
      },
      { upsert: true, new: true }
    );

    await logAdminActivity({
      adminEmail: adminUser.email,
      adminName: adminUser.fullName,
      action: 'SETTINGS_UPDATED',
      targetType: 'SETTINGS',
      targetId: 'platform_config',
      details: 'Admin modified platform preferences and settings',
      req,
    });

    return NextResponse.json({
      success: true,
      message: 'Platform settings saved successfully.',
      data: { settings: updated.value },
    });
  } catch (err) {
    console.error('[Admin Settings PUT Error]:', err.message);
    return NextResponse.json({ success: false, message: 'Failed to save settings.' }, { status: 500 });
  }
}
