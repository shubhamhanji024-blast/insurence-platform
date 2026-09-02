import mongoose from 'mongoose';

const FinancialGoalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Goal name is required'],
      trim: true,
    },
    goalType: {
      type: String,
      enum: [
        'RETIREMENT',
        'HOME_PURCHASE',
        'EMERGENCY_FUND',
        'EDUCATION',
        'VEHICLE',
        'TRAVEL',
        'INVESTMENT',
        'OTHER',
      ],
      required: [true, 'Goal type is required'],
    },
    targetAmount: {
      type: Number,
      required: [true, 'Target amount is required'],
      min: [0, 'Target amount must be positive'],
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: [0, 'Current amount must be positive'],
    },
    targetDate: {
      type: Date,
      default: null,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ACHIEVED', 'PAUSED', 'ARCHIVED'],
      default: 'ACTIVE',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

FinancialGoalSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

FinancialGoalSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.models.FinancialGoal ||
  mongoose.model('FinancialGoal', FinancialGoalSchema, 'financial_goals');
