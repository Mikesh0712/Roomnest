import { z } from 'zod';
import { PROPERTY_TYPES, SHARING_TYPES, SUITABLE_FOR, AMENITIES, PROPERTY_STATUS } from '../config/constants.js';

export const createPropertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().optional(),
  propertyType: z.enum(PROPERTY_TYPES),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  locality: z.string().min(2, 'Locality is required'),
  address: z.string().min(5, 'Address is required'),
  landmark: z.string().optional(),
  longitude: z.number().or(z.string().transform(val => parseFloat(val))),
  latitude: z.number().or(z.string().transform(val => parseFloat(val))),
  monthlyRent: z.number().positive('Monthly rent must be positive'),
  securityDeposit: z.number().nonnegative().optional(),
  maintenance: z.number().nonnegative().optional(),
  electricityIncluded: z.boolean().optional(),
  waterIncluded: z.boolean().optional(),
  foodIncluded: z.boolean().optional(),
  brokerage: z.number().nonnegative().optional(),
  availableFrom: z.string().optional(),
  totalRooms: z.number().int().positive().optional(),
  availableRooms: z.number().int().nonnegative().optional(),
  maxOccupants: z.number().int().positive().optional(),
  sharingType: z.enum(SHARING_TYPES).optional(),
  suitableFor: z.array(z.enum(SUITABLE_FOR)).optional(),
  amenities: z.array(z.enum(AMENITIES)).optional(),
  moveInChecklist: z.array(z.string()).optional(),
  houseRules: z.object({
    smokingAllowed: z.boolean().optional(),
    drinkingAllowed: z.boolean().optional(),
    partiesAllowed: z.boolean().optional(),
    petsAllowed: z.boolean().optional(),
    visitorsAllowed: z.boolean().optional(),
    oppositeGenderVisitorsAllowed: z.boolean().optional(),
    curfewEnabled: z.boolean().optional(),
    curfewTime: z.string().optional(),
    quietHoursEnabled: z.boolean().optional(),
    quietHoursStart: z.string().optional(),
    quietHoursEnd: z.string().optional(),
    studentOnly: z.boolean().optional(),
    workingProfessionalOnly: z.boolean().optional(),
    idProofRequired: z.boolean().optional(),
    policeVerificationRequired: z.boolean().optional(),
    customRules: z.array(z.object({ rule: z.string() })).optional()
  }).optional(),
  photos: z.array(z.string()).optional(),
  thumbnail: z.string().optional(),
  videoWalkthroughUrl: z.string().optional(),
  virtualTourUrl: z.string().optional()
});

export const updatePropertyStatusSchema = z.object({
  status: z.enum(Object.values(PROPERTY_STATUS)),
  statusReason: z.string().optional(),
  availableFrom: z.string().optional()
});
