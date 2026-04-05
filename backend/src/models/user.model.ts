import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------
export enum UserRole {
  USER = 'USER',
  PARTNER = 'PARTNER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------
export interface IRefreshToken {
  token: string;
  expiresAt: Date;
}

export interface IUserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    maintenanceReminders: boolean;
    paymentAlerts: boolean;
    healthAlerts: boolean;
  };
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  lastLoginAt?: Date;
  preferences: IUserPreferences;
  refreshTokens: IRefreshToken[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
  toJSON(): Record<string, any> & { _id: mongoose.Types.ObjectId; __v: number };
}

export interface IUserModel extends Model<IUserDocument> {}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { _id: false },
);

const userPreferencesSchema = new Schema<IUserPreferences>(
  {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      maintenanceReminders: { type: Boolean, default: true },
      paymentAlerts: { type: Boolean, default: true },
      healthAlerts: { type: Boolean, default: true },
    },
  },
  { _id: false },
);

const userSchema = new Schema<IUserDocument, IUserModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name must be at most 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: {
      type: Date,
    },
    preferences: {
      type: userPreferencesSchema,
      default: () => ({
        notifications: {
          email: true,
          push: true,
          sms: false,
          maintenanceReminders: true,
          paymentAlerts: true,
          healthAlerts: true,
        },
      }),
    },
    refreshTokens: {
      type: [refreshTokenSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ---------------------------------------------------------------------------
// Indexes
// ---------------------------------------------------------------------------
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });

// ---------------------------------------------------------------------------
// Pre-save hook: hash password if modified
// ---------------------------------------------------------------------------
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// ---------------------------------------------------------------------------
// Instance methods
// ---------------------------------------------------------------------------
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  delete obj.__v;
  return obj;
};

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------
const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);
export default User;
