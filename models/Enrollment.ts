import mongoose, { Schema, Document, Model } from 'mongoose';

export enum EnrollmentStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DROPPED = 'dropped',
  SUSPENDED = 'suspended'
}

export interface ILessonProgress {
  lessonId: mongoose.Types.ObjectId;
  completed: boolean;
  completedAt?: Date;
  timeSpent: number; // in seconds
  lastPosition?: number; // for video/audio lessons
}

export interface IModuleProgress {
  moduleId: mongoose.Types.ObjectId;
  lessonsCompleted: number;
  totalLessons: number;
  progress: number; // percentage
}

export interface IEnrollment extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  programId?: mongoose.Types.ObjectId;
  cohortId?: mongoose.Types.ObjectId;
  status: EnrollmentStatus;
  enrolledAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  lastAccessedAt?: Date;
  progress: number; // overall percentage
  moduleProgress: IModuleProgress[];
  lessonProgress: ILessonProgress[];
  totalTimeSpent: number; // in seconds
  preTestScore?: number;
  postTestScore?: number;
  averageQuizScore?: number;
  certificateIssued: boolean;
  certificateId?: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true
    },
    programId: {
      type: Schema.Types.ObjectId,
      ref: 'Program',
      index: true
    },
    cohortId: {
      type: Schema.Types.ObjectId,
      ref: 'Cohort',
      index: true
    },
    status: {
      type: String,
      enum: Object.values(EnrollmentStatus),
      default: EnrollmentStatus.ACTIVE,
      index: true
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    startedAt: {
      type: Date
    },
    completedAt: {
      type: Date,
      index: true
    },
    lastAccessedAt: {
      type: Date,
      index: true
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    moduleProgress: [{
      moduleId: {
        type: Schema.Types.ObjectId,
        ref: 'Module'
      },
      lessonsCompleted: Number,
      totalLessons: Number,
      progress: Number
    }],
    lessonProgress: [{
      lessonId: {
        type: Schema.Types.ObjectId,
        ref: 'Lesson'
      },
      completed: {
        type: Boolean,
        default: false
      },
      completedAt: Date,
      timeSpent: {
        type: Number,
        default: 0
      },
      lastPosition: Number
    }],
    totalTimeSpent: {
      type: Number,
      default: 0
    },
    preTestScore: {
      type: Number,
      min: 0,
      max: 100
    },
    postTestScore: {
      type: Number,
      min: 0,
      max: 100
    },
    averageQuizScore: {
      type: Number,
      min: 0,
      max: 100
    },
    certificateIssued: {
      type: Boolean,
      default: false
    },
    certificateId: {
      type: Schema.Types.ObjectId,
      ref: 'Certificate'
    },
    notes: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Compound unique index
EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Indexes for analytics
EnrollmentSchema.index({ status: 1, completedAt: 1 });
EnrollmentSchema.index({ courseId: 1, status: 1 });
EnrollmentSchema.index({ programId: 1, status: 1 });
EnrollmentSchema.index({ progress: 1 });

const Enrollment: Model<IEnrollment> = mongoose.models.Enrollment || mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);

export default Enrollment;
