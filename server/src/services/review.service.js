import { Review } from '../models/Review.js';
import { Property } from '../models/Property.js';
import { ApiError } from '../utils/apiError.js';

export const createReview = async (reviewData, tenantUser) => {
  const { propertyId, ...rest } = reviewData;

  const property = await Property.findById(propertyId);
  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  const existing = await Review.findOne({ tenant: tenantUser._id, property: propertyId });
  if (existing) {
    throw new ApiError(400, 'You have already submitted a review for this property.');
  }

  const review = await Review.create({
    tenant: tenantUser._id,
    property: propertyId,
    ...rest
  });

  return await review.populate('tenant', 'name profilePhoto');
};

export const getPropertyReviews = async (propertyId) => {
  return await Review.find({ property: propertyId })
    .populate('tenant', 'name profilePhoto')
    .sort({ createdAt: -1 });
};
