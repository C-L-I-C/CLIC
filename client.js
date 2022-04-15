// socket.io client

// Import socket.io client module
const io = require('socket.io-client');

// pass url of our server
const socket = io('http://localhost:3000');

// import readline to read from console
const readline = require('readline');

inquirer.registerPrompt('selectLine', require('inquirer-select-line'));

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
  console.log('Type /listcommands for a list of commands');
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

//Listen for ascii names being sent from server
socket.on('listascii', (name) => {
  // erases the current line in the console and rewrites something
  process.stdout.write('\r\x1b[K');

  console.log(name);

  // console log out arrow without doing a new line
  process.stdout.write('> ');
});

// Listen for printascii sent from server
socket.on('printascii', (string) => {
  // erases the current line in the console and rewrites something
  process.stdout.write('\r\x1b[K');

  console.log(string);

  // console log out arrow without doing a new line
  process.stdout.write('> ');
});

//Prompt user to enter a message
rl.prompt();

// When user inputs text, fire readline 'line' event which emits the message with socket.io
rl.on('line', async (text) => {
  if (text === '/listcommands') {
    console.log(
      'SLASH COMMANDS AVAILABLE:\n/listascii -> lists available ascii art names \n/printascii -> prompts for ascii art name and prints to terminal'
    );
  } else if (text === '/listascii') {
    //we need to fetch all the rows from db and map through and console log names
    socket.emit('listascii');
  } else if (text === '/printascii') {
    console.log('Enter the name of the ASCII art you would like to print');
    // //prompts user to enter a new lne
    rl.question(
      'Enter the name of the ASCII art you would like to print',
      (name) => {
        //when entered emits as an printascii event and the name
        socket.emit('printascii', name);
      }
    );
  } else if (text === '/deleteascii') {
    //

    inquirer.prompt({
      type: 'selectLine',
      message: 'Which ascii would you like to delete?',
      name: 'delete',
    });
  }

  // socket.emit('message', `null`);
  else {
    // send the user message to the socket server
    socket.emit('message', text.trim());
  }

  //console log out arrow without doing a new line
  process.stdout.write('> ');
  // then prompt user again
  rl.prompt();
});
