import { z } from 'zod';
import { VISIT_STATUS } from '../config/constants.js';

export const createVisitSchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  requestedDate: z.string().min(1, 'Visit date is required'),
  requestedTime: z.string().min(1, 'Visit time is required'),
  notes: z.string().optional()
});

export const updateVisitStatusSchema = z.object({
  status: z.enum(VISIT_STATUS),
  requestedDate: z.string().optional(),
  requestedTime: z.string().optional(),
  notes: z.string().optional(),
  cancellationReason: z.string().optional()
});
