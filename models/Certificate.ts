import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICertificate extends Document {
  _id: mongoose.Types.ObjectId;
  certificateNumber: string;
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  enrollmentId: mongoose.Types.ObjectId;
  programId?: mongoose.Types.ObjectId;
  issuedAt: Date;
  expiresAt?: Date;
  learnerName: string;
  courseName: string;
  finalScore?: number;
  completionDate: Date;
  instructors: string[];
  pdfUrl?: string;
  verificationUrl: string;
  metadata?: {
    totalHours?: number;
    grade?: string;
    skills?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    certificateNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true
    },
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
    enrollmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Enrollment',
      required: true,
      unique: true
    },
    programId: {
      type: Schema.Types.ObjectId,
      ref: 'Program',
      index: true
    },
    issuedAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    expiresAt: {
      type: Date
    },
    learnerName: {
      type: String,
      required: true
    },
    courseName: {
      type: String,
      required: true
    },
    finalScore: {
      type: Number,
      min: 0,
      max: 100
    },
    completionDate: {
      type: Date,
      required: true
    },
    instructors: [{
      type: String
    }],
    pdfUrl: {
      type: String
    },
    verificationUrl: {
      type: String,
      required: true
    },
    metadata: {
      totalHours: Number,
      grade: String,
      skills: [String]
    }
  },
  {
    timestamps: true
  }
);

// Indexes
CertificateSchema.index({ userId: 1, courseId: 1 });
CertificateSchema.index({ programId: 1, issuedAt: 1 });

const Certificate: Model<ICertificate> = mongoose.models.Certificate || mongoose.model<ICertificate>('Certificate', CertificateSchema);

export default Certificate;
