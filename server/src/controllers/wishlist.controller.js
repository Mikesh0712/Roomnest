import * as wishlistService from '../services/wishlist.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const addToWishlist = async (req, res, next) => {
  try {
    const item = await wishlistService.addToWishlist(req.params.propertyId, req.user);
    return sendSuccess(res, 201, 'Property saved to wishlist', item);
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    const result = await wishlistService.removeFromWishlist(req.params.propertyId, req.user);
    return sendSuccess(res, 200, result.message, null);
  } catch (error) {
    next(error);
  }
};

export const getWishlist = async (req, res, next) => {
  try {
    const properties = await wishlistService.getUserWishlist(req.user);
    return sendSuccess(res, 200, 'Wishlist retrieved successfully', properties);
  } catch (error) {
    next(error);
  }
};
