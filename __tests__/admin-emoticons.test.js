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

  // Emoticon
  it('should be able to get a list of each Emoticon from emoticons for authenticated admins', async () => {
    const agent = request.agent(app);

    await AdminService.create({
      email: 'user@admin.com',
      password: 'whatever',
    });

    await agent.post('/api/v1/admin/session').send({
      email: 'user@admin.com',
      password: 'whatever',
    });

    const res = await agent.get('/api/v1/admin/emoticon');

    expect(res.body).toEqual([
      { id: '1', name: 'smileycat', string: '=(^_^)=' },
      { id: '2', name: 'robot', string: 'd[ o_0 ]b' },
    ]);
  });

  it('should return an error for get a list of each Emoticon from emoticons if not authenticated', async () => {
    const res = await request(app).get('/api/v1/admin/emoticon');

    expect(res.body).toEqual({
      message: 'You must be signed in!',
      status: 401,
    });
  });

  it('should be able to get an instance of Emoticon from emoticons by name for authenticated Admin', async () => {
    const agent = request.agent(app);
    await AdminService.create({
      email: 'user@admin.com',
      password: 'whatever',
    });

    await agent.post('/api/v1/admin/session').send({
      email: 'user@admin.com',
      password: 'whatever',
    });

    const res = await agent.get('/api/v1/admin/emoticon/smileycat');

    expect(res.body).toEqual({ id: '1', name: 'smileycat', string: '=(^_^)=' });
  });

  it('should return an error for get an instance of Emoticon from emoticons by id if not authenticated', async () => {
    const res = await request(app).get('/api/v1/admin/emoticon/smileycat');

    expect(res.body).toEqual({
      message: 'You must be signed in!',
      status: 401,
    });
  });

  it('should be able to update an instance of Emoticon from emoticons by name', async () => {
    const agent = request.agent(app);
    await AdminService.create({
      email: 'user@admin.com',
      password: 'whatever',
    });

    await agent.post('/api/v1/admin/session').send({
      email: 'user@admin.com',
      password: 'whatever',
    });

    const res = await agent.patch('/api/v1/admin/emoticon/smileycat').send({
      name: 'sadcat',
      string: '=[',
    });

    expect(res.body).toEqual({ id: '1', name: 'sadcat', string: '=[' });
  });

  it('should return an error for update an instance of Emoticon from emoticons by name if not authenticated', async () => {
    const res = await request(app)
      .patch('/api/v1/admin/emoticon/smileycat')
      .send({
        name: 'sadcat',
        string: '=[',
      });

    expect(res.body).toEqual({
      message: 'You must be signed in!',
      status: 401,
    });
  });

  it('should be able to delete an instance of Emoticon from emoticons by name if authenticated', async () => {
    const agent = request.agent(app);
    await AdminService.create({
      email: 'user@admin.com',
      password: 'whatever',
    });

    await agent.post('/api/v1/admin/session').send({
      email: 'user@admin.com',
      password: 'whatever',
    });

    const res = await agent.delete('/api/v1/admin/emoticon/smileycat');

    expect(res.body).toEqual({ id: '1', name: 'smileycat', string: '=(^_^)=' });
  });

  it('should return an error for delete an instance of Emoticon from emoticons by name if not authenticated', async () => {
    const res = await request(app).delete('/api/v1/admin/emoticon/smileycat');

    expect(res.body).toEqual({
      message: 'You must be signed in!',
      status: 401,
    });
  });
});
