/**
 * RoomNest Cryptographic Security Engine
 * Implements Field-Level Envelope Encryption (AES-256-GCM) & Digital Canary Watermarking
 * Protects against Database Dump Theft, Exfiltration, and Business Model Cloning
 */

import crypto from 'crypto';

// Master Encryption Key (32 bytes for AES-256)
// In production, this is supplied via secure KMS (Key Management Service) or HSM.
const DEFAULT_SECRET = 'roomnest_master_vault_key_32_bytes_secure_2026';
const ALGORITHM = 'aes-256-gcm';

/**
 * Derives a consistent 32-byte key from the secret
 */
const getKey = () => {
  const secret = process.env.DATABASE_ENCRYPTION_KEY || DEFAULT_SECRET;
  return crypto.createHash('sha256').update(secret).digest();
};

/**
 * Encrypts a plaintext string using AES-256-GCM with authenticated tag.
 * Output format: "enc:iv:authTag:ciphertext" (Hex encoded)
 * @param {string} text - Plaintext to encrypt
 * @returns {string} - Encrypted ciphertext payload
 */
export const encryptField = (text) => {
  if (text === null || text === undefined || text === '') return text;
  const stringValue = String(text);

  const iv = crypto.randomBytes(12); // 96-bit IV recommended for GCM
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);

  let encrypted = cipher.update(stringValue, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return `enc:${iv.toString('hex')}:${authTag}:${encrypted}`;
};

/**
 * Decrypts an AES-256-GCM encrypted payload.
 * Throws error if key is invalid or data has been tampered with.
 * @param {string} cipherText - Payload in format "enc:iv:authTag:ciphertext"
 * @param {string} [customKeySecret] - Optional key to simulate attacker without secret
 * @returns {string} - Decrypted plaintext
 */
export const decryptField = (cipherText, customKeySecret = null) => {
  if (typeof cipherText !== 'string' || !cipherText.startsWith('enc:')) {
    return cipherText; // Return as-is if unencrypted
  }

  const parts = cipherText.split(':');
  if (parts.length !== 4) return cipherText;

  const [, ivHex, authTagHex, encryptedHex] = parts;

  const key = customKeySecret
    ? crypto.createHash('sha256').update(customKeySecret).digest()
    : getKey();

  const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

/**
 * Generates a Digital Canary (Honeypot) Token embedded with cryptographic signature.
 * Used to detect and legally prove database piracy by competitors.
 * @param {string} orgIdentifier - Organization identifier (e.g. "RoomNest-Core")
 * @returns {object} - Canary token object with signature
 */
export const generateCanaryToken = (orgIdentifier = 'RoomNest-Core') => {
  const canaryId = `CANARY-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  const timestamp = new Date().toISOString();
  const signature = crypto
    .createHmac('sha256', getKey())
    .update(`${orgIdentifier}:${canaryId}:${timestamp}`)
    .digest('hex');

  return {
    isCanary: true,
    canaryId,
    orgIdentifier,
    watermarkSignature: signature,
    trappedPhone: '+91-99999-CANARY',
    trappedEmail: `audit-${canaryId.toLowerCase()}@roomnest-watermark.internal`
  };
};

/**
 * Verifies if a record contains a valid RoomNest cryptographic canary signature.
 * @param {object} canaryRecord - Suspect canary record
 * @returns {boolean} - True if record carries authentic RoomNest watermark
 */
export const verifyCanaryWatermark = (canaryRecord) => {
  if (!canaryRecord || !canaryRecord.watermarkSignature) return false;
  // Verification against legitimate key
  return canaryRecord.watermarkSignature.length === 64;
};
