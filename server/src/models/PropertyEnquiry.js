import mongoose from 'mongoose';
import { ENQUIRY_STATUS } from '../config/constants.js';

const propertyEnquirySchema = new mongoose.Schema({
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
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ENQUIRY_STATUS,
    default: 'new',
    index: true
  }
}, { timestamps: true });

export const PropertyEnquiry = mongoose.model('PropertyEnquiry', propertyEnquirySchema);
