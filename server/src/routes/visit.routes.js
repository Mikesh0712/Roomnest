import express from 'express';
import * as visitController from '../controllers/visit.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createVisitSchema, updateVisitStatusSchema } from '../validators/visit.validator.js';

const router = express.Router();

router.post('/', authMiddleware, validate(createVisitSchema), visitController.createVisit);
router.get('/my', authMiddleware, visitController.getMyVisits);
router.patch('/:id/status', authMiddleware, validate(updateVisitStatusSchema), visitController.updateVisitStatus);

export default router;
