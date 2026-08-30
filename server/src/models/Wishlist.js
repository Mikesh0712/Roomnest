import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
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
  }
}, { timestamps: true });

wishlistSchema.index({ user: 1, property: 1 }, { unique: true });

export const Wishlist = mongoose.model('Wishlist', wishlistSchema);
