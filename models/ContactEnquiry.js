import mongoose from 'mongoose';

const ContactEnquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    service: {
      type: String,
      required: [true, 'Service is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['NEW', 'READ', 'IN_PROGRESS', 'RESPONDED', 'CLOSED'],
      default: 'NEW',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

ContactEnquirySchema.index({ createdAt: -1 });

ContactEnquirySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

ContactEnquirySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.models.ContactEnquiry ||
  mongoose.model('ContactEnquiry', ContactEnquirySchema, 'contact_enquiries');
