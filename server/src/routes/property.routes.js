import express from 'express';
import * as propertyController from '../controllers/property.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { roleMiddleware } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createPropertySchema, updatePropertyStatusSchema } from '../validators/property.validator.js';

const router = express.Router();

router.get('/', propertyController.getProperties);
router.get('/nearby', propertyController.getNearbyProperties);
router.get('/compare', propertyController.compareProperties);
router.get('/:id', propertyController.getPropertyById);

router.post(
  '/',
  authMiddleware,
  roleMiddleware('owner', 'broker', 'admin'),
  validate(createPropertySchema),
  propertyController.createProperty
);

router.patch(
  '/:id/status',
  authMiddleware,
  roleMiddleware('owner', 'broker', 'admin'),
  validate(updatePropertyStatusSchema),
  propertyController.updatePropertyStatus
);

router.patch(
  '/:id/confirm-availability',
  authMiddleware,
  roleMiddleware('owner', 'broker', 'admin'),
  propertyController.confirmAvailability
);

export default router;
