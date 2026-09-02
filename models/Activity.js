import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    activityType: {
      type: String,
      required: [true, 'Activity type is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

ActivitySchema.index({ userId: 1, createdAt: -1 });

ActivitySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

ActivitySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.models.Activity ||
  mongoose.model('Activity', ActivitySchema, 'activities');
