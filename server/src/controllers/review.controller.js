import * as reviewService from '../services/review.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview(req.body, req.user);
    return sendSuccess(res, 201, 'Review submitted successfully', review);
  } catch (error) {
    next(error);
  }
};

export const getPropertyReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getPropertyReviews(req.params.propertyId);
    return sendSuccess(res, 200, 'Property reviews retrieved successfully', reviews);
  } catch (error) {
    next(error);
  }
};
