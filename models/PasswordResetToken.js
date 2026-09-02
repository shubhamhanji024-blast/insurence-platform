import mongoose from 'mongoose';

const PasswordResetTokenSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.PasswordResetToken ||
  mongoose.model('PasswordResetToken', PasswordResetTokenSchema, 'password_reset_tokens');
