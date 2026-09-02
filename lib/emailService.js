/**
 * Environment-variable driven Email Notification Abstraction
 * Supports SMTP/Sendgrid/Resend or custom provider via standard Node environment variables.
 *
 * ENV VARIABLES:
 * - EMAIL_ENABLED (true/false)
 * - EMAIL_SERVER_HOST (e.g. smtp.gmail.com)
 * - EMAIL_SERVER_PORT (e.g. 587)
 * - EMAIL_SERVER_USER
 * - EMAIL_SERVER_PASSWORD
 * - EMAIL_FROM (e.g. "GrowthNest Team <no-reply@growthnest.com>")
 * - ADMIN_NOTIFICATION_EMAIL (e.g. admin@growthnest.com)
 */

export async function sendEnquiryNotificationEmail(enquiry) {
  const isEnabled = process.env.EMAIL_ENABLED === 'true';
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;

  if (!isEnabled || !adminEmail) {
    // Email is not configured or disabled; log for debugging and return gracefully without failing enquiry submission
    console.log('[EmailService] Email notification disabled or unconfigured. Enquiry saved successfully.');
    return { success: true, status: 'skipped' };
  }

  try {
    // Dynamic import of nodemailer if installed/configured
    const nodemailer = await import('nodemailer').catch(() => null);

    if (!nodemailer) {
      console.log('[EmailService] Nodemailer package not installed. Skipping email transmission.');
      return { success: true, status: 'skipped' };
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT) || 587,
      secure: Number(process.env.EMAIL_SERVER_PORT) === 465,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'GrowthNest <no-reply@growthnest.com>',
      to: adminEmail,
      subject: `New GrowthNest Enquiry - ${enquiry.name}`,
      text: `
New GrowthNest Enquiry Received!

Name: ${enquiry.name}
Email: ${enquiry.email}
Phone: ${enquiry.phone || 'N/A'}
Service: ${enquiry.service}
Submission Date: ${new Date(enquiry.createdAt || Date.now()).toLocaleString()}

Message:
${enquiry.message}
      `,
    };

    await transporter.sendMail(mailOptions);

    // Optional customer confirmation email
    if (process.env.SEND_CUSTOMER_CONFIRMATION === 'true' && enquiry.email) {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'GrowthNest <no-reply@growthnest.com>',
        to: enquiry.email,
        subject: 'We received your enquiry — GrowthNest',
        text: `Hello ${enquiry.name},\n\nThank you for contacting GrowthNest. Your enquiry regarding "${enquiry.service}" has been received. Our senior financial advisor will review your message and reach out shortly.\n\nBest regards,\nGrowthNest Wealth Team`,
      });
    }

    return { success: true, status: 'sent' };
  } catch (err) {
    // Email transmission error should be logged silently without failing the stored database enquiry
    console.error('[EmailService Error]:', err.message);
    return { success: false, error: err.message };
  }
}
