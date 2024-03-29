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

  it('should be able to insert an instance of Message into messages', async () => {
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

  it('should be able to get a list of each instance of Message from messages', async () => {
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

  it('should be able to get an instance of Message from messages by id', async () => {
    const res = await Message.getById(1);
    expect(res).toEqual({
      id: expect.any(String),
      message: 'HELLO WORLD!',
      userId: '1',
      username: 'user 1',
      createdAt: expect.any(Date),
    });
  });

  it('should be able to get the last x instances of Message from messages', async () => {
    await Message.insert({
      userId: '1',
      message: 'You rock!',
      username: 'user 1',
    });

    const expected = [
      {
        message: 'You rock!',
        userId: '1',
        id: expect.any(String),
        createdAt: expect.any(Date),
        username: 'user 1',
      },
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
    ];

    const res = await Message.getHistory(3);

    expect(res).toEqual(expected);
  });

  it('should be able to update an instance of Message from messages by id', async () => {
    const res = await Message.updateById(1, {
      message: 'Goodbye',
    });
    expect(res).toEqual({
      createdAt: expect.any(Date),
      id: '1',
      message: 'Goodbye',
      userId: '1',
      username: 'user 1',
    });
  });

  it('should be able to delete an instance of Message from messages by id', async () => {
    const res = await Message.deleteById(1);
    expect(res).toEqual({
      id: expect.any(String),
      message: 'HELLO WORLD!',
      userId: '1',
      username: 'user 1',
      createdAt: expect.any(Date),
    });
  });
});
