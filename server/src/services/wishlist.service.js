import { Wishlist } from '../models/Wishlist.js';
import { Property } from '../models/Property.js';
import { ApiError } from '../utils/apiError.js';

export const addToWishlist = async (propertyId, user) => {
  const property = await Property.findById(propertyId);
  if (!property) {
    throw new ApiError(404, 'Property listing not found');
  }

  const existing = await Wishlist.findOne({ user: user._id, property: propertyId });
  if (existing) {
    return existing;
  }

  const item = await Wishlist.create({
    user: user._id,
    property: propertyId
  });

  await Property.findByIdAndUpdate(propertyId, { $inc: { wishlistCount: 1 } });
  return item;
};

export const removeFromWishlist = async (propertyId, user) => {
  const deleted = await Wishlist.findOneAndDelete({ user: user._id, property: propertyId });
  if (deleted) {
    await Property.findByIdAndUpdate(propertyId, { $inc: { wishlistCount: -1 } });
  }
  return { success: true, message: 'Property removed from wishlist' };
};

export const getUserWishlist = async (user) => {
  const list = await Wishlist.find({ user: user._id })
    .populate({
      path: 'property',
      populate: [
        { path: 'owner', select: 'name verificationStatus' },
        { path: 'broker', select: 'name verificationStatus' }
      ]
    })
    .sort({ createdAt: -1 });

  return list.map(item => item.property).filter(Boolean);
};
