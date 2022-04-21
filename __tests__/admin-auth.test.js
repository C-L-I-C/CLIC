const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const AdminService = require('../lib/services/AdminService');
const Admin = require('../lib/models/Admin');

describe('Admin routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  // Admin

  it('should insert an instance of Admin into admins with email and password', async () => {
    const res = await request(app).post('/api/v1/admin').send({
      email: 'user@admin.com',
      password: 'whatever',
    });

    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'user@admin.com',
    });
  });

  it('should be able to sign in an existing Admin with an email and password', async () => {
    const admin = await AdminService.create({
      email: 'user@admin.com',
      password: 'whatever',
    });

    const res = await request(app).post('/api/v1/admin/session').send({
      email: 'user@admin.com',
      password: 'whatever',
    });

    expect(res.body).toEqual({
      message: 'Signed in successfully!',
      admin,
    });
  });

  it('should be able to get an instance of Admin from admins by email', async () => {
    await AdminService.create({
      email: 'user@admin.com',
      password: 'whatever',
    });

    const res = await Admin.findByEmail('user@admin.com');

    expect(res).toEqual({
      id: expect.any(String),
      email: 'user@admin.com',
    });
  });
});
