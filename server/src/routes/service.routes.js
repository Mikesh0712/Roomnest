import express from 'express';
import * as serviceController from '../controllers/service.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { roleMiddleware } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createServiceSchema } from '../validators/service.validator.js';

const router = express.Router();

router.get('/nearby', serviceController.getNearbyServices);
router.post(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'owner', 'broker'),
  validate(createServiceSchema),
  serviceController.createService
);

export default router;
