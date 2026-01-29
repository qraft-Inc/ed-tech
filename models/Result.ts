import mongoose, { Schema, Document, Model } from 'mongoose';

export enum ResultStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  GRADED = 'graded',
  FAILED = 'failed'
}

export interface IResult extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  quizId: mongoose.Types.ObjectId;
  enrollmentId?: mongoose.Types.ObjectId;
  attemptNumber: number;
  status: ResultStatus;
  startedAt: Date;
  submittedAt?: Date;
  gradedAt?: Date;
  score: number; // percentage
  pointsEarned: number;
  totalPoints: number;
  passed: boolean;
  timeSpent?: number; // in seconds
  answers: mongoose.Types.ObjectId[];
  feedback?: string;
  gradedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ResultSchema = new Schema<IResult>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    quizId: {
      type: Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
      index: true
    },
    enrollmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Enrollment',
      index: true
    },
    attemptNumber: {
      type: Number,
      required: true,
      default: 1
    },
    status: {
      type: String,
      enum: Object.values(ResultStatus),
      default: ResultStatus.IN_PROGRESS,
      index: true
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    submittedAt: {
      type: Date
    },
    gradedAt: {
      type: Date
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    pointsEarned: {
      type: Number,
      default: 0
    },
    totalPoints: {
      type: Number,
      required: true
    },
    passed: {
      type: Boolean,
      default: false
    },
    timeSpent: {
      type: Number
    },
    answers: [{
      type: Schema.Types.ObjectId,
      ref: 'Answer'
    }],
    feedback: {
      type: String
    },
    gradedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes
ResultSchema.index({ userId: 1, quizId: 1 });
ResultSchema.index({ userId: 1, quizId: 1, attemptNumber: 1 }, { unique: true });
ResultSchema.index({ quizId: 1, status: 1 });
ResultSchema.index({ enrollmentId: 1 });

const Result: Model<IResult> = mongoose.models.Result || mongoose.model<IResult>('Result', ResultSchema);

export default Result;
