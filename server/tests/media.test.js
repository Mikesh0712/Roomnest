import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import { User } from '../src/models/User.js';
import { Media } from '../src/models/Media.js';

let mongoServer;
let adminToken;
let userToken;
let userId;

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
  await Media.deleteMany({});

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

  const userRes = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Regular Owner',
      email: 'owner@roomnest.in',
      phone: '9888877777',
      password: 'Password@123',
      role: 'owner'
    });
  userToken = userRes.body.data.token;
  userId = userRes.body.data.user.id;
});

describe('Zero-Cost Media Moderation Architecture Tests', () => {
  it('should reject media upload if secureUrl and file are missing', async () => {
    const res = await request(app)
      .post('/api/media/upload')
      .set('Authorization', `Bearer ${userToken}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should reject image media exceeding 10MB limit', async () => {
    const res = await request(app)
      .post('/api/media/upload')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        secureUrl: 'https://cloudinary.com/test.jpg',
        mediaType: 'image',
        fileSize: 15 * 1024 * 1024
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/exceeds max limit/i);
  });

  it('should reject invalid MIME type for image', async () => {
    const res = await request(app)
      .post('/api/media/upload')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        secureUrl: 'https://cloudinary.com/test.exe',
        mediaType: 'image',
        mimeType: 'application/x-msdownload'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Unsupported MIME type/i);
  });

  it('should successfully upload valid image and assign moderationStatus: pending', async () => {
    const res = await request(app)
      .post('/api/media/upload')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        publicId: 'prop_img_101',
        secureUrl: 'https://res.cloudinary.com/zuqc8y8l/image/upload/v1/roomnest/room1.jpg',
        mediaType: 'image',
        mimeType: 'image/jpeg',
        fileSize: 2 * 1024 * 1024
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.moderationStatus).toBe('pending');
  });

  it('should allow admin to list pending media and approve it', async () => {
    // 1. Upload media
    const uploadRes = await request(app)
      .post('/api/media/upload')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        publicId: 'prop_img_102',
        secureUrl: 'https://res.cloudinary.com/zuqc8y8l/image/upload/v1/roomnest/room2.jpg',
        mediaType: 'image',
        mimeType: 'image/png',
        fileSize: 1 * 1024 * 1024
      });

    const mediaId = uploadRes.body.data._id;

    // 2. Admin retrieves pending queue
    const pendingRes = await request(app)
      .get('/api/admin/media/pending')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(pendingRes.statusCode).toBe(200);
    expect(pendingRes.body.data.some(m => m._id === mediaId)).toBe(true);

    // 3. Admin approves media
    const approveRes = await request(app)
      .post(`/api/admin/media/${mediaId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ reason: 'Clear quality property room photo' });

    expect(approveRes.statusCode).toBe(200);
    expect(approveRes.body.data.moderationStatus).toBe('approved');
  });
});
