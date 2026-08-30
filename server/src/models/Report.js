import mongoose from 'mongoose';
import { REPORT_STATUS, REPORT_REASONS } from '../config/constants.js';

const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
    index: true
  },
  reason: {
    type: String,
    enum: REPORT_REASONS,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: REPORT_STATUS,
    default: 'pending',
    index: true
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolutionNotes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

export const Report = mongoose.model('Report', reportSchema);
