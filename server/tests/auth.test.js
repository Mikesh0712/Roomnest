import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import { User } from '../src/models/User.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('Authentication API Tests', () => {
  const sampleUser = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210',
    password: 'Password@123',
    role: 'tenant'
  };

  it('POST /api/auth/register should register a new tenant user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(sampleUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe('john@example.com');
    expect(res.body.data.user.role).toBe('tenant');
    expect(res.body.data.user.passwordHash).toBeUndefined();
  });

  it('POST /api/auth/register should reject duplicate email or phone', async () => {
    await request(app).post('/api/auth/register').send(sampleUser);

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        ...sampleUser,
        phone: '9999988888'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Email address is already registered');
  });

  it('POST /api/auth/login should authenticate with email or phone', async () => {
    await request(app).post('/api/auth/register').send(sampleUser);

    // Login with Email
    const loginEmailRes = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: 'john@example.com',
        password: 'Password@123'
      });

    expect(loginEmailRes.statusCode).toBe(200);
    expect(loginEmailRes.body.success).toBe(true);
    expect(loginEmailRes.body.data.token).toBeDefined();

    // Login with Phone
    const loginPhoneRes = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: '9876543210',
        password: 'Password@123'
      });

    expect(loginPhoneRes.statusCode).toBe(200);
    expect(loginPhoneRes.body.success).toBe(true);
  });

  it('POST /api/auth/login should reject invalid password', async () => {
    await request(app).post('/api/auth/register').send(sampleUser);

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: 'john@example.com',
        password: 'WrongPassword'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
