import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { Property } from '../src/models/Property.js';

async function verifyStoredProperties() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('\n=============================================================');
  console.log('📦 FETCHING LIVE PROPERTIES FROM MONGODB ATLAS CLUSTER');
  console.log('=============================================================\n');

  const properties = await Property.find({}).sort({ createdAt: -1 });

  properties.forEach((p, index) => {
    console.log(`[${index + 1}] 🏠 ${p.title}`);
    console.log(`    📍 Location Highlights : ${p.address}`);
    console.log(`    💰 Rent                : ₹${p.monthlyRent}/month (${p.foodIncluded ? 'Food Included' : 'Self Cook / Tiffin'})`);
    console.log(`    🛋️  Room Type & Sharing : ${p.propertyType.toUpperCase()} | ${p.sharingType} sharing`);
    console.log(`    ✨ Key Amenities       : ${p.amenities.slice(0, 6).join(', ')}...`);
    console.log(`    📜 Curfew & House Rules: ${p.houseRules?.curfewEnabled ? 'Curfew ' + p.houseRules.curfewTime : 'No Curfew'} | Visitors: ${p.houseRules?.visitorsAllowed ? 'Yes' : 'No'}`);
    console.log('-------------------------------------------------------------');
  });

  console.log(`\n✅ TOTAL STORED PROPERTIES IN MONGODB ATLAS: ${properties.length}`);
  await mongoose.disconnect();
}

verifyStoredProperties().catch(console.error);
