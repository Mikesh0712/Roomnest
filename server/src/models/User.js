import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES, USER_VERIFICATION_STATUS } from '../config/constants.js';

const documentSchema = new mongoose.Schema({
  docType: { type: String, required: true },
  docUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true,
    index: true
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
    select: false
  },
  role: {
    type: String,
    enum: Object.values(ROLES),
    default: ROLES.TENANT,
    index: true
  },
  profilePhoto: {
    type: String,
    default: ''
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: Object.values(USER_VERIFICATION_STATUS),
    default: USER_VERIFICATION_STATUS.UNVERIFIED,
    index: true
  },
  submittedDocuments: [documentSchema],
  verificationNotes: {
    type: String,
    default: ''
  },
  verifiedAt: {
    type: Date
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      delete ret.passwordHash;
      return ret;
    }
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

export const User = mongoose.model('User', userSchema);
