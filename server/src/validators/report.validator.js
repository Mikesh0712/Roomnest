import { z } from 'zod';
import { REPORT_REASONS } from '../config/constants.js';

export const createReportSchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  reason: z.enum(REPORT_REASONS),
  description: z.string().min(5, 'Report description must be at least 5 characters')
});
