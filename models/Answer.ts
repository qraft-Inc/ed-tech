import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnswer extends Document {
  _id: mongoose.Types.ObjectId;
  resultId: mongoose.Types.ObjectId;
  questionId: mongoose.Types.ObjectId;
  answer: string | string[]; // string for single, array for multiple
  isCorrect?: boolean;
  pointsEarned: number;
  timeSpent?: number; // in seconds
  createdAt: Date;
}

const AnswerSchema = new Schema<IAnswer>(
  {
    resultId: {
      type: Schema.Types.ObjectId,
      ref: 'Result',
      required: true,
      index: true
    },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
      index: true
    },
    answer: {
      type: Schema.Types.Mixed,
      required: true
    },
    isCorrect: {
      type: Boolean
    },
    pointsEarned: {
      type: Number,
      default: 0
    },
    timeSpent: {
      type: Number
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

// Indexes
AnswerSchema.index({ resultId: 1, questionId: 1 });

const Answer: Model<IAnswer> = mongoose.models.Answer || mongoose.model<IAnswer>('Answer', AnswerSchema);

export default Answer;
