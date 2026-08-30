import express from 'express';
import * as enquiryController from '../controllers/enquiry.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, enquiryController.createEnquiry);
router.get('/', authMiddleware, enquiryController.getMyEnquiries);

export default router;
