import mongoose from 'mongoose';

const AdminNotificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['USER', 'ENQUIRY', 'APPOINTMENT', 'SYSTEM'],
      default: 'SYSTEM',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      default: '/admin',
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

AdminNotificationSchema.index({ createdAt: -1 });

export default mongoose.models.AdminNotification || mongoose.model('AdminNotification', AdminNotificationSchema);
