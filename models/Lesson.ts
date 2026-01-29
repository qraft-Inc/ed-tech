import mongoose, { Schema, Document, Model } from 'mongoose';

export enum LessonType {
  VIDEO = 'video',
  TEXT = 'text',
  AUDIO = 'audio',
  PDF = 'pdf',
  INTERACTIVE = 'interactive',
  QUIZ = 'quiz'
}

export interface IVideoContent {
  cloudinaryId: string;
  url: string;
  duration: number; // in seconds
  thumbnail?: string;
  subtitles?: {
    language: string;
    url: string;
  }[];
  qualities: {
    quality: string; // e.g., '720p', '480p', '360p'
    url: string;
    bandwidth: number; // in kbps
  }[];
}

export interface IAudioContent {
  cloudinaryId: string;
  url: string;
  duration: number; // in seconds
  transcript?: string;
}

export interface IPDFContent {
  cloudinaryId: string;
  url: string;
  pageCount?: number;
}

export interface ILesson extends Document {
  _id: mongoose.Types.ObjectId;
  moduleId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  type: LessonType;
  order: number;
  content: {
    text?: string;
    video?: IVideoContent;
    audio?: IAudioContent;
    pdf?: IPDFContent;
    externalUrl?: string;
  };
  duration?: number; // in minutes
  resources: {
    title: string;
    url: string;
    type: string;
  }[];
  isPreview: boolean; // can be accessed without enrollment
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>(
  {
    moduleId: {
      type: Schema.Types.ObjectId,
      ref: 'Module',
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
    type: {
      type: String,
      enum: Object.values(LessonType),
      required: true,
      index: true
    },
    order: {
      type: Number,
      required: true,
      default: 0
    },
    content: {
      text: String,
      video: {
        cloudinaryId: String,
        url: String,
        duration: Number,
        thumbnail: String,
        subtitles: [{
          language: String,
          url: String
        }],
        qualities: [{
          quality: String,
          url: String,
          bandwidth: Number
        }]
      },
      audio: {
        cloudinaryId: String,
        url: String,
        duration: Number,
        transcript: String
      },
      pdf: {
        cloudinaryId: String,
        url: String,
        pageCount: Number
      },
      externalUrl: String
    },
    duration: {
      type: Number
    },
    resources: [{
      title: String,
      url: String,
      type: String
    }],
    isPreview: {
      type: Boolean,
      default: false
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
LessonSchema.index({ moduleId: 1, order: 1 });
LessonSchema.index({ moduleId: 1, isPublished: 1 });
LessonSchema.index({ type: 1 });

const Lesson: Model<ILesson> = mongoose.models.Lesson || mongoose.model<ILesson>('Lesson', LessonSchema);

export default Lesson;
