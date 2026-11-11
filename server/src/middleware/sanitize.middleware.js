import { sanitizePayload } from '../utils/sanitize.js';

/**
 * Global input sanitization middleware
 * Sanitizes req.body, req.query, and req.params against XSS and injection payloads.
 */
export const sanitizeMiddleware = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizePayload(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizePayload(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizePayload(req.params);
  }
  next();
};

