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

  it('should be able to insert an instance of message into messages', async () => {
    const res = await Message.insert({
      userId: '1',
      message: 'You rock!'
    });

    expect(res).toEqual({
      id: expect.any(String),
      userId: '1',
      message: 'You rock!',
      createdAt: expect.any(Date)
  });
  })
});
