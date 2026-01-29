import mongoose, { Schema, Document, Model } from 'mongoose';

export enum QuizType {
  PRE_TEST = 'pre_test',
  POST_TEST = 'post_test',
  MODULE_QUIZ = 'module_quiz',
  PRACTICE = 'practice'
}

export interface IQuiz extends Document {
  _id: mongoose.Types.ObjectId;
  courseId?: mongoose.Types.ObjectId;
  moduleId?: mongoose.Types.ObjectId;
  lessonId?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  type: QuizType;
  questions: mongoose.Types.ObjectId[];
  duration?: number; // in minutes
  passingScore: number; // percentage
  attempts: number; // max attempts allowed, 0 = unlimited
  shuffleQuestions: boolean;
  showCorrectAnswers: boolean;
  isPublished: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const QuizSchema = new Schema<IQuiz>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      index: true
    },
    moduleId: {
      type: Schema.Types.ObjectId,
      ref: 'Module',
      index: true
    },
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String
    },
    type: {
      type: String,
      enum: Object.values(QuizType),
      required: true,
      index: true
    },
    questions: [{
      type: Schema.Types.ObjectId,
      ref: 'Question'
    }],
    duration: {
      type: Number
    },
    passingScore: {
      type: Number,
      default: 70,
      min: 0,
      max: 100
    },
    attempts: {
      type: Number,
      default: 3
    },
    shuffleQuestions: {
      type: Boolean,
      default: true
    },
    showCorrectAnswers: {
      type: Boolean,
      default: true
    },
    isPublished: {
      type: Boolean,
      default: false
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

// Indexes
QuizSchema.index({ courseId: 1, type: 1 });
QuizSchema.index({ moduleId: 1, type: 1 });

const Quiz: Model<IQuiz> = mongoose.models.Quiz || mongoose.model<IQuiz>('Quiz', QuizSchema);

export default Quiz;
