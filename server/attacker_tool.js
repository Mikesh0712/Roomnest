/**
 * ATTACKER SCRIPT: Simulates a competitor trying to decrypt the stolen database
 * Execution: node attacker_tool.js
 */
import fs from 'fs';
import { decryptField } from './src/utils/crypto.js';

console.log('\n===============================================================');
console.log('🏴‍☠️  ATTACKER CONSOLE: Attempting to Crack Stolen RoomNest Database');
console.log('===============================================================\n');

// 1. Attacker reads the stolen dump file
const dumpPath = new URL('./stolen_dump.json', import.meta.url);
const rawData = fs.readFileSync(dumpPath, 'utf8');
const stolenListings = JSON.parse(rawData);

console.log(`[+] Attacker loaded ${stolenListings.length} stolen listings from 'stolen_dump.json'.`);
console.log('[*] Extracting target property:', stolenListings[0].title);
console.log('[*] Encrypted Phone Payload found in DB:', stolenListings[0].ownerPhone);

// 2. Attacker attempts to crack/decrypt without the legitimate Master Key
console.log('\n[*] Attacker running decryption with guessed key: "competitor_crack_key_2026"...');

try {
  const crackedPhone = decryptField(stolenListings[0].ownerPhone, 'competitor_crack_key_2026');
  console.log('[!] Cracked Phone:', crackedPhone);
} catch (error) {
  console.log('\n❌ [CRITICAL ERROR]: Decryption Failed!');
  console.log('   Reason:', error.message);
  console.log('   Cause: AES-256-GCM AEAD Tag Mismatch (Invalid Cryptographic Key)');
  console.log('\n⚠️  RESULT: The stolen database is 100% UNREADABLE to the attacker.');
  console.log('   Competitor cannot contact owners or launch the clone website!\n');
}
