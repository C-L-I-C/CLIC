const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const AdminService = require('../lib/services/AdminService');

describe('Admin routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should insert an instance of Admin into admins with email and password', async () => {
    const res = await request(app).post('/api/v1/admins').send({
      email: 'user@admin.com',
      password: 'whatever',
    });

    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'user@admin.com',
    });
  });

  it('should be able to sign in an existing Admin', async () => {
    const admin = await AdminService.create({
      email: 'user@admin.com',
      password: 'whatever',
    });

    const res = await request(app).post('/api/v1/admins/sessions').send({
      email: 'user@admin.com',
      password: 'whatever',
    });

    expect(res.body).toEqual({
      message: 'Signed in successfully!',
      admin,
    });
  });

  it('should be able to get a list of each Message from messages', async () => {
    const agent = request.agent(app);
    const expected = [
      {
        message: 'HELLO WORLD!',
        userId: '1',
        id: expect.any(String),
        createdAt: expect.any(String),
        username: 'user 1',
      },
      {
        message: 'Goodbye, see you next time!',
        userId: '2',
        id: expect.any(String),
        createdAt: expect.any(String),
        username: 'user 2',
      },
    ];

    await AdminService.create({
      email: 'user@admin.com',
      password: 'whatever',
    });

    await agent.post('/api/v1/admins/sessions').send({
      email: 'user@admin.com',
      password: 'whatever',
    });

    const res = await agent.get('/api/v1/admins/messages');

    expect(res.body).toEqual(expected);
  });
});
