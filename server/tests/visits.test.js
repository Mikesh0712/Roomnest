import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import { User } from '../src/models/User.js';
import { Property } from '../src/models/Property.js';

let mongoServer;
let tenantToken;
let propertyId;

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

  const tenantRes = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Tenant User',
      email: 'tenant@roomnest.in',
      phone: '9998877665',
      password: 'Password@123',
      role: 'tenant'
    });
  tenantToken = tenantRes.body.data.token;

  const prop = await Property.create({
    title: 'Visit Test Flat',
    propertyType: '1BHK',
    city: 'Bhubaneswar',
    state: 'Odisha',
    locality: 'Patia',
    address: 'Near KIIT',
    location: { type: 'Point', coordinates: [85.8190, 20.3533] },
    monthlyRent: 9000
  });
  propertyId = prop._id.toString();
});

describe('Visits Scheduling API Tests', () => {
  it('POST /api/visits should allow tenant to request a property visit', async () => {
    const res = await request(app)
      .post('/api/visits')
      .set('Authorization', `Bearer ${tenantToken}`)
      .send({
        propertyId,
        requestedDate: '2026-08-25',
        requestedTime: '05:00 PM',
        notes: 'Looking forward to viewing'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('requested');
  });
});
