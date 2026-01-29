import mongoose, { Schema, Document, Model } from 'mongoose';

export enum ProgramStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

export interface IProgram extends Document {
  _id: mongoose.Types.ObjectId;
  partnerId: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  status: ProgramStatus;
  startDate: Date;
  endDate?: Date;
  targetLearners?: number;
  enrolledLearners: number;
  completedLearners: number;
  courses: mongoose.Types.ObjectId[];
  facilitators: mongoose.Types.ObjectId[];
  budget?: number;
  costPerLearner?: number;
  revenue?: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProgramSchema = new Schema<IProgram>(
  {
    partnerId: {
      type: Schema.Types.ObjectId,
      ref: 'Partner',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      maxlength: 2000
    },
    status: {
      type: String,
      enum: Object.values(ProgramStatus),
      default: ProgramStatus.DRAFT,
      index: true
    },
    startDate: {
      type: Date,
      required: true,
      index: true
    },
    endDate: {
      type: Date,
      index: true
    },
    targetLearners: {
      type: Number
    },
    enrolledLearners: {
      type: Number,
      default: 0
    },
    completedLearners: {
      type: Number,
      default: 0
    },
    courses: [{
      type: Schema.Types.ObjectId,
      ref: 'Course'
    }],
    facilitators: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    budget: {
      type: Number
    },
    costPerLearner: {
      type: Number
    },
    revenue: {
      type: Number,
      default: 0
    },
    tags: [{
      type: String,
      trim: true
    }]
  },
  {
    timestamps: true
  }
);

// Compound indexes
ProgramSchema.index({ partnerId: 1, status: 1 });
ProgramSchema.index({ startDate: 1, endDate: 1 });
ProgramSchema.index({ slug: 1, partnerId: 1 }, { unique: true });

const Program: Model<IProgram> = mongoose.models.Program || mongoose.model<IProgram>('Program', ProgramSchema);

export default Program;
