import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IModule extends Document {
  _id: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  order: number;
  lessons: mongoose.Types.ObjectId[];
  duration?: number; // in minutes
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ModuleSchema = new Schema<IModule>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      maxlength: 2000
    },
    order: {
      type: Number,
      required: true,
      default: 0
    },
    lessons: [{
      type: Schema.Types.ObjectId,
      ref: 'Lesson'
    }],
    duration: {
      type: Number
    },
    isPublished: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Indexes
ModuleSchema.index({ courseId: 1, order: 1 });
ModuleSchema.index({ courseId: 1, isPublished: 1 });

const Module: Model<IModule> = mongoose.models.Module || mongoose.model<IModule>('Module', ModuleSchema);

export default Module;
