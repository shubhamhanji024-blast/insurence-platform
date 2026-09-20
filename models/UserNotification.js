import mongoose from 'mongoose';

const UserNotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['GOAL', 'APPOINTMENT', 'CONTACT', 'SYSTEM', 'ACCOUNT'],
      default: 'SYSTEM',
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    link: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

UserNotificationSchema.index({ userId: 1, createdAt: -1 });

UserNotificationSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

UserNotificationSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.models.UserNotification ||
  mongoose.model('UserNotification', UserNotificationSchema, 'user_notifications');
