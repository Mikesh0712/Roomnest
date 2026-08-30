import { z } from 'zod';
import { SERVICE_CATEGORIES } from '../config/constants.js';

export const createServiceSchema = z.object({
  name: z.string().min(3, 'Service name is required'),
  category: z.enum(SERVICE_CATEGORIES),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().optional(),
  address: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  locality: z.string().optional(),
  longitude: z.number().or(z.string().transform(val => parseFloat(val))),
  latitude: z.number().or(z.string().transform(val => parseFloat(val))),
  priceRange: z.string().optional(),
  operatingHours: z.string().optional(),
  serviceArea: z.string().optional(),
  photos: z.array(z.string()).optional()
});
