import mongoose, { Schema, Document, Model } from 'mongoose';

export enum RevenueType {
  SUBSCRIPTION = 'subscription',
  LICENSE = 'license',
  TRAINING = 'training',
  CONSULTING = 'consulting',
  GRANT = 'grant',
  DONATION = 'donation',
  OTHER = 'other'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}

export interface IRevenue extends Document {
  _id: mongoose.Types.ObjectId;
  partnerId: mongoose.Types.ObjectId;
  programId?: mongoose.Types.ObjectId;
  type: RevenueType;
  amount: number;
  currency: string;
  status: PaymentStatus;
  description?: string;
  invoiceNumber?: string;
  invoiceDate?: Date;
  dueDate?: Date;
  paidDate?: Date;
  period?: {
    startDate: Date;
    endDate: Date;
  };
  learnerCount?: number;
  costPerLearner?: number;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const RevenueSchema = new Schema<IRevenue>(
  {
    partnerId: {
      type: Schema.Types.ObjectId,
      ref: 'Partner',
      required: true,
      index: true
    },
    programId: {
      type: Schema.Types.ObjectId,
      ref: 'Program',
      index: true
    },
    type: {
      type: String,
      enum: Object.values(RevenueType),
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
      index: true
    },
    description: {
      type: String
    },
    invoiceNumber: {
      type: String,
      unique: true,
      sparse: true
    },
    invoiceDate: {
      type: Date
    },
    dueDate: {
      type: Date,
      index: true
    },
    paidDate: {
      type: Date,
      index: true
    },
    period: {
      startDate: Date,
      endDate: Date
    },
    learnerCount: {
      type: Number
    },
    costPerLearner: {
      type: Number
    },
    notes: {
      type: String
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for financial reporting
RevenueSchema.index({ partnerId: 1, status: 1 });
RevenueSchema.index({ type: 1, status: 1 });
RevenueSchema.index({ paidDate: 1 });
RevenueSchema.index({ 'period.startDate': 1, 'period.endDate': 1 });

const Revenue: Model<IRevenue> = mongoose.models.Revenue || mongoose.model<IRevenue>('Revenue', RevenueSchema);

export default Revenue;
