import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import { User } from '../src/models/User.js';
import { Property } from '../src/models/Property.js';

let mongoServer;
let ownerToken;
let ownerId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Property.deleteMany({});

  const ownerRes = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Property Owner',
      email: 'owner@roomnest.in',
      phone: '9853000000',
      password: 'Password@123',
      role: 'owner'
    });

  ownerToken = ownerRes.body.data.token;
  ownerId = ownerRes.body.data.user.id;
});

describe('Property API Tests', () => {
  const propertyPayload = {
    title: 'Sunny Studio Apartment Near KIIT',
    description: 'Cozy and spacious studio',
    propertyType: 'PG',
    city: 'Bhubaneswar',
    state: 'Odisha',
    locality: 'Patia',
    address: 'Plot 100, Patia',
    longitude: 85.8190,
    latitude: 20.3533,
    monthlyRent: 7500,
    sharingType: 'single',
    suitableFor: ['students', 'boys'],
    amenities: ['wifi', 'ac', 'bed']
  };

  it('POST /api/properties should create a property when authenticated as owner', async () => {
    const res = await request(app)
      .post('/api/properties')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(propertyPayload);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Sunny Studio Apartment Near KIIT');
    expect(res.body.data.owner).toBe(ownerId);
  });

  it('GET /api/properties should search and filter properties deterministically', async () => {
    await request(app)
      .post('/api/properties')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(propertyPayload);

    await request(app)
      .post('/api/properties')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        ...propertyPayload,
        title: 'Expensive 3BHK Flat',
        propertyType: '3BHK',
        monthlyRent: 25000
      });

    // Filter by maxRent
    const filterRes = await request(app)
      .get('/api/properties?city=Bhubaneswar&maxRent=10000')
      .expect(200);

    expect(filterRes.body.data.length).toBe(1);
    expect(filterRes.body.data[0].title).toBe('Sunny Studio Apartment Near KIIT');
  });

  it('PATCH /api/properties/:id/status should update property availability status', async () => {
    const createRes = await request(app)
      .post('/api/properties')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(propertyPayload);

    const propId = createRes.body.data.id || createRes.body.data._id;

    const statusRes = await request(app)
      .patch(`/api/properties/${propId}/status`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        status: 'under_renovation',
        statusReason: 'Bathroom repairs'
      });

    expect(statusRes.statusCode).toBe(200);
    expect(statusRes.body.data.status).toBe('under_renovation');
    expect(statusRes.body.data.statusReason).toBe('Bathroom repairs');
  });
});
