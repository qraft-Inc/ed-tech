import mongoose, { Schema, Document, Model } from 'mongoose';

export enum PartnerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended'
}

export enum PartnerType {
  NGO = 'ngo',
  CORPORATE = 'corporate',
  GOVERNMENT = 'government',
  EDUCATION_INSTITUTION = 'education_institution',
  COMMUNITY_ORGANIZATION = 'community_organization'
}

export interface IPartner extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  logo?: string;
  type: PartnerType;
  status: PartnerStatus;
  description?: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  address?: {
    street?: string;
    city?: string;
    district?: string;
    country: string;
  };
  primaryColor?: string;
  secondaryColor?: string;
  adminUsers: mongoose.Types.ObjectId[];
  licenseType?: 'free' | 'basic' | 'premium' | 'enterprise';
  maxLearners?: number;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PartnerSchema = new Schema<IPartner>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    logo: {
      type: String
    },
    type: {
      type: String,
      enum: Object.values(PartnerType),
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: Object.values(PartnerStatus),
      default: PartnerStatus.PENDING,
      index: true
    },
    description: {
      type: String,
      maxlength: 1000
    },
    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    contactPhone: {
      type: String
    },
    website: {
      type: String
    },
    address: {
      street: String,
      city: String,
      district: String,
      country: {
        type: String,
        default: 'Uganda'
      }
    },
    primaryColor: {
      type: String,
      default: '#4F46E5'
    },
    secondaryColor: {
      type: String,
      default: '#10B981'
    },
    adminUsers: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    licenseType: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free'
    },
    maxLearners: {
      type: Number,
      default: 100
    },
    expiresAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Indexes
PartnerSchema.index({ status: 1, licenseType: 1 });
PartnerSchema.index({ 'address.country': 1, 'address.district': 1 });

const Partner: Model<IPartner> = mongoose.models.Partner || mongoose.model<IPartner>('Partner', PartnerSchema);

export default Partner;
