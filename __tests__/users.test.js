const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');

describe('CLIC routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should insert a new user to the users table', async () => {
      const res = await User.insert({
          username: 'user 3',
          email: 'user3@test.com'
      });

      expect(res).toEqual({
          id: expect.any(String),
          username: 'user 3',
          email: 'user3@test.com'
      });
  })

  it('should get all users', async () => {
      const res = await User.getAll()

      expect(res).toEqual([{
          id: expect.any(String),
          username: 'user 1',
          email: 'user1@test.com'
      },
    {
        id: expect.any(String),
        username: 'user 2',
        email: 'user@test.com'
    }]);
  });
});