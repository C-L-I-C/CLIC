const app = require('./lib/app');
const Emoticon = require('./lib/models/Emoticon');
const Message = require('./lib/models/Message');
const User = require('./lib/models/User');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { getDadJoke, getQuote } = require('./lib/utils/QuoteUtils');

// const pool = require('./lib/utils/pool'); //needed for local deploy

const PORT = process.env.PORT || 7890;


// HTTP / EXPRESS SERVER ACCORDING TO SOCKET IO DOCS - FOR HEROKU DEPLOY
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });
httpServer.listen(PORT, () => console.log(`Listening on ${PORT}`));


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

    // now we want to emit an event to all users except that user, that the new user has joined the chat
    socket.broadcast.emit('client:message', `${name} joined the chat.`);
  });

  // Listen for a message event
  socket.on('server:message', async (text) => {
    // THIS IS WHERE WE INSERT IN OUT MESSAGE MODEL
    await Message.insert({
      message: text,
      username: `${users[socket.id]}`,
    });
    // emit an event to all users except that user
    socket.broadcast.emit('client:message', `${users[socket.id]}: ${text}`
    );
  });

  socket.on('emitEmoticon', async (text) => {
    // THIS IS WHERE WE INSERT IN OUT MESSAGE MODEL?
    await Message.insert({
      message: text,
      username: `${users[socket.id]}`,
    });
    // emit an event to all users except that user
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

  //listen for /history command
  socket.on('getHistory', async (historyCount) => {
    //fetch chat history from our DB
    const chatHistory = await Message.getHistory(Number(historyCount));

    const reversedHistory = chatHistory.reverse();

    reversedHistory.map((entry) => {
      const chat = `${entry.username} said ${entry.message} at ${entry.createdAt.toLocaleTimeString('en-US')}`;
      socket.emit(
        'client:message',
        chat
      );
    });
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
        'client:message', 'A new Emoticon has been created!');
    } else {
      socket.emit('client:message', 'Invalid Emoticon ):');
    }
  });

});


// listen for a disconnect event
io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    //store users name
    users[socket.id];
    // now we want to emit an event to all users except that user, that an user has left the chat
    socket.broadcast.emit(
      'client:message',
      `${users[socket.id]} has left the chat.`
    );
  });
});

