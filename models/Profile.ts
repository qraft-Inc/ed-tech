import mongoose, { Schema, Document, Model } from 'mongoose';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}

export enum LearnerType {
  YOUTH = 'youth',
  REFUGEE = 'refugee',
  WORKER = 'worker',
  STUDENT = 'student',
  OTHER = 'other'
}

export enum AgeRange {
  UNDER_18 = 'under_18',
  AGE_18_24 = '18_24',
  AGE_25_34 = '25_34',
  AGE_35_44 = '35_44',
  AGE_45_PLUS = '45_plus'
}

export interface IAccessibilityPreferences {
  fontSize: 'small' | 'medium' | 'large' | 'extra_large';
  enableCaptions: boolean;
  enableScreenReader: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
}

export interface IProfile extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  displayName?: string;
  avatar?: string;
  gender?: Gender;
  ageRange?: AgeRange;
  learnerType?: LearnerType;
  country?: string;
  district?: string;
  bio?: string;
  accessibilityPreferences: IAccessibilityPreferences;
  lowBandwidthMode: boolean;
  language: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    displayName: {
      type: String,
      trim: true
    },
    avatar: {
      type: String
    },
    gender: {
      type: String,
      enum: Object.values(Gender)
    },
    ageRange: {
      type: String,
      enum: Object.values(AgeRange)
    },
    learnerType: {
      type: String,
      enum: Object.values(LearnerType)
    },
    country: {
      type: String,
      default: 'Uganda',
      index: true
    },
    district: {
      type: String,
      index: true
    },
    bio: {
      type: String,
      maxlength: 500
    },
    accessibilityPreferences: {
      fontSize: {
        type: String,
        enum: ['small', 'medium', 'large', 'extra_large'],
        default: 'medium'
      },
      enableCaptions: {
        type: Boolean,
        default: true
      },
      enableScreenReader: {
        type: Boolean,
        default: false
      },
      highContrast: {
        type: Boolean,
        default: false
      },
      reducedMotion: {
        type: Boolean,
        default: false
      }
    },
    lowBandwidthMode: {
      type: Boolean,
      default: false
    },
    language: {
      type: String,
      default: 'en'
    },
    timezone: {
      type: String,
      default: 'Africa/Kampala'
    }
  },
  {
    timestamps: true
  }
);

// Indexes for analytics queries
ProfileSchema.index({ country: 1, district: 1 });
ProfileSchema.index({ gender: 1 });
ProfileSchema.index({ learnerType: 1 });
ProfileSchema.index({ ageRange: 1 });

const Profile: Model<IProfile> = mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);

export default Profile;
