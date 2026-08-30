import express from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { roleMiddleware } from '../middleware/role.middleware.js';

const router = express.Router();

// Apply auth and admin role check to all admin routes
router.use(authMiddleware, roleMiddleware('admin'));

// Users management
router.get('/users', adminController.getUsers);
router.patch('/users/:id/block', adminController.blockUser);

// Verification requests
router.get('/verifications/pending', adminController.getPendingVerifications);
router.post('/verifications/:userId/approve', adminController.approveUserVerification);
router.post('/verifications/:userId/reject', adminController.rejectUserVerification);

// Property verification
router.post('/properties/:id/verify', adminController.verifyProperty);
router.post('/properties/:id/reject', adminController.rejectProperty);

// Media moderation
router.get('/media/pending', adminController.getPendingMedia);
router.post('/media/:id/approve', adminController.approveMedia);
router.post('/media/:id/reject', adminController.rejectMedia);
router.post('/media/:id/manual-review', adminController.manualReviewMedia);

// Reports management
router.get('/reports', adminController.getReports);
router.patch('/reports/:id/resolve', adminController.resolveReport);

// System stats & audit logs
router.get('/stats', adminController.getStats);
router.get('/audit-logs', adminController.getAuditLogs);

export default router;
