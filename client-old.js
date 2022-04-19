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
socket.on('client:message', (text) => {
  console.log('CLIENT MESSAGE');
  // console.log('RECEIVED MESSAGE', text);
  // Erase last line > prompt
  // erases the current line in the console and rewrites something
  // process.stdout.write('\r\x1b[K');
  // log out text of message
  if (text.length) console.log(text);
  //console log out arrow without doing a new line
  process.stdout.write('> ');
  rl.prompt();
});

//Listen for ascii names being sent from server
socket.on('selectList', async ([names, list]) => {
  console.log('CLIENT SELECT LIST');
  // erases the current line in the console and rewrites something
  // process.stdout.write('\r\x1b[K');
  rl.close();
  const prompt = inquirer
    .prompt({
      type: 'list',
      message: 'Select ASCII',
      name: 'select',
      choices: names,
    });

  await prompt.then((answer) => {
    // socket.emit('', )
    const choice = list.find((entry) => {
      return answer.select === entry.name;
    });
    // console.log(choice.string);
    socket.emit('emitAscii', choice.string);
  })
    .catch((error) => console.log(error));

  // console log out arrow without doing a new line
  process.stdout.write('> ');
  console.log('LINE 81 CLIENT');
  prompt.ui.rl.close();
  rl.prompt();
});

//Prompt user to enter a message
rl.prompt();

// When user inputs text, fire readline 'line' event which emits the message with socket.io
rl.on('line', async (text) => {
  console.log('READLINE LINE 90');
  if (text.charAt(0) === '/') {
    rl.close();
    const prompt = inquirer
      .prompt({
        type: 'list',
        message: 'Which operation would you like to choose?',
        name: 'operation',
        choices: ['print', 'create'],
      });

    switch (text) {
      case '/ascii':
        await prompt
          .then((answer) => {
            if (answer.operation === 'print') {
              console.log('ANSWER EMITS TO SERVER?');
              socket.emit('getList', 'ASCII');
            } else if (answer.operation === 'create') {
              const ascii = {};
              return inquirer
                .prompt({
                  type: 'input',
                  message: 'Name your ASCII!',
                  name: 'name',
                })
                .then((answer) => {
                  ascii.name = answer.name;
                  return inquirer
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
    prompt.ui.rl.close();
  } else {
    // send the user message to the socket server
    if (text.trim().length) socket.emit('server:message', text.trim());
  }
  process.stdout.write('> ');
  // then prompt user agai
  rl.prompt();
});
