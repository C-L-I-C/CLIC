const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
// const request = require('supertest');
// const app = require('../lib/app');
const ASCII = require('../lib/models/ASCII');

describe('ASCII tests', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should get a ASCII string by name', async () => {
    const expected = expect.any(String);

    const res = await ASCII.getByName('helloworld');

    expect(res.string).toEqual(expected);
  });


  it('get list of all ascii names', async () => {
    const expected = [{ name: expect.any(String) }, { name: expect.any(String) }];

    const res = await ASCII.getAll();

    expect(res).toEqual(expected);
  });

});
