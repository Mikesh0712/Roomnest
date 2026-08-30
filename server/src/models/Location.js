import mongoose from 'mongoose';
import { LOCATION_TYPES } from '../config/constants.js';

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Location name is required'],
    trim: true,
    index: true
  },
  type: {
    type: String,
    enum: LOCATION_TYPES,
    required: true,
    index: true
  },
  city: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    default: ''
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  website: {
    type: String,
    default: ''
  },
  photos: [{ type: String }]
}, { timestamps: true });

locationSchema.index({ location: '2dsphere' });

export const Location = mongoose.model('Location', locationSchema);
