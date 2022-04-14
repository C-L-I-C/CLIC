// socket.io client 

// Import socket.io client module
const io = require('socket.io-client');

// pass url of our server
const socket = io('http://localhost:3000');

// import readline to read from console
const readline = require('readline');

// create an interface to get input from the terminal console
const rl = readline.createInterface({
  input: process.stdin,
});

// Get the users name
console.log('Enter your username: ');
rl.question('Enter your username: ', (text) => {
  //send the users name to the server
  socket.emit('new user', text.trim());
  //let the user know they joined
  console.log('You joined the chat');
  // write a > in terminal to prompt user to type a message
  process.stdout.write('> ');
});

//Listen for event message from the server
socket.on('message', (text) => {
  // Erase last line > prompt
  // erases the current line in the console and rewrites something
  process.stdout.write('\r\x1b[K');
  // log out text of message
  console.log(text);
  //console log out arrow without doing a new line
  process.stdout.write('> ');
});

//Prompt user to enter a message
rl.prompt();

// When user inputs text, fire readline 'line' event which emits the message with socket.io
rl.on('line', (text) => {
  // send the user message to the socket server
  socket.emit('message', text.trim());
  //console log out arrow without doing a new line
  process.stdout.write('> ');
  // then prompt user again
  rl.prompt();
});

