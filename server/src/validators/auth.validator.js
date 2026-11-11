import { z } from 'zod';
import { ROLES } from '../config/constants.js';

// Publicly registerable roles only. Admin role must NEVER be self-assignable via public registration.
const PUBLIC_REGISTRATION_ROLES = [ROLES.TENANT, ROLES.OWNER, ROLES.BROKER];

export const registerSchema = z.object({
  name: z.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name must not exceed 60 characters'),
  email: z.string()
    .trim()
    .email('Invalid email address')
    .max(100, 'Email must not exceed 100 characters'),
  phone: z.string()
    .trim()
    .min(10, 'Phone must be at least 10 digits')
    .max(15, 'Phone must not exceed 15 digits'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(72, 'Password must not exceed 72 characters to prevent bcrypt CPU exhaustion attacks'),
  role: z.enum(PUBLIC_REGISTRATION_ROLES, {
    errorMap: () => ({ message: 'Invalid role. Administrative roles cannot be self-assigned.' })
  }).default(ROLES.TENANT)
});

export const loginSchema = z.object({
  identifier: z.string()
    .trim()
    .min(1, 'Email or phone number is required')
    .max(100, 'Identifier must not exceed 100 characters'),
  password: z.string()
    .min(1, 'Password is required')
    .max(72, 'Password must not exceed 72 characters')
});
