const app = require('./lib/app');
const Emoticon = require('./lib/models/Emoticon');
const Message = require('./lib/models/Message');
const User = require('./lib/models/User');
// const pool = require('./lib/utils/pool');

const { createServer } = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 7890;
const chalk = require('chalk');
// const SOCKET_PORT = process.env.SOCKET_PORT || 3000;
// HTTP / EXPRESS SERVER ACCORDING TO SOCKET IO DOCS
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

httpServer.listen(PORT, () => console.log(`Listening on ${PORT}`));

// ORIGINAL EXPRESS SERVER METHOD
// const API_URL = process.env.API_URL || 'http://localhost';
// app.listen(PORT, () => {
//   console.log(`🚀  Server started on ${API_URL}:${PORT}`);
// });
// process.on('exit', () => {
//   console.log('👋  Goodbye!');
//   pool.end();
// });

// SOCKET.IO SERVER ACCORDING TO TUTORIAL
//create socket.io server
// const io = require('socket.io')();
// // name a port for our server
// const SOCKET_PORT = process.env.SOCKET_PORT || 3000;

//user object to store names of user
const users = {};

// randomColor methods
const chalkBackgroundColors = [
  chalk.bgCyan,
  chalk.bgBlue,
  chalk.bgRed,
  chalk.bgYellow,
];

const randomBackgroundColor =
  chalkBackgroundColors[
    Math.floor(Math.random() * chalkBackgroundColors.length)
  ];

const chalkTextColors = [
  chalk.redBright,
  chalk.yellowBright,
  chalk.greenBright,
  chalk.blueBright,
  chalk.whiteBright,
  chalk.magentaBright,
  chalk.cyanBright,
];

const randomTextColor =
  chalkTextColors[Math.floor(Math.random() * chalkTextColors.length)];

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

    chatHistory.map((entry) => {
      const chat = `${entry.username} said ${
        entry.message
      } at ${entry.createdAt.toLocaleTimeString('en-US')}`;
      socket.emit(
        'client:message',
        chalk.italic.rgb(224, 212, 153).bgWhite(chat)
      );
    });
    // now we want to emit an event to all users except that user, that the new user has joined the chat
    socket.broadcast.emit(
      'client:message',
      randomTextColor`${name} joined the chat.`
    );
  });

  // Listen for a message event
  socket.on('server:message', async (text) => {
    // THIS IS WHERE WE INSERT IN OUT MESSAGE MODEL
    await Message.insert({
      message: text,
      username: `${users[socket.id]}`,
    });
    // emit an event to all users except that user
    socket.broadcast.emit(
      'client:message',
      randomBackgroundColor`${users[socket.id]}: ${text}`
    );
  });

  socket.on('emitEmoticon', async (text) => {
    // THIS IS WHERE WE INSERT IN OUT MESSAGE MODEL?
    await Message.insert({
      message: text,
      username: `${users[socket.id]}`,
    });
    // emit an event to all users except that user
    io.emit('client:message', randomTextColor`${users[socket.id]}: ${text}`);
  });

  //listen for /getList command
  socket.on('getList', async (command) => {
    const cmd = {
      Emoticon,
    };
    //fetch out emoticons from our DB
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
      Emoticon,
    };
    const create = await cmd[command].insert(object);

    if (create) {
      socket.emit(
        'client:message',
        chalk.bold.red('A new Emoticon has been created!')
      );
    } else {
      socket.emit('client:message', chalk.bold.red('Invalid Emoticon ):'));
    }
  });
});

//Starting up a server on SOCKET_PORT
// io.listen(SOCKET_PORT, () => {
//   console.log(`🚀  Server started on ${API_URL}:${SOCKET_PORT}`);
// });
