import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { roleMiddleware } from '../middleware/role.middleware.js';

const router = express.Router();

router.post(
  '/verification-request',
  authMiddleware,
  roleMiddleware('owner', 'broker'),
  userController.submitVerificationRequest
);

export default router;
