const app = require('./lib/app');
const ASCII = require('./lib/models/ASCII');
const Message = require('./lib/models/Message');
const User = require('./lib/models/User');
const pool = require('./lib/utils/pool');

const API_URL = process.env.API_URL || 'http://localhost';
const PORT = process.env.PORT || 7890;

app.listen(PORT, () => {
  console.log(`🚀  Server started on ${API_URL}:${PORT}`);
});

process.on('exit', () => {
  console.log('👋  Goodbye!');
  pool.end();
});

// SOCKET.IO SERVER

//create socket.io server
const io = require('socket.io')();
// name a port for our server
const SOCKET_PORT = process.env.SOCKET_PORT || 3000;

//user object to store names of user
const users = {};

// Listen for connection event
io.on('connection', (socket) => {
  console.log('New Connection: ' + socket.id);

  //if user emitted 'new user' event, this callback will be called
  socket.on('new user', async (name) => {
    // THIS IS WHERE WE INSERT IN OUR USER MODEL?
    // THIS WHERE WE FETCH AND BROADCAST/EMIT PAST MESSAGES?
    //store users name
    users[socket.id] = name;

    await User.insert({
      username: name,
    });

    const chatHistory = await Message.getHistory();
    console.log('CHAT HISTORY', chatHistory);
    chatHistory.map((entry) => {
      const chat = `${entry.username} at ${entry.createdAt.toLocaleTimeString(
        'en-US'
      )} said ${entry.message}`;
      socket.emit('client:message', chat);
    });
    // now we want to emit an event to all users except that user, that the new user has joined the chat
    socket.broadcast.emit('client:message', `${name} joined the chat.`);
  });

  // Listen for a message event
  socket.on('server:message', async (text) => {
    // THIS IS WHERE WE INSERT IN OUT MESSAGE MODEL?
    await Message.insert({
      message: text,
      username: `${users[socket.id]}`,
    });
    console.log('****socketID****', users[socket.id]);
    // emit an event to all users except that user
    socket.broadcast.emit('client:message', `${users[socket.id]}: ${text}`);
  });

  socket.on('emitAscii', async (text) => {
    // THIS IS WHERE WE INSERT IN OUT MESSAGE MODEL?
    await Message.insert({
      message: text,
      username: `${users[socket.id]}`,
      // userId: `${users[socket.id]}`,
    });
    // emit an event to all users except that user
    io.emit('client:message', `${users[socket.id]}: ${text}`);
  });

  //listen for /getList command
  socket.on('getList', async (command) => {
    const cmd = {
      ASCII,
    };
    //fetch out asciiNames from our DB
    const list = await cmd[command].getAll();
    //map through the array of object and broadcast the names back?
    const names = [];
    list.map((object) => {
      names.push(object.name);
    });
    socket.emit('selectList', [names, list]);
  });

  socket.on('create', async ([command, object]) => {
    const cmd = {
      ASCII,
    };
    const create = await cmd[command].insert(object);

    if (create) {
      socket.emit('client:message', 'A new ASCII has been created!');
    } else {
      socket.emit('client:message', 'Invalid ASCII ):');
    }
  });
});

//Starting up a server on PORT
io.listen(SOCKET_PORT, () => {
  console.log(`🚀  Server started on ${API_URL}:${SOCKET_PORT}`);
});
