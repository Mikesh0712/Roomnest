import { z } from 'zod';
import { PROPERTY_TYPES, SHARING_TYPES, SUITABLE_FOR, AMENITIES, PROPERTY_STATUS } from '../config/constants.js';

export const createPropertySchema = z.object({
  title: z.string()
    .trim()
    .min(5, 'Title must be at least 5 characters')
    .max(120, 'Title cannot exceed 120 characters'),
  description: z.string()
    .trim()
    .max(3000, 'Description cannot exceed 3000 characters')
    .optional(),
  propertyType: z.enum(PROPERTY_TYPES),
  city: z.string()
    .trim()
    .min(2, 'City is required')
    .max(100, 'City cannot exceed 100 characters'),
  state: z.string()
    .trim()
    .min(2, 'State is required')
    .max(100, 'State cannot exceed 100 characters'),
  locality: z.string()
    .trim()
    .min(2, 'Locality is required')
    .max(100, 'Locality cannot exceed 100 characters'),
  address: z.string()
    .trim()
    .min(5, 'Address is required')
    .max(250, 'Address cannot exceed 250 characters'),
  landmark: z.string()
    .trim()
    .max(150, 'Landmark cannot exceed 150 characters')
    .optional(),
  longitude: z.number().or(z.string().transform(val => parseFloat(val))),
  latitude: z.number().or(z.string().transform(val => parseFloat(val))),
  monthlyRent: z.number().positive('Monthly rent must be positive').max(10000000, 'Rent exceeds realistic threshold'),
  securityDeposit: z.number().nonnegative().max(50000000).optional(),
  maintenance: z.number().nonnegative().max(1000000).optional(),
  electricityIncluded: z.boolean().optional(),
  waterIncluded: z.boolean().optional(),
  foodIncluded: z.boolean().optional(),
  brokerage: z.number().nonnegative().max(1000000).optional(),
  availableFrom: z.string().optional(),
  totalRooms: z.number().int().positive().max(500).optional(),
  availableRooms: z.number().int().nonnegative().max(500).optional(),
  maxOccupants: z.number().int().positive().max(1000).optional(),
  sharingType: z.enum(SHARING_TYPES).optional(),
  suitableFor: z.array(z.enum(SUITABLE_FOR)).optional(),
  amenities: z.array(z.enum(AMENITIES)).optional(),
  moveInChecklist: z.array(z.string().max(200)).optional(),
  houseRules: z.object({
    smokingAllowed: z.boolean().optional(),
    drinkingAllowed: z.boolean().optional(),
    partiesAllowed: z.boolean().optional(),
    petsAllowed: z.boolean().optional(),
    visitorsAllowed: z.boolean().optional(),
    oppositeGenderVisitorsAllowed: z.boolean().optional(),
    curfewEnabled: z.boolean().optional(),
    curfewTime: z.string().max(20).optional(),
    quietHoursEnabled: z.boolean().optional(),
    quietHoursStart: z.string().max(20).optional(),
    quietHoursEnd: z.string().max(20).optional(),
    studentOnly: z.boolean().optional(),
    workingProfessionalOnly: z.boolean().optional(),
    idProofRequired: z.boolean().optional(),
    policeVerificationRequired: z.boolean().optional(),
    customRules: z.array(z.object({ rule: z.string().max(300) })).optional()
  }).optional(),
  photos: z.array(z.string().url('Invalid photo URL').max(500)).optional(),
  thumbnail: z.string().url('Invalid thumbnail URL').max(500).optional(),
  videoWalkthroughUrl: z.string().url().max(500).optional(),
  virtualTourUrl: z.string().url().max(500).optional()
});

export const updatePropertyStatusSchema = z.object({
  status: z.enum(Object.values(PROPERTY_STATUS)),
  statusReason: z.string().max(500).optional(),
  availableFrom: z.string().optional()
});
