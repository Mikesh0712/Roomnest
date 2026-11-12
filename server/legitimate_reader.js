/**
 * LEGITIMATE DEVELOPER SCRIPT: Authorized Backend Decryption
 * Possesses the Private Master Vault Key
 * Execution: node legitimate_reader.js
 */
import fs from 'fs';
import { decryptField } from './src/utils/crypto.js';

console.log('\n===============================================================');
console.log('🛡️  ROOMNEST AUTHORIZED CONSOLE: Legitimate Developer Decryption');
console.log('===============================================================\n');

// 1. Authorized platform reads the database
const dumpPath = new URL('./stolen_dump.json', import.meta.url);
const rawData = fs.readFileSync(dumpPath, 'utf8');
const listings = JSON.parse(rawData);

console.log(`[+] Authorized backend connected. Decrypting listings via Server KMS Vault Key...\n`);

// 2. Decrypt listings using the legitimate Master Key stored in Server Vault
listings.forEach((item, index) => {
  if (item.isCanaryTrap) {
    console.log(`[CANARY RECORD DETECTED] ${item.title}`);
    console.log(`   Trap Signature: ${item.watermarkSignature}\n`);
    return;
  }

  const phone = decryptField(item.ownerPhone);
  const aadhaar = decryptField(item.ownerAadhaar);
  const address = decryptField(item.exactAddress);

  console.log(`Listing #${index + 1}: ${item.title}`);
  console.log(`   • Owner Name:    ${item.ownerName}`);
  console.log(`   • Owner Contact: \x1b[32m${phone}\x1b[0m (Decrypted Successfully)`);
  console.log(`   • Owner Aadhaar: \x1b[32m${aadhaar}\x1b[0m (Decrypted Successfully)`);
  console.log(`   • Exact Address: \x1b[32m${address}\x1b[0m (Decrypted Successfully)`);
  console.log(`   • Monthly Rent:  ₹${item.monthlyRent}\n`);
});

console.log('✅ [SUCCESS]: Only the authorized RoomNest backend can read and render this data!');
console.log('   This mathematically separates legitimate platform operations from unauthorized database theft.\n');
