const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const Emoticon = require('../lib/models/Emoticon');

describe('Emoticon tests', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should get a Emoticon art by name', async () => {
    const expected = {
      id: expect.any(String),
      name: 'smileycat',
      string: '=(^_^)=',
    };

    const res = await Emoticon.getByName('smileycat');

    expect(res).toEqual(expected);
  });

  it('get list of all emoticons', async () => {
    const expected = [
      { id: expect.any(String), name: 'smileycat', string: '=(^_^)=' },
      {
        id: expect.any(String),
        name: 'robot',
        string: 'd[ o_0 ]b',
      },
    ];

    const res = await Emoticon.getAll();

    expect(res).toEqual(expected);
  });
});
