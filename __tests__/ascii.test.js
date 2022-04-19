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

  it('should get a ASCII art by name', async () => {
    const expected = {
      id: expect.any(String),
      name: 'smileycat',
      string: '=(^_^)=',
    };

    const res = await ASCII.getByName('smileycat');

    expect(res).toEqual(expected);
  });

  it('get list of all asciis', async () => {
    const expected = [
      { id: expect.any(String), name: 'smileycat', string: '=(^_^)=' },
      {
        id: expect.any(String),
        name: 'robot',
        string: 'd[ o_0 ]b',
      },
    ];

    const res = await ASCII.getAll();

    expect(res).toEqual(expected);
  });
});
