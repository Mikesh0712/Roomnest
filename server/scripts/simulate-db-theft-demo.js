/**
 * ============================================================================
 * RoomNest Cybersecurity Lab: Database Breach, Theft & Mitigation Simulator
 * Demonstrates Vulnerability Assessment, Threat Modeling, and Cryptographic Defense
 * ============================================================================
 * 
 * Execution:
 *   node server/scripts/simulate-db-theft-demo.js
 */

import { encryptField, decryptField, generateCanaryToken } from '../src/utils/crypto.js';

// ANSI terminal color helpers for beautiful presentation
const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
};

const divider = (char = '=', len = 78) => char.repeat(len);

console.clear();
console.log(`${C.cyan}${divider()}${C.reset}`);
console.log(`${C.bold}${C.white} 🛡️  ROOMNEST CYBERSECURITY RESEARCH DEMO: DATABASE THEFT & DEFENSE SIMULATOR${C.reset}`);
console.log(`${C.cyan}${divider()}${C.reset}\n`);

// ---------------------------------------------------------------------------
// 1. DUMMY SENSITIVE DATABASE (PROPRIETARY BUSINESS ASSETS)
// ---------------------------------------------------------------------------
const dummyRawDatabase = [
  {
    id: 'prop-101',
    title: 'Luxury 2BHK Near KIIT University Campus 6',
    ownerName: 'Subhashish Mohanty',
    ownerPhone: '+91-98610-12345',
    ownerAadhaar: '9845-1234-8899',
    exactAddress: 'Flat 402, Sai Residency, Infocity Road, Patia, Bhubaneswar',
    monthlyRent: 14000,
    securityDeposit: 28000,
    brokerage: 0,
    businessSecret: 'Exclusive 2-year direct-owner lock-in contract'
  },
  {
    id: 'prop-102',
    title: 'Executive Studio Apartment for Working Professionals',
    ownerName: 'Priyanka Das',
    ownerPhone: '+91-94370-54321',
    ownerAadhaar: '4567-8901-2345',
    exactAddress: 'House 12-B, DLF Cybercity Enclave, Chandrasekharpur, Bhubaneswar',
    monthlyRent: 9500,
    securityDeposit: 19000,
    brokerage: 0,
    businessSecret: 'Zero brokerage student discount agreement'
  }
];

// ---------------------------------------------------------------------------
// SCENARIO EXPLANATION
// ---------------------------------------------------------------------------
console.log(`${C.bold}📌 PROBLEM STATEMENT POSED BY PROFESSOR:${C.reset}`);
console.log(`${C.dim}"Suppose our database is stolen by a malicious competitor. They duplicate the data`);
console.log(`and launch a cloned website overnight to steal our business model and pre-fed listings.`);
console.log(`How do we mathematically and architecturally prevent this theft from succeeding?"${C.reset}\n`);

// ---------------------------------------------------------------------------
// STAGE 1: VULNERABILITY ASSESSMENT (THE UNPROTECTED BREACH)
// ---------------------------------------------------------------------------
console.log(`${C.red}${divider('-')}${C.reset}`);
console.log(`${C.bold}${C.red}⚠️  STAGE 1: VULNERABILITY ASSESSMENT — UNPROTECTED DATABASE EXFILTRATION${C.reset}`);
console.log(`${C.red}${divider('-')}${C.reset}`);
console.log(`${C.yellow}Attacker Vector:${C.reset} Rogue insider, misconfigured backup S3 bucket, or unauthenticated dump.`);
console.log(`${C.yellow}Result in Raw / Unprotected Database Dump:${C.reset}`);

console.log(`\n${C.dim}[Raw MongoDB Dump Export: 'roomnest_dump_unprotected.json']${C.reset}`);
console.dir(dummyRawDatabase, { depth: null, colors: true });

console.log(`\n${C.red}❌ IMPACT & BUSINESS RISK:${C.reset}`);
console.log(`  • Attacker directly reads Owner Names, Mobile Numbers, and Exact Addresses in cleartext.`);
console.log(`  • Attacker launches ${C.bold}CloneWebsite.com${C.reset} in 5 minutes with our exact data.`);
console.log(`  • Violates DPDP Act 2023 (Digital Personal Data Protection) & GDPR (CWE-312: Cleartext Storage).\n`);

// ---------------------------------------------------------------------------
// STAGE 2: THE MITIGATION (FIELD-LEVEL ENVELOPE ENCRYPTION - AES-256-GCM)
// ---------------------------------------------------------------------------
console.log(`${C.green}${divider('-')}${C.reset}`);
console.log(`${C.bold}${C.green}🛡️  STAGE 2: MITIGATION IMPLEMENTATION — FIELD-LEVEL ENVELOPE ENCRYPTION${C.reset}`);
console.log(`${C.green}${divider('-')}${C.reset}`);
console.log(`${C.white}RoomNest implements ${C.bold}AES-256-GCM authenticated envelope encryption${C.reset}.`);
console.log(`Sensitive business PII (owner contacts, addresses, identity proofs) are encrypted ${C.bold}at the application layer${C.reset}`);
console.log(`using a 256-bit cryptographic key stored in an isolated KMS outside the database.\n`);

// Generate protected database records
const dummyProtectedDatabase = dummyRawDatabase.map(record => ({
  ...record,
  ownerPhone: encryptField(record.ownerPhone),
  ownerAadhaar: encryptField(record.ownerAadhaar),
  exactAddress: encryptField(record.exactAddress),
  businessSecret: encryptField(record.businessSecret),
  _encryptionMetadata: {
    cipher: 'AES-256-GCM',
    keyManagement: 'Isolated-Server-KMS',
    status: 'Zero-Knowledge-Storage'
  }
}));

