import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import { User } from '../src/models/User.js';

let mongoServer;
let adminToken;
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

  const adminRes = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Admin User',
      email: 'admin@roomnest.in',
      phone: '9999999999',
      password: 'Password@123',
      role: 'admin'
    });
  adminToken = adminRes.body.data.token;

  const owner = await User.create({
    name: 'Pending Owner',
    email: 'pending.owner@roomnest.in',
    phone: '9888877777',
    passwordHash: 'hash',
    role: 'owner',
    verificationStatus: 'pending'
  });
  ownerId = owner._id.toString();
});

describe('Admin Workflow & Moderation API Tests', () => {
  it('GET /api/admin/verifications/pending should list pending verification requests', async () => {
    const res = await request(app)
      .get('/api/admin/verifications/pending')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0]._id).toBe(ownerId);
  });

  it('POST /api/admin/verifications/:userId/approve should approve owner verification', async () => {
    const res = await request(app)
      .post(`/api/admin/verifications/${ownerId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ notes: 'Documents verified clean' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.verificationStatus).toBe('verified');
  });
});
