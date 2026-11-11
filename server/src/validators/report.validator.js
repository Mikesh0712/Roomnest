import { z } from 'zod';
import { REPORT_REASONS } from '../config/constants.js';

export const createReportSchema = z.object({
  propertyId: z.string().trim().min(1, 'Property ID is required').max(100),
  reason: z.enum(REPORT_REASONS),
  description: z.string()
    .trim()
    .min(5, 'Report description must be at least 5 characters')
    .max(1000, 'Report description cannot exceed 1000 characters')
});
