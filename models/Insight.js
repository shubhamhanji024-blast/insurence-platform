import mongoose from 'mongoose';

const InsightSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [500, 'Short description cannot exceed 500 characters'],
      default: '',
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
    },
    featuredImageUrl: {
      type: String,
      trim: true,
      default: null,
    },
    author: {
      type: String,
      trim: true,
      default: 'GrowthNest Team',
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
      default: 'DRAFT',
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

InsightSchema.index({ slug: 1 });
InsightSchema.index({ status: 1, publishedAt: -1 });
InsightSchema.index({ createdAt: -1 });

InsightSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

InsightSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.models.Insight ||
  mongoose.model('Insight', InsightSchema, 'insights');
