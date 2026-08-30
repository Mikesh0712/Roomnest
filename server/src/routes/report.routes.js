import express from 'express';
import * as reportController from '../controllers/report.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createReportSchema } from '../validators/report.validator.js';

const router = express.Router();

router.post('/', authMiddleware, validate(createReportSchema), reportController.createReport);

export default router;