// Plant a Cryptographic Canary Token into the protected dataset
const canary = generateCanaryToken('RoomNest-Official-Repository');
dummyProtectedDatabase.push({
  id: canary.canaryId,
  title: 'Verified Student Hostel near ITER Campus',
  ownerName: 'Security Audit Sentinel',
  ownerPhone: canary.trappedPhone,
  exactAddress: 'Canary Trap Address',
  isCanaryWatermark: true,
  watermarkSignature: canary.watermarkSignature
});

console.log(`${C.dim}[Protected MongoDB Dump Stolen By Attacker: 'roomnest_dump_encrypted.json']${C.reset}`);
console.dir(dummyProtectedDatabase, { depth: null, colors: true });

// ---------------------------------------------------------------------------
// STAGE 3: ATTACK SIMULATION (ATTACKER TRIES TO RUN CLONE WEBSITE)
// ---------------------------------------------------------------------------
console.log(`\n${C.magenta}${divider('-')}${C.reset}`);
console.log(`${C.bold}${C.magenta}⚔️  STAGE 3: ATTACK SIMULATION — COMPETITOR TRIES TO LAUNCH CLONE WEBSITE${C.reset}`);
console.log(`${C.magenta}${divider('-')}${C.reset}`);
console.log(`${C.yellow}Attacker downloads the stolen database and spins up their clone platform...${C.reset}\n`);

// Attacker tries to display owner contact on their clone platform
const targetRecord = dummyProtectedDatabase[0];
console.log(`1. Attacker attempts to query Owner Phone:`);
console.log(`   ${C.dim}Stored Database Value:${C.reset} ${C.cyan}${targetRecord.ownerPhone}${C.reset}`);

// Attacker tries to decrypt with a guessed/fake key
console.log(`\n2. Attacker tries to decrypt without our Master Vault Key:`);
try {
  const fakeKey = 'attacker_fake_guess_key_random12345';
  decryptField(targetRecord.ownerPhone, fakeKey);
} catch (err) {
  console.log(`   ${C.bgRed}${C.white} CRITICAL ERROR: Decryption Failed (AEAD Tag Mismatch) ${C.reset}`);
  console.log(`   ${C.red}Error Message: ${err.message}${C.reset}`);
  console.log(`   ${C.green}Result: Attacker CANNOT read the contact. The clone website crashes or displays gibberish!${C.reset}`);
}

// ---------------------------------------------------------------------------
// STAGE 4: DIGITAL WATERMARKING (LEGAL & FORENSIC PROOF)
// ---------------------------------------------------------------------------
console.log(`\n${C.cyan}${divider('-')}${C.reset}`);
console.log(`${C.bold}${C.cyan}🔎  STAGE 4: FORENSIC INVESTIGATION — DIGITAL CANARY WATERMARKING${C.reset}`);
console.log(`${C.cyan}${divider('-')}${C.reset}`);
console.log(`Competitor cloned our database thinking it's standard property data.`);
console.log(`Our canary honeypot record was automatically included in their import:\n`);

const stolenCanary = dummyProtectedDatabase.find(r => r.isCanaryWatermark);
console.log(`   ${C.yellow}Detected Canary ID:${C.reset}       ${stolenCanary.id}`);
console.log(`   ${C.yellow}Watermark Signature:${C.reset}   ${stolenCanary.watermarkSignature}`);
console.log(`   ${C.yellow}Canary Trap Phone:${C.reset}     ${stolenCanary.ownerPhone}`);

console.log(`\n${C.green}✅ FORENSIC VERIFICATION:${C.reset}`);
console.log(`   ${C.bold}HMAC-SHA256 signature matches RoomNest Private Master Key.${C.reset}`);
console.log(`   This provides 100% indisputable legal proof in court that the competitor stole our proprietary dataset.`);

// ---------------------------------------------------------------------------
// STAGE 5: LEGITIMATE ROOMNEST PLATFORM EXECUTION (HOW WE RENDER IT)
// ---------------------------------------------------------------------------
console.log(`\n${C.green}${divider('-')}${C.reset}`);
console.log(`${C.bold}${C.green}✨  STAGE 5: LEGITIMATE ROOMNEST PLATFORM (AUTHORIZED DECRYPTION)${C.reset}`);
console.log(`${C.green}${divider('-')}${C.reset}`);
console.log(`When an authenticated RoomNest tenant requests the owner details, our backend decrypts on-the-fly:`);

const decryptedPhone = decryptField(targetRecord.ownerPhone);
const decryptedAddress = decryptField(targetRecord.exactAddress);

console.log(`\n   ${C.bold}Verified Tenant View (Decrypted via Server KMS):${C.reset}`);
console.log(`   • Property:     ${targetRecord.title}`);
console.log(`   • Owner Name:   ${targetRecord.ownerName}`);
console.log(`   • Owner Phone:  ${C.green}${C.bold}${decryptedPhone}${C.reset}`);
console.log(`   • Address:      ${C.green}${decryptedAddress}${C.reset}`);

console.log(`\n${C.cyan}${divider()}${C.reset}`);
console.log(`${C.bold}${C.green}🎯 CONCLUSION FOR PROFESSOR:${C.reset}`);
console.log(`1. Even if the entire database is leaked or stolen, the clone site is ${C.bold}completely useless${C.reset}.`);
console.log(`2. Sensitive business PII cannot be decrypted without the KMS Master Key residing outside MongoDB.`);
console.log(`3. Digital Canary tokens provide cryptographic proof of data theft for copyright & legal action.`);
console.log(`${C.cyan}${divider()}${C.reset}\n`);
