/**
 * RoomNest Application Security Sanitization Utilities
 * Protects against XSS, Injection, and ReDoS attacks
 */

/**
 * Escapes special characters for use in a regular expression.
 * Prevents ReDoS (Regular Expression Denial of Service) and regex injection.
 * @param {string} string - Untrusted user input string
 * @returns {string} - Escaped string safe for new RegExp()
 */
export const escapeRegex = (string) => {
  if (typeof string !== 'string') return '';
  // Enforce max length constraint to prevent buffer/memory exhaustion
  const truncated = string.slice(0, 100);
  return truncated.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Sanitizes a single string to strip malicious HTML, XSS scripts, and event handlers.
 * @param {string} str - Raw string
 * @returns {string} - Sanitized string
 */
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;

  return str
    // Remove script tags and contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove iframe tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    // Remove javascript: pseudo protocol
    .replace(/javascript:[^"'\s]*/gi, '')
    // Remove inline event handlers like onerror=, onload=, onclick=
    .replace(/\bon\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    // Strip standalone < and > to prevent raw HTML tags insertion if needed, or escape them
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

/**
 * Recursively sanitizes all string fields within an object/array.
 * @param {any} data - Input payload (req.body, req.query, etc.)
 * @returns {any} - Sanitized payload
 */
export const sanitizePayload = (data) => {
  if (!data || typeof data !== 'object') {
    return typeof data === 'string' ? sanitizeString(data) : data;
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizePayload(item));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    // Prevent prototype pollution
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    sanitized[key] = sanitizePayload(value);
  }
  return sanitized;
};

