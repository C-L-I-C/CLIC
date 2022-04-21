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

    const res = await request(app).post('/api/v1/admin/sessions').send({
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

    await AdminService.create({
      email: 'user@admin.com',
      password: 'whatever',
    });

    await agent.post('/api/v1/admin/sessions').send({
      email: 'user@admin.com',
      password: 'whatever',
    });

    const res = await agent.get('/api/v1/admin/messages');

    expect(res.body).toEqual(expected);
  });

  it('should return an error for get a list of each Message from messages if not authenticated', async () => {
    const res = await request(app).get('/api/v1/admin/messages');

    expect(res.body).toEqual({
      message: 'You must be signed in!',
      status: 401,
    });
  });

  it('should be able to get an instance of Message from messages by id for authenticated Admin', async () => {
    const agent = request.agent(app);
    await AdminService.create({
      email: 'user@admin.com',
      password: 'whatever',
    });

    await agent.post('/api/v1/admin/sessions').send({
      email: 'user@admin.com',
      password: 'whatever',
    });

    const res = await agent.get('/api/v1/admin/messages/1');

    expect(res.body).toEqual({
      id: expect.any(String),
      message: 'HELLO WORLD!',
      userId: '1',
      username: 'user 1',
      createdAt: expect.any(String),
    });
  });

  it('should return an error for get an instance of Message from messages by id if not authenticated', async () => {
    const res = await request(app).get('/api/v1/admin/messages/1');

    expect(res.body).toEqual({
      message: 'You must be signed in!',
      status: 401,
    });
  });

  it('should be able to update an instance of Message from messages by id', async () => {
    const agent = request.agent(app);
    await AdminService.create({
      email: 'user@admin.com',
      password: 'whatever',
    });

    await agent.post('/api/v1/admin/sessions').send({
      email: 'user@admin.com',
      password: 'whatever',
    });

    const res = await agent.patch('/api/v1/admin/messages/1').send({
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

  it('should return an error for update an instance of Message from messages by id if not authenticated', async () => {
    const res = await request(app).patch('/api/v1/admin/messages/1').send({
      message: 'GOODBYE WORLD!',
    });

    expect(res.body).toEqual({
      message: 'You must be signed in!',
      status: 401,
    });
  });

  it('should allow authenticated admin to delete an instance of Message from messages by id', async () => {
    const agent = request.agent(app);
    await AdminService.create({
      email: 'user@admin.com',
      password: 'whatever',
    });

    await agent.post('/api/v1/admin/sessions').send({
      email: 'user@admin.com',
      password: 'whatever',
    });

    const res = await agent.delete('/api/v1/admin/messages/1');

    expect(res.body).toEqual({
      id: expect.any(String),
      message: 'HELLO WORLD!',
      userId: '1',
      username: 'user 1',
      createdAt: expect.any(String),
    });
  });

  it('should return an error for delete an instance of Message from messages by id if not authenticated', async () => {
    const res = await request(app).delete('/api/v1/admin/messages/1');

    expect(res.body).toEqual({
      message: 'You must be signed in!',
      status: 401,
    });
  });
});
