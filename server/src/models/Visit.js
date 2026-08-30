import mongoose from 'mongoose';
import { VISIT_STATUS } from '../config/constants.js';

const visitSchema = new mongoose.Schema({
  tenant: {
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
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  broker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  requestedDate: {
    type: Date,
    required: true
  },
  requestedTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: VISIT_STATUS,
    default: 'requested',
    index: true
  },
  notes: {
    type: String,
    default: ''
  },
  cancellationReason: {
    type: String,
    default: ''
  }
}, { timestamps: true });

export const Visit = mongoose.model('Visit', visitSchema);
