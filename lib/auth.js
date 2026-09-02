import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const COOKIE_NAME = 'gn_session';

function getJwtSecret() {
  return process.env.AUTH_SECRET || 'growthnest_jwt_secret_key_change_in_production_2026';
}

/**
 * Hash plain text password securely with bcrypt
 */
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare plain text password against stored hash
 */
export async function comparePassword(password, hash) {
  if (!password || !hash) return false;
  return bcrypt.compare(password, hash);
}

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
 * Sign JWT session token
 */
export function signToken(payload, rememberMe = false) {
  const expiresIn = rememberMe ? '30d' : '7d';
  return jwt.sign(payload, getJwtSecret(), { expiresIn });
}

/**
 * Verify JWT session token
 */
export function verifyToken(token) {
  try {
    if (!token) return null;
    return jwt.verify(token, getJwtSecret());
  } catch {
    return null;
  }
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

/**
 * Get current authenticated user from request cookies (Server side only)
 */
export async function getCurrentUserFromReq(req) {
  try {
    const connectToDatabase = (await import('@/lib/mongodb')).default;
    const User = (await import('@/models/User')).default;
    
    await connectToDatabase();
    let token = null;

    if (req && req.cookies && typeof req.cookies.get === 'function') {
      token = req.cookies.get(COOKIE_NAME)?.value;
    } else if (req && req.headers) {
      const cookieHeader = typeof req.headers.get === 'function' ? req.headers.get('cookie') : req.headers?.cookie;
      if (cookieHeader) {
        const match = cookieHeader.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
        if (match) token = decodeURIComponent(match[1]);
      }
    }

    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) return null;

    const user = await User.findById(decoded.id);

    if (!user) return null;

    return toSafeUser(user);
  } catch (err) {
    console.error('[getCurrentUserFromReq Error]:', err.message);
    return null;
  }
}
