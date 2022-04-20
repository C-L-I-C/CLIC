const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
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
      message: 'You rock!',
      username: 'user 1',
    });

    expect(res).toEqual({
      id: expect.any(String),
      userId: '1',
      message: 'You rock!',
      createdAt: expect.any(Date),
      username: 'user 1',
    });
  });

  it('should get all the past messages', async () => {
    const res = await Message.getAll();

    expect(res).toEqual([
      {
        message: 'HELLO WORLD!',
        userId: '1',
        id: expect.any(String),
        createdAt: expect.any(Date),
        username: 'user 1',
      },
      {
        message: 'Goodbye, see you next time!',
        userId: '2',
        id: expect.any(String),
        createdAt: expect.any(Date),
        username: 'user 2',
      },
    ]);
  });

  it('should get the last 10 chat history messages', async () => {
    await Message.insert({
      userId: '1',
      message: 'You rock!',
      username: 'user 1',
    });

    const expected = [
      {
        message: 'HELLO WORLD!',
        userId: '1',
        id: expect.any(String),
        createdAt: expect.any(Date),
        username: 'user 1',
      },
      {
        message: 'Goodbye, see you next time!',
        userId: '2',
        id: expect.any(String),
        createdAt: expect.any(Date),
        username: 'user 2',
      },
      {
        message: 'You rock!',
        userId: '1',
        id: expect.any(String),
        createdAt: expect.any(Date),
        username: 'user 1',
      },
    ];

    const res = await Message.getHistory();

    expect(res).toEqual(expected);
  });
});
