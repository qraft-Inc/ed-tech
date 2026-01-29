import mongoose, { Schema, Document, Model } from 'mongoose';

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  SHORT_ANSWER = 'short_answer',
  ESSAY = 'essay',
  MATCHING = 'matching'
}

export interface IOption {
  text: string;
  isCorrect: boolean;
}

export interface IQuestion extends Document {
  _id: mongoose.Types.ObjectId;
  quizId: mongoose.Types.ObjectId;
  type: QuestionType;
  question: string;
  explanation?: string;
  points: number;
  order: number;
  options?: IOption[];
  correctAnswer?: string; // for true/false or short answer
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    quizId: {
      type: Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: Object.values(QuestionType),
      required: true
    },
    question: {
      type: String,
      required: true
    },
    explanation: {
      type: String
    },
    points: {
      type: Number,
      default: 1,
      min: 0
    },
    order: {
      type: Number,
      required: true,
      default: 0
    },
    options: [{
      text: {
        type: String,
        required: true
      },
      isCorrect: {
        type: Boolean,
        default: false
      }
    }],
    correctAnswer: {
      type: String
    },
    imageUrl: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Indexes
QuestionSchema.index({ quizId: 1, order: 1 });

const Question: Model<IQuestion> = mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);

export default Question;
