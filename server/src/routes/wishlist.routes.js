import express from 'express';
import * as wishlistController from '../controllers/wishlist.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authMiddleware, wishlistController.getWishlist);
router.post('/:propertyId', authMiddleware, wishlistController.addToWishlist);
router.delete('/:propertyId', authMiddleware, wishlistController.removeFromWishlist);

export default router;
