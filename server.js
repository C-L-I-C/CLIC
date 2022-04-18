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
    await Message.insert({
      message: text,
      // userId: `${users[socket.id]}`,
    });
    // emit an event to all users except that user
    socket.broadcast.emit('message', `${users[socket.id]}: ${text}`);
  });

  //listen for /listascii command
  socket.on('getList', async (command) => {
    const cmd = {
      'ASCII': ASCII
    }
    //fetch out asciiNames from our DB
    console.log('Commands!!!', command);
    const list = await cmd[command].getAll();
    //map through the array of object and broadcast the names back?
    let names = [];
    list.map((object) => {
      names.push(object.name)
      console.log('names?', object.name);
    });
    console.log('LISTSSSS', list);
    socket.emit('selectList', [names, list]);

    // console.log(asciiNames[0].name);
    // socket.emit('listascii', asciiNames[0].name);
  });

  socket.on('create', async ([command, object]) => {
    console.log('OBJECTTTT', object);
    const cmd = {
      'ASCII': ASCII
    }
    const create = await cmd[command].insert(object);
    console.log('CREATE', create);
    socket.emit('message', 'A new ASCII has been created!')

  })

  //listen for printascii event with name
  socket.on('printascii', async (name) => {
    const asciiObject = await ASCII.getByName(name);
    console.log('asciiString', asciiObject.string);
    io.emit('printascii', asciiObject.string);
    // socket.broadcast.emit('printascii', asciiObject.string);
  });

  //listen for /getnamestodelete event
  socket.on('getnamestodelete', async () => {
    //fetch list of asciiNames from our db
    const asciiNames = await ASCII.getAll();
    let names = [];
    asciiNames.map((object) => {
      names.push(object.name);
    });
    console.log('names', names);
    socket.emit('getnamestodelete', names);
  });

  // listen for /deleteascii event
  socket.on('deleteascii', async (answer) => {
    console.log('answer', answer);
    const response = await ASCII.deleteByName(answer);
    console.log('response', response);
  });
});

//Starting up a server on PORT
io.listen(SOCKET_PORT, () => {
  console.log(`🚀  Server started on ${API_URL}:${SOCKET_PORT}`);
});
