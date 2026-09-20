import mongoose from 'mongoose';

const CalculatorUsageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    calculatorType: {
      type: String,
      enum: ['SIP', 'EMI', 'LUMPSUM', 'RETIREMENT'],
      required: [true, 'Calculator type is required'],
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

CalculatorUsageSchema.index({ createdAt: -1 });

CalculatorUsageSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

CalculatorUsageSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.models.CalculatorUsage ||
  mongoose.model('CalculatorUsage', CalculatorUsageSchema, 'calculator_usages');
