import mongoose from 'mongoose';
import { SERVICE_CATEGORIES } from '../config/constants.js';

const nearbyServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true
  },
  category: {
    type: String,
    enum: SERVICE_CATEGORIES,
    required: [true, 'Category is required'],
    index: true
  },
  description: {
    type: String,
    default: ''
  },
  photos: [{ type: String }],
  phone: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    required: true,
    index: true
  },
  locality: {
    type: String,
    default: '',
    index: true
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
  priceRange: {
    type: String,
    default: ''
  },
  operatingHours: {
    type: String,
    default: ''
  },
  serviceArea: {
    type: String,
    default: ''
  },
  verified: {
    type: Boolean,
    default: false
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rating: {
    type: Number,
    default: 4.5
  },
  reviewCount: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

nearbyServiceSchema.index({ location: '2dsphere' });

export const NearbyService = mongoose.model('NearbyService', nearbyServiceSchema);
