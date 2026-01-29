import mongoose, { Schema, Document, Model } from 'mongoose';

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  ACCESS = 'access',
  EXPORT = 'export',
  IMPORT = 'import'
}

export enum EntityType {
  USER = 'user',
  PROFILE = 'profile',
  COURSE = 'course',
  MODULE = 'module',
  LESSON = 'lesson',
  ENROLLMENT = 'enrollment',
  QUIZ = 'quiz',
  RESULT = 'result',
  CERTIFICATE = 'certificate',
  PARTNER = 'partner',
  PROGRAM = 'program',
  COHORT = 'cohort',
  REVENUE = 'revenue'
}

export interface IAuditLog extends Document {
  _id: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  action: AuditAction;
  entityType: EntityType;
  entityId?: mongoose.Types.ObjectId;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    action: {
      type: String,
      enum: Object.values(AuditAction),
      required: true,
      index: true
    },
    entityType: {
      type: String,
      enum: Object.values(EntityType),
      required: true,
      index: true
    },
    entityId: {
      type: Schema.Types.ObjectId,
      index: true
    },
    description: {
      type: String,
      required: true
    },
    ipAddress: {
      type: String
    },
    userAgent: {
      type: String
    },
    metadata: {
      type: Schema.Types.Mixed
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

// Indexes for audit queries
AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
AuditLogSchema.index({ action: 1, createdAt: -1 });

const AuditLog: Model<IAuditLog> = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

export default AuditLog;
