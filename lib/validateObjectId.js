/**
 * MongoDB ObjectId Validation Helper
 * ────────────────────────────────────
 * Validates that a string is a valid MongoDB ObjectId (24-char hex).
 * Use before calling findById() to prevent 500 errors and CastErrors.
 */
import mongoose from 'mongoose';

/**
 * Returns true if the given value is a valid MongoDB ObjectId string.
 * @param {string} id
 * @returns {boolean}
 */
export function isValidObjectId(id) {
  return typeof id === 'string' && mongoose.Types.ObjectId.isValid(id);
}
