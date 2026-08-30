import express from 'express';
import * as mediaController from '../controllers/media.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/upload', authMiddleware, mediaController.uploadMedia);

export default router;
