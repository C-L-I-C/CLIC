const app = require('./lib/app');
const Emoticon = require('./lib/models/Emoticon');
const Message = require('./lib/models/Message');
const User = require('./lib/models/User');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { getDadJoke, getQuote } = require('./lib/utils/QuoteUtils');

const PORT = process.env.PORT || 7890;

const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });
httpServer.listen(PORT, () => console.log(`Listening on ${PORT}`));

const users = {};

io.on('connection', (socket) => {
  console.log('New Connection: ' + socket.id);
  socket.on('new user', async (name) => {
    users[socket.id] = name;
    await User.insert({
      username: name,
    });

    socket.broadcast.emit('client:message', `${name} joined the chat.`);
  });

  socket.on('server:message', async (text) => {
    await Message.insert({
      message: text,
      username: `${users[socket.id]}`,
    });
    socket.broadcast.emit('client:message', `${users[socket.id]}: ${text}`
    );
  });

  socket.on('emitEmoticon', async (text) => {
    await Message.insert({
      message: text,
      username: `${users[socket.id]}`,
    });
    io.emit('client:message', `${users[socket.id]}: ${text}`);
  });


  socket.on('getQuote', async () => {
    const quote = await getQuote();
    io.emit('client:message', `${users[socket.id]}: Quote for the day!: ${quote[0].q} -${quote[0].a}`);
  });

  socket.on('getJoke', async () => {
    try {
      const joke = await getDadJoke();
      io.emit('client:message', `${users[socket.id]}: ${joke.body[0].setup}..... ${joke.body[0].punchline}`);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('getHistory', async (historyCount) => {
    const chatHistory = await Message.getHistory(Number(historyCount));
    const reversedHistory = chatHistory.reverse();
    reversedHistory.map((entry) => {
      const chat = `${entry.username} said ${entry.message} at ${entry.createdAt.toLocaleTimeString('en-US')}`;
      socket.emit('client:message', chat);
    });
  });

  socket.on('getList', async (command) => {
    const cmd = { Emoticon };
    const list = await cmd[command].getAll();
    const names = [];
    list.map((object) => {
      names.push(object.name);
    });
    socket.emit('selectList', [names, list]);
  });

  socket.on('create', async ([command, object]) => {
    const cmd = { Emoticon };
    const create = await cmd[command].insert(object);
    if (create) {
      socket.emit('client:message', 'A new Emoticon has been created!');
    } else {
      socket.emit('client:message', 'Invalid Emoticon ):');
    }
  });
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    users[socket.id];
    socket.broadcast.emit('client:message', `${users[socket.id]} has left the chat.`);
  });
});

// // ORIGINAL EXPRESS SERVER METHOD - NEEDED FOR LOCAL DEPLOY
// const API_URL = process.env.API_URL || 'http://localhost';
// app.listen(PORT, () => {
//   console.log(`🚀  Server started on ${API_URL}:${PORT}`);
// });
// process.on('exit', () => {
//   console.log('👋  Goodbye!');
//   pool.end();
// });

// // SOCKET.IO SERVER ACCORDING TO TUTORIAL - NEEDED FOR LOCAL DEPLOY
// // create socket.io server
// // name a port for our server
// const io = require('socket.io')();
// const SOCKET_PORT = process.env.SOCKET_PORT || 3000;

// // Starting up a server on SOCKET_PORT - NEEDED FOR LOCAL DEPLOY
// io.listen(SOCKET_PORT, () => {
//   console.log(`🚀  Server started on ${API_URL}:${SOCKET_PORT}`);
// });
// const pool = require('./lib/utils/pool'); //needed for local deploy
