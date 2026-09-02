/**
 * Pure client-safe authentication utilities with zero database or server dependencies.
 */

export const COOKIE_NAME = 'gn_session';

/**
 * Password Strength Checker
 * Requires min 8 chars, uppercase, lowercase, and digit.
 */
export function checkPasswordStrength(password) {
  if (!password || typeof password !== 'string') {
    return { score: 0, label: 'Weak', isStrongEnough: false };
  }

  let score = 0;
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (hasMinLength) score += 1;
  if (hasUpper && hasLower) score += 1;
  if (hasDigit) score += 1;
  if (hasSpecial) score += 1;
  if (password.length >= 12) score += 1;

  let label = 'Weak';
  if (score >= 4) {
    label = 'Strong';
  } else if (score >= 2) {
    label = 'Medium';
  }

  const isStrongEnough = hasMinLength && hasUpper && hasLower && hasDigit;

  return { score, label, isStrongEnough, hasMinLength, hasUpper, hasLower, hasDigit };
}

/**
 * Strip sensitive attributes before returning user object to frontend
 */
export function toSafeUser(user) {
  if (!user) return null;
  const obj = typeof user.toJSON === 'function' ? user.toJSON() : { ...user };
  if (obj._id) obj.id = obj._id.toString();
  delete obj.passwordHash;
  delete obj.__v;
  return obj;
}
