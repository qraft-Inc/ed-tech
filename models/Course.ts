import mongoose, { Schema, Document, Model } from 'mongoose';

export enum CourseStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export interface ICourse extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  status: CourseStatus;
  level: CourseLevel;
  category: string;
  tags: string[];
  duration?: number; // in minutes
  language: string;
  prerequisites: string[];
  learningObjectives: string[];
  createdBy: mongoose.Types.ObjectId;
  instructors: mongoose.Types.ObjectId[];
  modules: mongoose.Types.ObjectId[];
  totalLessons: number;
  totalQuizzes: number;
  enrollmentCount: number;
  completionCount: number;
  averageRating?: number;
  isPublic: boolean;
  requiresApproval: boolean;
  certificateEnabled: boolean;
  passThreshold: number; // percentage
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      maxlength: 5000
    },
    thumbnail: {
      type: String
    },
    status: {
      type: String,
      enum: Object.values(CourseStatus),
      default: CourseStatus.DRAFT,
      index: true
    },
    level: {
      type: String,
      enum: Object.values(CourseLevel),
      default: CourseLevel.BEGINNER,
      index: true
    },
    category: {
      type: String,
      required: true,
      index: true
    },
    tags: [{
      type: String,
      trim: true
    }],
    duration: {
      type: Number
    },
    language: {
      type: String,
      default: 'en'
    },
    prerequisites: [{
      type: String
    }],
    learningObjectives: [{
      type: String
    }],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    instructors: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    modules: [{
      type: Schema.Types.ObjectId,
      ref: 'Module'
    }],
    totalLessons: {
      type: Number,
      default: 0
    },
    totalQuizzes: {
      type: Number,
      default: 0
    },
    enrollmentCount: {
      type: Number,
      default: 0
    },
    completionCount: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    requiresApproval: {
      type: Boolean,
      default: false
    },
    certificateEnabled: {
      type: Boolean,
      default: true
    },
    passThreshold: {
      type: Number,
      default: 70,
      min: 0,
      max: 100
    }
  },
  {
    timestamps: true
  }
);

// Text search index
CourseSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Compound indexes for common queries
CourseSchema.index({ status: 1, category: 1 });
CourseSchema.index({ status: 1, level: 1 });
CourseSchema.index({ enrollmentCount: -1 });

const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);

export default Course;
