/**
 * Input Sanitization & Server-Side Validation Helper for Contact Enquiries
 */

export const ALLOWED_SERVICES = [
  'Financial Planning',
  'Investment Planning',
  'Retirement Planning',
  'Tax Planning',
  'Insurance Guidance',
  'Wealth Management',
  'General Enquiry',
  'Other',
];

export function sanitizeText(text) {
  if (typeof text !== 'string') return '';
  return text
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim()) && email.length <= 255;
}

export function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string' || phone.trim() === '') return true; // Phone is optional
  const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
  return /^\d{7,15}$/.test(cleanPhone);
}

export function validateContactInput({ name, email, phone, service, message }) {
  const errors = {};

  const cleanName = sanitizeText(name);
  const cleanEmail = (email || '').trim();
  const cleanPhone = (phone || '').trim();
  const cleanService = (service || '').trim();
  const cleanMessage = sanitizeText(message);

  // 1. Full Name
  if (!cleanName) {
    errors.name = 'Please enter your full name.';
  } else if (cleanName.length < 2) {
    errors.name = 'Full name must contain at least 2 characters.';
  } else if (cleanName.length > 100) {
    errors.name = 'Full name cannot exceed 100 characters.';
  }

  // 2. Email Address
  if (!cleanEmail) {
    errors.email = 'Please enter your email address.';
  } else if (!isValidEmail(cleanEmail)) {
    errors.email = 'Please enter a valid email address.';
  }

  // 3. Phone Number (Optional)
  if (cleanPhone && !isValidPhone(cleanPhone)) {
    errors.phone = 'Please enter a valid phone number (e.g. 10-digit mobile number).';
  }

  // 4. Service Interested In (Optional, but if provided must match allowed list)
  if (cleanService && !ALLOWED_SERVICES.includes(cleanService)) {
    errors.service = 'Please select a valid service option.';
  }

  // 5. Message
  if (!cleanMessage) {
    errors.message = 'Please enter your message.';
  } else if (cleanMessage.length < 10) {
    errors.message = 'Message must contain at least 10 characters.';
  } else if (cleanMessage.length > 2000) {
    errors.message = 'Message cannot exceed 2000 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      service: cleanService || 'General Enquiry',
      message: cleanMessage,
    },
  };
}
