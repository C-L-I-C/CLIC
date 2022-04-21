const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const AdminService = require('../lib/services/AdminService');

const User = require('../lib/models/User');

describe('CLIC routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should be able to get each instance of User from users if authenticated', async () => {
    const agent = request.agent(app);

    await AdminService.create({
      email: 'user@admin.com',
      password: 'whatever',
    });

    await agent.post('/api/v1/admin/session').send({
      email: 'user@admin.com',
      password: 'whatever',
    });

    const res = await agent.get('/api/v1/admin/user');

    expect(res.body).toEqual([
      { id: expect.any(String), email: 'user1@test.com', username: 'user 1' },
      { id: expect.any(String), email: 'user2@test.com', username: 'user 2' },
    ]);
  });

  it('should be able to get an instance of User from users by id if authenticated', async () => {
    const agent = request.agent(app);

    await AdminService.create({
      email: 'user@admin.com',
      password: 'whatever',
    });

    await agent.post('/api/v1/admin/session').send({
      email: 'user@admin.com',
      password: 'whatever',
    });

    const res = await agent.get('/api/v1/admin/user/1');

    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'user1@test.com',
      username: 'user 1',
    });
  });
});
