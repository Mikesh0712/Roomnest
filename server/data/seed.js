import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User } from '../src/models/User.js';
import { Property } from '../src/models/Property.js';
import { Location } from '../src/models/Location.js';
import { NearbyService } from '../src/models/NearbyService.js';
import { Visit } from '../src/models/Visit.js';
import { Review } from '../src/models/Review.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/roomnest';

export const seedDatabase = async () => {
  let memServer = null;
  try {
    console.log(`Connecting to MongoDB for seeding: ${MONGO_URI}...`);
    try {
      await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 });
    } catch (connErr) {
      console.log('Local MongoDB service not detected on port 27017. Spinning up in-memory MongoDB instance for seeding validation...');
      memServer = await MongoMemoryServer.create();
      await mongoose.connect(memServer.getUri());
    }

    // Clear existing collections
    await User.deleteMany({});
    await Property.deleteMany({});
    await Location.deleteMany({});
    await NearbyService.deleteMany({});
    await Visit.deleteMany({});
    await Review.deleteMany({});

    console.log('Cleared existing data.');

    // 1. Create Users
    const passwordHash = await bcrypt.hash('Password@123', 12);

    const admin = await User.create({
      name: 'RoomNest System Admin',
      email: 'admin@roomnest.in',
      phone: '9999900000',
      passwordHash,
      role: 'admin',
      isEmailVerified: true,
      isPhoneVerified: true,
      verificationStatus: 'verified'
    });

    const ownerBbsr = await User.create({
      name: 'Ramesh Chandra Jena',
      email: 'owner.bbsr@roomnest.in',
      phone: '9853011223',
      passwordHash,
      role: 'owner',
      isEmailVerified: true,
      isPhoneVerified: true,
      verificationStatus: 'verified',
      submittedDocuments: [{ docType: 'Aadhaar + Electricity Bill', docUrl: 'https://cdn.roomnest.in/docs/aadhaar_sample.pdf' }],
      verifiedAt: new Date(),
      verifiedBy: admin._id
    });

    const brokerBbsr = await User.create({
      name: 'Priyabrata Mohanty (Kalinga Estates)',
      email: 'broker.bbsr@roomnest.in',
      phone: '9437099881',
      passwordHash,
      role: 'broker',
      isEmailVerified: true,
      isPhoneVerified: true,
      verificationStatus: 'verified',
      submittedDocuments: [{ docType: 'RERA License', docUrl: 'https://cdn.roomnest.in/docs/rera_license.pdf' }],
      verifiedAt: new Date(),
      verifiedBy: admin._id
    });

    const tenantStudent = await User.create({
      name: 'Ankita Tripathy',
      email: 'student.ankita@gmail.com',
      phone: '9876543210',
      passwordHash,
      role: 'tenant',
      isEmailVerified: true,
      isPhoneVerified: true,
      verificationStatus: 'verified'
    });

    const tenantPro = await User.create({
      name: 'Subham Sourav Patnaik',
      email: 'subham.tcs@gmail.com',
      phone: '9123456789',
      passwordHash,
      role: 'tenant',
      isEmailVerified: true,
      isPhoneVerified: true,
      verificationStatus: 'verified'
    });

    console.log('Seeded 5 initial Users (Admin, Owner, Broker, 2 Tenants).');

    // 2. Create Educational & Office Hub Locations
    const locations = await Location.insertMany([
      {
        name: 'KIIT University Campus 6',
        type: 'university',
        city: 'Bhubaneswar',
        state: 'Odisha',
        address: 'Patia, Bhubaneswar, Odisha 751024',
        location: { type: 'Point', coordinates: [85.8190, 20.3533] },
        website: 'https://kiit.ac.in'
      },
      {
        name: 'ITER - Siksha \'O\' Anusandhan',
        type: 'college',
        city: 'Bhubaneswar',
        state: 'Odisha',
        address: 'Jagamara, Khandagiri, Bhubaneswar, Odisha 751030',
        location: { type: 'Point', coordinates: [85.7981, 20.2505] },
        website: 'https://soa.ac.in'
      },
      {
        name: 'Infosys SEZ Chandaka Industrial Estate',
        type: 'ITPark',
        city: 'Bhubaneswar',
        state: 'Odisha',
        address: 'Chandaka SEZ, Infocity, Bhubaneswar 751024',
        location: { type: 'Point', coordinates: [85.8080, 20.3570] },
        website: 'https://infosys.com'
      },
      {
        name: 'TCS Gitanjali Park',
        type: 'office',
        city: 'Bhubaneswar',
        state: 'Odisha',
        address: 'Infocity Avenue, Patia, Bhubaneswar 751024',
        location: { type: 'Point', coordinates: [85.8120, 20.3550] },
        website: 'https://tcs.com'
      },
      {
        name: 'IIT Bhubaneswar',
        type: 'university',
        city: 'Bhubaneswar',
        state: 'Odisha',
        address: 'Arugul, Jatni, Odisha 752050',
        location: { type: 'Point', coordinates: [85.7060, 20.1480] },
        website: 'https://iitbbs.ac.in'
      },
      {
        name: 'Manyata Tech Park',
        type: 'ITPark',
        city: 'Bangalore',
        state: 'Karnataka',
        address: 'Nagavara, Bengaluru, Karnataka 560045',
        location: { type: 'Point', coordinates: [77.6200, 13.0450] },
        website: 'https://manyatatechpark.com'
      }
    ]);

    console.log(`Seeded ${locations.length} Hub Locations (KIIT, ITER, Infosys, TCS, IIT BBS, Manyata).`);

    // 3. Create Sample Properties
    const properties = await Property.insertMany([
      {
        title: 'Starlight Residency — Premium Studio near KIIT Campus 6',
        description: 'Fully furnished luxury studio apartment with high-speed WiFi, AC, food facility and 24/7 security. Ideal for KIIT students and Infocity professionals.',
        propertyType: 'PG',
        owner: ownerBbsr._id,
        city: 'Bhubaneswar',
        state: 'Odisha',
        locality: 'Patia',
        address: 'Plot 412, KIIT Avenue, Near Campus 6, Patia',
        landmark: 'Near Rose Garden Cafe',
        location: { type: 'Point', coordinates: [85.8195, 20.3540] },
        monthlyRent: 8500,
        securityDeposit: 8500,
        maintenance: 500,
        electricityIncluded: false,
        waterIncluded: true,
        foodIncluded: true,
        brokerage: 0,
        availableFrom: new Date(),
        totalRooms: 10,
        availableRooms: 3,
        currentOccupants: 7,
        maxOccupants: 10,
        sharingType: 'single',
        suitableFor: ['students', 'workingProfessionals', 'bachelors', 'boys'],
        amenities: ['wifi', 'ac', 'fan', 'bed', 'mattress', 'wardrobe', 'studyTable', 'chair', 'geyser', 'refrigerator', 'washingMachine', 'powerBackup', 'waterPurifier', 'furnished'],
        moveInChecklist: ['Bed frame', 'Mattress', 'Study Desk', 'Ergonomic Chair', 'Wardrobe with lock', 'Geyser', 'Air Conditioner'],
        houseRules: {
          smokingAllowed: false,
          drinkingAllowed: false,
          partiesAllowed: false,
          petsAllowed: false,
          visitorsAllowed: true,
          oppositeGenderVisitorsAllowed: false,
          curfewEnabled: true,
          curfewTime: '10:30 PM',
          quietHoursEnabled: true,
          quietHoursStart: '11:00 PM',
          quietHoursEnd: '06:00 AM',
          studentOnly: false,
          workingProfessionalOnly: false,
          idProofRequired: true,
          policeVerificationRequired: true,
          customRules: [{ rule: 'No loud music inside rooms after 10 PM' }]
        },
        status: 'available',
        lastAvailabilityConfirmedAt: new Date(),
        statusUpdatedAt: new Date(),
        verificationStatus: 'verified',
        verifiedAt: new Date(),
        verifiedBy: admin._id,
        photos: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
        viewsCount: 142,
        enquiryCount: 18,
        wishlistCount: 25,
        visitRequestCount: 9
      },
      {
        title: 'Kalinga Homes — Spacous 2BHK Apartment near Infosys',
        description: 'Modern 2BHK flat with balcony, modular kitchen, reserved car parking and power backup. Located 5 mins from Infosys and TCS SEZ.',
        propertyType: '2BHK',
        broker: brokerBbsr._id,
        city: 'Bhubaneswar',
        state: 'Odisha',
        locality: 'Infocity',
        address: 'Block B, Green Valley Enclave, Chandaka SEZ Road',
        landmark: 'Opposite TCS Gitanjali Gate 2',
        location: { type: 'Point', coordinates: [85.8090, 20.3565] },
        monthlyRent: 16000,
        securityDeposit: 32000,
        maintenance: 1500,
        electricityIncluded: false,
        waterIncluded: true,
        foodIncluded: false,
        brokerage: 8000,
        availableFrom: new Date(),
        totalRooms: 2,
        availableRooms: 2,
        currentOccupants: 0,
        maxOccupants: 4,
        sharingType: 'private',
        suitableFor: ['workingProfessionals', 'couples', 'families'],
        amenities: ['wifi', 'ac', 'fan', 'kitchen', 'parking', 'balcony', 'lift', 'powerBackup', 'waterPurifier', 'semiFurnished'],
        moveInChecklist: ['Modular Kitchen setup', 'Geyser in both bathrooms', 'Curtains', 'Ceiling Fans', 'Exhaust fan', 'Car Parking slot'],
        houseRules: {
          smokingAllowed: false,
          drinkingAllowed: true,
          partiesAllowed: true,
          petsAllowed: true,
          visitorsAllowed: true,
          oppositeGenderVisitorsAllowed: true,
          curfewEnabled: false,
          curfewTime: '',
          quietHoursEnabled: true,
          quietHoursStart: '11:00 PM',
          quietHoursEnd: '06:00 AM',
          studentOnly: false,
          workingProfessionalOnly: true,
          idProofRequired: true,
          policeVerificationRequired: true,
          customRules: []
        },
        status: 'available',
        lastAvailabilityConfirmedAt: new Date(),
        statusUpdatedAt: new Date(),
        verificationStatus: 'verified',
        verifiedAt: new Date(),
        verifiedBy: admin._id,
        photos: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
        viewsCount: 289,
        enquiryCount: 31,
        wishlistCount: 42,
        visitRequestCount: 14
      },
      {
        title: 'Greenwood Girls Hostel — Safe Accommodation near ITER College',
        description: 'CCTV monitored premium girls hostel with delicious home-cooked meals, study hall, high speed WiFi, and daily housekeeping.',
        propertyType: 'hostel',
        owner: ownerBbsr._id,
        city: 'Bhubaneswar',
        state: 'Odisha',
        locality: 'Jagamara',
        address: 'Lane 3, Jagamara Square, Near ITER Campus Gate 1',
        landmark: 'Behind SBI Jagamara Branch',
        location: { type: 'Point', coordinates: [85.7985, 20.2510] },
        monthlyRent: 6500,
        securityDeposit: 6500,
        maintenance: 0,
        electricityIncluded: true,
        waterIncluded: true,
        foodIncluded: true,
        brokerage: 0,
        availableFrom: new Date(),
        totalRooms: 15,
        availableRooms: 4,
        currentOccupants: 26,
        maxOccupants: 30,
        sharingType: 'double',
        suitableFor: ['students', 'girls'],
        amenities: ['wifi', 'fan', 'bed', 'mattress', 'wardrobe', 'studyTable', 'chair', 'geyser', 'powerBackup', 'waterPurifier', 'furnished'],
        moveInChecklist: ['Bed', 'Study lamp', 'Individual locker wardrobe', '3 meals a day', 'Filter water dispenser'],
        houseRules: {
          smokingAllowed: false,
          drinkingAllowed: false,
          partiesAllowed: false,
          petsAllowed: false,
          visitorsAllowed: true,
          oppositeGenderVisitorsAllowed: false,
          curfewEnabled: true,
          curfewTime: '09:00 PM',
          quietHoursEnabled: true,
          quietHoursStart: '10:00 PM',
          quietHoursEnd: '06:00 AM',
          studentOnly: true,
          workingProfessionalOnly: false,
          idProofRequired: true,
          policeVerificationRequired: true,
          customRules: [{ rule: 'Parents must register in visitor log during visits' }]
        },
        status: 'available',
        lastAvailabilityConfirmedAt: new Date(),
        statusUpdatedAt: new Date(),
        verificationStatus: 'verified',
        verifiedAt: new Date(),
        verifiedBy: admin._id,
        photos: [
          'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
        viewsCount: 195,
        enquiryCount: 22,
        wishlistCount: 30,
        visitRequestCount: 11
      },
      {
        title: 'Somli Hostel — Home-style Food & Balconies',
        description: 'Home-style food, attached toilets, private balconies, and AC & Non-AC room choices located on Khandagiri Marg, Jagamara.',
        propertyType: 'hostel',
        owner: ownerBbsr._id,
        city: 'Bhubaneswar',
        state: 'Odisha',
        locality: 'Jagamara',
        address: 'Khandagiri Marg, Jagamara, Bhubaneswar, Odisha 751030',
        landmark: 'Near ITER Khandagiri Marg',
        location: { type: 'Point', coordinates: [85.7975, 20.2520] },
        monthlyRent: 7500,
        securityDeposit: 7500,
        maintenance: 300,
        electricityIncluded: true,
        waterIncluded: true,
        foodIncluded: true,
        brokerage: 0,
        availableFrom: new Date(),
        totalRooms: 12,
        availableRooms: 5,
        currentOccupants: 15,
        maxOccupants: 24,
        sharingType: 'double',
        suitableFor: ['students', 'workingProfessionals', 'bachelors', 'boys', 'girls'],
        amenities: ['wifi', 'ac', 'fan', 'bed', 'mattress', 'wardrobe', 'geyser', 'balcony', 'waterPurifier', 'furnished'],
        moveInChecklist: ['Bed frame', 'Mattress', 'Attached toilet accessories', 'Private balcony access', 'Hot water geyser'],
        houseRules: {
          smokingAllowed: false,
          drinkingAllowed: false,
          partiesAllowed: false,
          petsAllowed: false,
          visitorsAllowed: true,
          oppositeGenderVisitorsAllowed: false,
          curfewEnabled: true,
          curfewTime: '09:30 PM',
          quietHoursEnabled: true,
          quietHoursStart: '10:30 PM',
          quietHoursEnd: '06:00 AM',
          studentOnly: false,
          workingProfessionalOnly: false,
          idProofRequired: true,
          policeVerificationRequired: true,
          customRules: [{ rule: 'Home-style meals served thrice daily in dining room' }]
        },
        status: 'available',
        lastAvailabilityConfirmedAt: new Date(),
        statusUpdatedAt: new Date(),
        verificationStatus: 'verified',
        verifiedAt: new Date(),
        verifiedBy: admin._id,
        photos: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
        viewsCount: 310,
        enquiryCount: 29,
        wishlistCount: 45,
        visitRequestCount: 16
      },
      {
        title: 'Delta Boys Hostel — Hi-speed Wi-Fi & Parking',
        description: 'High-speed Wi-Fi, automatic washing machine, and dedicated bike parking. Offering shared & single room options near Bhujabala Petrol Pump.',
        propertyType: 'hostel',
        owner: ownerBbsr._id,
        city: 'Bhubaneswar',
        state: 'Odisha',
        locality: 'Khandagiri',
        address: 'Near Bhujabala Petrol Pump, Khandagiri, Bhubaneswar, Odisha 751030',
        landmark: 'Bhujabala Petrol Pump',
        location: { type: 'Point', coordinates: [85.7920, 20.2550] },
        monthlyRent: 6000,
        securityDeposit: 6000,
        maintenance: 200,
        electricityIncluded: false,
        waterIncluded: true,
        foodIncluded: false,
        brokerage: 0,
        availableFrom: new Date(),
        totalRooms: 16,
        availableRooms: 6,
        currentOccupants: 20,
        maxOccupants: 32,
        sharingType: 'single',
        suitableFor: ['students', 'bachelors', 'boys'],
        amenities: ['wifi', 'washingMachine', 'parking', 'fan', 'bed', 'mattress', 'wardrobe', 'studyTable', 'powerBackup', 'waterPurifier'],
        moveInChecklist: ['Bed', 'Study Table', 'High Speed Wi-Fi router password', 'Washing machine access badge'],
        houseRules: {
          smokingAllowed: false,
          drinkingAllowed: false,
          partiesAllowed: false,
          petsAllowed: false,
          visitorsAllowed: true,
          oppositeGenderVisitorsAllowed: false,
          curfewEnabled: true,
          curfewTime: '10:00 PM',
          quietHoursEnabled: true,
          quietHoursStart: '11:00 PM',
          quietHoursEnd: '06:00 AM',
          studentOnly: false,
          workingProfessionalOnly: false,
          idProofRequired: true,
          policeVerificationRequired: true,
          customRules: [{ rule: 'Bike parking slots designated by room number' }]
        },
        status: 'available',
        lastAvailabilityConfirmedAt: new Date(),
        statusUpdatedAt: new Date(),
        verificationStatus: 'verified',
        verifiedAt: new Date(),
        verifiedBy: admin._id,
        photos: [
          'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
        viewsCount: 265,
        enquiryCount: 24,
        wishlistCount: 38,
        visitRequestCount: 12
      },
      {
        title: 'Comfort Paying Guest — Refrigerator & 24/7 CCTV',
        description: 'Fully furnished paying guest setup equipped with refrigerator, washing machine, 24/7 CCTV surveillance, and geyser in Phase 4 Dumduma.',
        propertyType: 'PG',
        owner: ownerBbsr._id,
        city: 'Bhubaneswar',
        state: 'Odisha',
        locality: 'Dumduma',
        address: 'Phase 4, Dumduma, Bhubaneswar, Odisha 751019',
        landmark: 'Dumduma Housing Board Phase 4',
        location: { type: 'Point', coordinates: [85.7850, 20.2450] },
        monthlyRent: 9000,
        securityDeposit: 9000,
        maintenance: 500,
        electricityIncluded: false,
        waterIncluded: true,
        foodIncluded: false,
        brokerage: 0,
        availableFrom: new Date(),
        totalRooms: 8,
        availableRooms: 2,
        currentOccupants: 10,
        maxOccupants: 12,
        sharingType: 'private',
        suitableFor: ['workingProfessionals', 'bachelors', 'couples'],
        amenities: ['refrigerator', 'washingMachine', 'wifi', 'ac', 'geyser', 'powerBackup', 'waterPurifier', 'furnished', 'parking'],
        moveInChecklist: ['Refrigerator access', 'Washing Machine access', '24/7 CCTV camera coverage', 'AC Remote'],
        houseRules: {
          smokingAllowed: false,
          drinkingAllowed: true,
          partiesAllowed: false,
          petsAllowed: false,
          visitorsAllowed: true,
          oppositeGenderVisitorsAllowed: true,
          curfewEnabled: false,
          curfewTime: '',
          quietHoursEnabled: true,
          quietHoursStart: '10:30 PM',
          quietHoursEnd: '06:00 AM',
          studentOnly: false,
          workingProfessionalOnly: true,
          idProofRequired: true,
          policeVerificationRequired: true,
          customRules: [{ rule: 'Visitors allowed until 09:00 PM' }]
        },
        status: 'available',
        lastAvailabilityConfirmedAt: new Date(),
        statusUpdatedAt: new Date(),
        verificationStatus: 'verified',
        verifiedAt: new Date(),
        verifiedBy: admin._id,
        photos: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
        viewsCount: 420,
        enquiryCount: 37,
        wishlistCount: 52,
        visitRequestCount: 20
      },
      {
        title: 'Lucky Hostel — Budget-Friendly Bedding near Amrit Nagar',
        description: 'Budget-friendly accommodation with basic bedding, study desks, purified drinking water, and single & shared options in Amrit Nagar, Jagamara.',
        propertyType: 'hostel',
        owner: ownerBbsr._id,
        city: 'Bhubaneswar',
        state: 'Odisha',
        locality: 'Jagamara',
        address: 'Amrit Nagar, Jagamara, Bhubaneswar, Odisha 751030',
        landmark: 'Amrit Nagar Main Road',
        location: { type: 'Point', coordinates: [85.7960, 20.2490] },
        monthlyRent: 4500,
        securityDeposit: 4500,
        maintenance: 0,
        electricityIncluded: true,
        waterIncluded: true,
        foodIncluded: true,
        brokerage: 0,
        availableFrom: new Date(),
        totalRooms: 14,
        availableRooms: 5,
        currentOccupants: 20,
        maxOccupants: 28,
        sharingType: 'triple',
        suitableFor: ['students', 'bachelors', 'boys'],
        amenities: ['bed', 'mattress', 'fan', 'wardrobe', 'studyTable', 'waterPurifier'],
        moveInChecklist: ['Single Bed frame', 'Mattress', 'Study Desk', 'AquaGuard drinking water facility'],
        houseRules: {
          smokingAllowed: false,
          drinkingAllowed: false,
          partiesAllowed: false,
          petsAllowed: false,
          visitorsAllowed: true,
          oppositeGenderVisitorsAllowed: false,
          curfewEnabled: true,
          curfewTime: '10:00 PM',
          quietHoursEnabled: true,
          quietHoursStart: '10:00 PM',
          quietHoursEnd: '06:00 AM',
          studentOnly: true,
          workingProfessionalOnly: false,
          idProofRequired: true,
          policeVerificationRequired: true,
          customRules: [{ rule: 'Affordable meals included twice daily' }]
        },
        status: 'available',
        lastAvailabilityConfirmedAt: new Date(),
        statusUpdatedAt: new Date(),
        verificationStatus: 'verified',
        verifiedAt: new Date(),
        verifiedBy: admin._id,
        photos: [
          'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
        viewsCount: 180,
        enquiryCount: 19,
        wishlistCount: 28,
        visitRequestCount: 9
      }
    ]);

    console.log(`Seeded ${properties.length} Properties in Bhubaneswar.`);

    // 4. Create Nearby Services
    const services = await NearbyService.insertMany([
      {
        name: 'Maa Tarini Tiffin & Mess Service',
        category: 'mess',
        description: 'Authentic home-style Odia and North Indian meal delivery with subscription options.',
        photos: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'],
        phone: '+91 98530 99887',
        email: 'tiffin.bbsr@gmail.com',
        city: 'Bhubaneswar',
        locality: 'Patia',
        location: { type: 'Point', coordinates: [85.8192, 20.3538] },
        priceRange: '₹2,500 - ₹3,500 / month',
        operatingHours: '07:30 AM - 10:00 PM',
        serviceArea: 'Patia, KIIT Square, Infocity',
        verified: true
      },
      {
        name: 'QuickWash Laundry & Dry Cleaners',
        category: 'laundry',
        description: 'Same day door-step laundry pickup and drop for students and professionals.',
        photos: ['https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=800&q=80'],
        phone: '+91 94370 12345',
        email: 'quickwash.patia@gmail.com',
        city: 'Bhubaneswar',
        locality: 'Patia',
        location: { type: 'Point', coordinates: [85.8185, 20.3525] },
        priceRange: '₹60 / kg',
        operatingHours: '08:00 AM - 09:00 PM',
        serviceArea: 'KIIT Campus 1-15, Patia',
        verified: true
      },
      {
        name: 'UrbanClean House Cleaning Services',
        category: 'cleaning',
        description: 'Deep bathroom and flat cleaning by verified staff.',
        photos: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80'],
        phone: '+91 99371 88776',
        city: 'Bhubaneswar',
        locality: 'Infocity',
        location: { type: 'Point', coordinates: [85.8095, 20.3560] },
        priceRange: '₹499 / session',
        operatingHours: '09:00 AM - 07:00 PM',
        serviceArea: 'Bhubaneswar North',
        verified: true
      }
    ]);

    console.log(`Seeded ${services.length} Nearby Services (Mess, Laundry, Cleaning).`);

    // 5. Create Sample Visits & Reviews
    await Visit.create({
      tenant: tenantStudent._id,
      property: properties[0]._id,
      owner: ownerBbsr._id,
      requestedDate: new Date(Date.now() + 86400000 * 2),
      requestedTime: '04:00 PM',
      status: 'confirmed',
      notes: 'Please keep the room open for inspection.'
    });

    await Review.create({
      tenant: tenantStudent._id,
      property: properties[0]._id,
      rating: 5,
      cleanliness: 5,
      location: 5,
      ownerBehaviour: 5,
      internet: 4,
      water: 5,
      safety: 5,
      food: 4,
      noise: 4,
      comment: 'Extremely good room! Owner Ramesh Uncle is very supportive and location is right next to KIIT Campus 6.'
    });

    console.log('Seeded sample Visit and Review records.');
    console.log('✅ RoomNest Database Seeded Successfully!');

    if (process.argv[1].endsWith('seed.js')) {
      await mongoose.disconnect();
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Database Seeding Error:', error);
    if (process.argv[1].endsWith('seed.js')) {
      process.exit(1);
    }
  }
};

if (process.argv[1].endsWith('seed.js')) {
  seedDatabase();
}
