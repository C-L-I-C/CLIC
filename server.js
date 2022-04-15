const app = require('./lib/app');
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

  //if user emmited 'new user' event, this callback will be called
  socket.on('new user', async (name) => {
    // THIS IS WHERE WE INSERT IN OUR USER MODEL?
    // THIS WHERE WE FETCH AND BROADCAST/EMIT PAST MESSAGES?
    //store users name
    users[socket.id] = name;

    const res = await User.insert({
      username: name,
    });
    console.log('newuser!!', res);

    // now we want to emit an event to all users except that user, that the new user has joined the chat
    socket.broadcast.emit('message', `${name} joined the chat.`);
  });

  // Listen for a message event
  socket.on('message', async (text) => {
    // THIS IS WHERE WE INSERT IN OUT MESSAGE MODEL?
    const res = await Message.insert({
      message: text,
      // userId: `${users[socket.id]}`,
    });
    console.log('messageres', res);
    // emit an event to all users execept that user
    socket.broadcast.emit('message', `${users[socket.id]}: ${text}`);
  });
});

//Starting up a server on PORT
io.listen(SOCKET_PORT, () => {
  console.log(`🚀  Server started on ${API_URL}:${SOCKET_PORT}`);
});
