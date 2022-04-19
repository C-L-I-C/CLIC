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
  });

  it('should get all the past messages', async () => {
    const res = await Message.getAll();



    expect(res).toEqual([{
      message: 'HELLO WORLD!',
      userId: '1',
      id: expect.any(String),
      createdAt: expect.any(Date)
    }, {

      message: 'Goodbye, see you next time!',
      userId: '2',
      id: expect.any(String),
      createdAt: expect.any(Date)

    }]);
  });


  it('should get the last 10 chat history messages', async () => {

    await Message.insert({
      userId: '1',
      message: 'You rock!'
    });

    const expected = [
      {
        message: 'HELLO WORLD!',
        userId: '1',
        id: expect.any(String),
        createdAt: expect.any(Date)
      },
      {
        message: 'Goodbye, see you next time!',
        userId: '2',
        id: expect.any(String),
        createdAt: expect.any(Date)
      },
      {
        message: 'You rock!',
        userId: '1',
        id: expect.any(String),
        createdAt: expect.any(Date)
      }
    ];

    const res = await Message.getHistory();

    // console.log('res in test', res);

    expect(res).toEqual(expected);




  });
});
