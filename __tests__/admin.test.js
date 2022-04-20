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

  it('should be able to get a list of each Message from messages for authenticated admins', async () => {
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

    let res = await agent.get('/api/v1/admins/messages');

    expect(res.body).toEqual({
      message: 'You must be signed in!',
      status: 401,
    });

    await AdminService.create({
      email: 'user@admin.com',
      password: 'whatever',
    });

    await agent.post('/api/v1/admins/sessions').send({
      email: 'user@admin.com',
      password: 'whatever',
    });

    res = await agent.get('/api/v1/admins/messages');

    expect(res.body).toEqual(expected);
  });

  it('should allow authenticated admin to delete a message by id', async () => {
    const agent = request.agent(app);
    await AdminService.create({
      email: 'user@admin.com',
      password: 'whatever',
    });

    await agent.post('/api/v1/admins/sessions').send({
      email: 'user@admin.com',
      password: 'whatever',
    });

    const res = await agent.delete('/api/v1/admins/messages/1');

    expect(res.body).toEqual({
      id: expect.any(String),
      message: 'HELLO WORLD!',
      userId: '1',
      username: 'user 1',
      createdAt: expect.any(String),
    });
  });

  it('should be able to get a Message by id', async () => {
    const agent = request.agent(app);
    await AdminService.create({
      email: 'user@admin.com',
      password: 'whatever',
    });

    await agent.post('/api/v1/admins/sessions').send({
      email: 'user@admin.com',
      password: 'whatever',
    });

    const res = await agent.get('/api/v1/admins/messages/1');

    expect(res.body).toEqual({
      id: expect.any(String),
      message: 'HELLO WORLD!',
      userId: '1',
      username: 'user 1',
      createdAt: expect.any(String),
    });
  });

  it('should be able to update a Message by id', async () => {
    const agent = request.agent(app);
    await AdminService.create({
      email: 'user@admin.com',
      password: 'whatever',
    });

    await agent.post('/api/v1/admins/sessions').send({
      email: 'user@admin.com',
      password: 'whatever',
    });

    const res = await agent.patch('/api/v1/admins/messages/1').send({
      message: 'GOODBYE WORLD!',
    });

    expect(res.body).toEqual({
      id: expect.any(String),
      message: 'GOODBYE WORLD!',
      userId: '1',
      username: 'user 1',
      createdAt: expect.any(String),
    });
  });
});
