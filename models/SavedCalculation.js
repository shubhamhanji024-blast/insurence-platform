import mongoose from 'mongoose';

const SavedCalculationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    calculatorType: {
      type: String,
      enum: ['SIP', 'EMI', 'LUMPSUM', 'RETIREMENT'],
      required: [true, 'Calculator type is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Calculation name is required'],
      trim: true,
    },
    inputData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    resultData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

SavedCalculationSchema.index({ userId: 1, calculatorType: 1, createdAt: -1 });

SavedCalculationSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

SavedCalculationSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.models.SavedCalculation ||
  mongoose.model('SavedCalculation', SavedCalculationSchema, 'saved_calculations');
