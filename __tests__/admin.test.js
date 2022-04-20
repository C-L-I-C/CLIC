const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

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
});
