import express from 'express';
import * as reviewController from '../controllers/review.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createReviewSchema } from '../validators/review.validator.js';

const router = express.Router();

router.post('/', authMiddleware, validate(createReviewSchema), reviewController.createReview);
router.get('/property/:propertyId', reviewController.getPropertyReviews);

export default router;
