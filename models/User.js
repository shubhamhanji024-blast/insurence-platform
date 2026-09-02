import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false, // Do not return passwordHash by default in queries
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
      index: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Virtual for id string representation
UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

UserSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema, 'users');
