import mongoose, { Schema, Document, Model } from 'mongoose';

export enum CohortStatus {
  UPCOMING = 'upcoming',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface ICohort extends Document {
  _id: mongoose.Types.ObjectId;
  programId: mongoose.Types.ObjectId;
  name: string;
  code: string;
  status: CohortStatus;
  startDate: Date;
  endDate?: Date;
  maxLearners?: number;
  learners: mongoose.Types.ObjectId[];
  facilitators: mongoose.Types.ObjectId[];
  schedule?: {
    timezone: string;
    sessionDays: string[];
    sessionTime?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CohortSchema = new Schema<ICohort>(
  {
    programId: {
      type: Schema.Types.ObjectId,
      ref: 'Program',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    status: {
      type: String,
      enum: Object.values(CohortStatus),
      default: CohortStatus.UPCOMING,
      index: true
    },
    startDate: {
      type: Date,
      required: true,
      index: true
    },
    endDate: {
      type: Date
    },
    maxLearners: {
      type: Number
    },
    learners: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    facilitators: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    schedule: {
      timezone: {
        type: String,
        default: 'Africa/Kampala'
      },
      sessionDays: [{
        type: String
      }],
      sessionTime: String
    }
  },
  {
    timestamps: true
  }
);

// Indexes
CohortSchema.index({ programId: 1, status: 1 });
CohortSchema.index({ startDate: 1, endDate: 1 });

const Cohort: Model<ICohort> = mongoose.models.Cohort || mongoose.model<ICohort>('Cohort', CohortSchema);

export default Cohort;
