import mongoose, { Schema, Document, Model } from 'mongoose';

export enum UserRole {
  LEARNER = 'learner',
  FACILITATOR = 'facilitator',
  PARTNER_ADMIN = 'partner_admin',
  SYSTEM_ADMIN = 'system_admin'
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLogin?: Date;
  partnerId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    phone: {
      type: String,
      sparse: true,
      index: true
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.LEARNER,
      index: true
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    phoneVerified: {
      type: Boolean,
      default: false
    },
    lastLogin: {
      type: Date
    },
    partnerId: {
      type: Schema.Types.ObjectId,
      ref: 'Partner',
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for common queries
UserSchema.index({ role: 1, isActive: 1 });
UserSchema.index({ partnerId: 1, role: 1 });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
