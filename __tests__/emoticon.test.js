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

  it('should be able to insert an instance of Emoticon into emoticons', async () => {
    const res = await Emoticon.insert({
      name: 'cutemoji',
      string: '=>.<=',
    });

    expect(res).toEqual({
      id: expect.any(String),
      name: 'cutemoji',
      string: '=>.<=',
    });
  });

  it('should be able to get a list of each instance of Emoticon from emoticons', async () => {
    const expected = [
      { id: expect.any(String), name: 'smileycat', string: '=(^_^)=' },
      { id: expect.any(String), name: 'robot', string: 'd[ o_0 ]b' },
    ];

    const res = await Emoticon.getAll();

    expect(res).toEqual(expected);
  });

  it('should be able to get an instance of Emoticon from emoticons by name', async () => {
    const expected = {
      id: expect.any(String),
      name: 'smileycat',
      string: '=(^_^)=',
    };

    const res = await Emoticon.getByName('smileycat');

    expect(res).toEqual(expected);
  });

  it('should be able to update an instance of Emoticon from emoticons by name', async () => {
    const res = await Emoticon.updateByName('smileycat', {
      name: 'sadcat',
      string: '=[',
    });

    expect(res).toEqual({
      id: expect.any(String),
      name: 'sadcat',
      string: '=[',
    });
  });

  it('should be able to delete an instance of Emoticon from emoticons by name', async () => {
    const res = await Emoticon.deleteByName('smileycat');
    expect(res).toEqual({
      id: expect.any(String),
      name: 'smileycat',
      string: '=(^_^)=',
    });
  });
});
