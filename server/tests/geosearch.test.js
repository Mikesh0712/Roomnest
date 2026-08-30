import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import { Property } from '../src/models/Property.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Property.deleteMany({});
  // Ensure 2dsphere index is built
  await Property.createIndexes();
});

describe('Geospatial Search API Tests', () => {
  it('GET /api/properties/nearby should return properties within specified radius', async () => {
    // KIIT University Coordinates: [85.8190, 20.3533]
    await Property.create({
      title: 'KIIT Patia PG',
      propertyType: 'PG',
      city: 'Bhubaneswar',
      state: 'Odisha',
      locality: 'Patia',
      address: 'Near Campus 6',
      location: { type: 'Point', coordinates: [85.8192, 20.3535] },
      monthlyRent: 6000
    });

    // Far away property (Cuttack: ~25km away)
    await Property.create({
      title: 'Cuttack Home',
      propertyType: 'independentHouse',
      city: 'Cuttack',
      state: 'Odisha',
      locality: 'Badambadi',
      address: 'Main Road Cuttack',
      location: { type: 'Point', coordinates: [85.8828, 20.4625] },
      monthlyRent: 12000
    });

    const res = await request(app)
      .get('/api/properties/nearby?latitude=20.3533&longitude=85.8190&radius=3000')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].property.title).toBe('KIIT Patia PG');
    expect(res.body.data[0].distanceMeters).toBeLessThan(1000);
  });
});
