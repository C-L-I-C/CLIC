// socket.io client
// Import socket.io client module
const io = require('socket.io-client');
// pass url of our server
const socket = io('http://localhost:3000');
// import readline to read from console
const readline = require('readline');
const inquirer = require('inquirer');
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
  console.log('Type /listcommands for a list of commands'); // TODO: LIST AVAIL COMMANDS SELECT-LINE
  // write a > in terminal to prompt user to type a message
  process.stdout.write('> ');
});

// TODO: FIX THIS?
// inquirer
//   .prompt({
//     type: 'input',
//     message: 'Enter your username: ',
//     name: 'username',
//   })
//   .then((answer) => {
//     socket.emit('new user', text.trim());
//     //let the user know they joined
//     console.log('You joined the chat');
//     console.log('Type /listcommands for a list of commands'); // TODO: LIST AVAIL COMMANDS SELECT-LINE
//     // write a > in terminal to prompt user to type a message
//     process.stdout.write('> ');
//   });

//Listen for event message from the server
socket.on('message', (text) => {
  // Erase last line > prompt
  // erases the current line in the console and rewrites something
  process.stdout.write('\r\x1b[K');
  // log out text of message
  if (text.length) console.log(text);
  //console log out arrow without doing a new line
  process.stdout.write('> ');
});

//Listen for ascii names being sent from server
socket.on('selectList', ([names, list]) => {
  // erases the current line in the console and rewrites something
  process.stdout.write('\r\x1b[K');
  inquirer
    .prompt({
      type: 'list',
      message: 'Select ASCII',
      name: 'select',
      choices: names,
    })
    .then((answer) => {
      // socket.emit('', )
      const choice = list.find((entry) => {
        return answer.select === entry.name;
      });
      console.log(choice.string);
      socket.emit('message', choice.string);
    })
    .catch((error) => console.log(error));

  // console log out arrow without doing a new line
  process.stdout.write('> ');
});

//Prompt user to enter a message
rl.prompt();

// When user inputs text, fire readline 'line' event which emits the message with socket.io
rl.on('line', async (text) => {
  if (text.charAt(0) === '/') {
    switch (text) {
      case '/ascii':
        inquirer
          .prompt({
            type: 'list',
            message: 'Which operation would you like to choose?',
            name: 'operation',
            choices: ['print', 'create'],
          })
          .then((answer) => {
            if (answer.operation === 'print') {
              socket.emit('getList', 'ASCII');
            } else if (answer.operation === 'create') {
              const ascii = {};
              inquirer
                .prompt({
                  type: 'input',
                  message: 'Name your ASCII!',
                  name: 'name',
                })
                .then((answer) => {
                  ascii.name = answer.name;
                  inquirer
                    .prompt({
                      type: 'input',
                      message: 'Create your ASCII!',
                      name: 'string',
                    })
                    .then((answer) => {
                      ascii.string = answer.string;
                      // console.log('Did it work?', ascii);
                      socket.emit('create', ['ASCII', ascii]);
                    });
                });
            }
          });
    }
  } else {
    // send the user message to the socket server
    socket.emit('message', text.trim());
  }
  process.stdout.write('> ');
  // then prompt user again
  // rl.prompt();
});
