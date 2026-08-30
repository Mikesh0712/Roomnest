import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
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
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  cleanliness: { type: Number, min: 1, max: 5, default: 5 },
  location: { type: Number, min: 1, max: 5, default: 5 },
  ownerBehaviour: { type: Number, min: 1, max: 5, default: 5 },
  internet: { type: Number, min: 1, max: 5, default: 5 },
  water: { type: Number, min: 1, max: 5, default: 5 },
  safety: { type: Number, min: 1, max: 5, default: 5 },
  food: { type: Number, min: 1, max: 5, default: 5 },
  noise: { type: Number, min: 1, max: 5, default: 5 },
  comment: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

// Prevent duplicate reviews from the same tenant for the same property
reviewSchema.index({ tenant: 1, property: 1 }, { unique: true });

export const Review = mongoose.model('Review', reviewSchema);
