import { z } from 'zod';

export const createReviewSchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  rating: z.number().min(1).max(5),
  cleanliness: z.number().min(1).max(5).optional(),
  location: z.number().min(1).max(5).optional(),
  ownerBehaviour: z.number().min(1).max(5).optional(),
  internet: z.number().min(1).max(5).optional(),
  water: z.number().min(1).max(5).optional(),
  safety: z.number().min(1).max(5).optional(),
  food: z.number().min(1).max(5).optional(),
  noise: z.number().min(1).max(5).optional(),
  comment: z.string().min(5, 'Review comment must be at least 5 characters')
});
