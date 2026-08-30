import mongoose from 'mongoose';
import { MODERATION_STATUS } from '../config/constants.js';

const mediaSchema = new mongoose.Schema({
  publicId: {
    type: String,
    required: true
  },
  secureUrl: {
    type: String,
    required: true
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    default: 'image'
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  fileSize: {
    type: Number,
    default: 0
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  moderationStatus: {
    type: String,
    enum: Object.values(MODERATION_STATUS),
    default: MODERATION_STATUS.PENDING,
    index: true
  },
  moderationReason: {
    type: String,
    default: ''
  },
  moderatedAt: {
    type: Date
  },
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderationScore: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export const Media = mongoose.model('Media', mediaSchema);
