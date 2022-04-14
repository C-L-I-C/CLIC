const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Message = require('../lib/models/Message');

describe('CLIC routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should be able to insert and instance of message into messages', async () => {
    const response = await Message.insert({
      userId: '1',
      message: 'You rock!'
    });

    expect(response.body).toEqual({
      id: expect.any(String),
      userId: '1',
      message: 'You rock!',
      createdAt: expect.any(String)
  });
  })
});
