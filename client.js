// socket.io client
// Import socket.io client module
const io = require('socket.io-client');
// pass url of our server
const socket = io('http://localhost:3000');
// import readline to read from console
const inquirer = require('inquirer');
// import chalk to work with terminal styling
// import chalk from 'chalk';
const chalk = require('chalk');
// create an interface to get input from the terminal console
async function messagePrompt() {
  return inquirer
    .prompt({
      type: 'input',
      message: '>',
      name: 'message',
    })
    .then(async ({ message }) => {
      await checkInput(message);
      messagePrompt();
    });
}

function handleEmoticon(prompt) {
  return prompt.then((answer) => {
    if (answer.operation === 'print') {
      socket.emit('getList', 'Emoticon');
    } else if (answer.operation === 'create') {
      const emoticon = {};

      return inquirer
        .prompt({
          type: 'input',
          message: 'Name your Emoticon!',
          name: 'name',
        })
        .then((answer) => {
          emoticon.name = answer.name;
          return inquirer
            .prompt({
              type: 'input',
              message: 'Create your Emoticon!',
              name: 'string',
            })
            .then((answer) => {
              emoticon.string = answer.string;
              socket.emit('create', ['Emoticon', emoticon]);
            });
        });
    }
  });
}

function promptOperation() {
  return inquirer.prompt({
    type: 'list',
    message: 'Which operation would you like to choose?',
    name: 'operation',
    choices: ['print', 'create'],
  });
}

async function checkInput(text) {
  if (text.charAt(0) === '/') {
    switch (text) {
      case '/emoticon':
        const prompt = promptOperation();
        await handleEmoticon(prompt);
        break;
      case '/commands':
        console.log(
          chalk.rgb(192, 159, 209)('/emoticon - Print or Create Emoticon ART')
        );
    }
  } else {
    // send the user message to the socket server
    if (text.trim().length) socket.emit('server:message', text.trim());
  }
}

// Get the users name
inquirer
  .prompt({
    type: 'input',
    message: chalk.green('Enter your username: '),
    name: 'username',
  })
  .then(({ username }) => {
    socket.emit('new user', username.trim());
    //let the user know they joined
    console.log(chalk.bold.bgGreen('You joined the chat'));
    console.log(
      chalk.rgb(255, 136, 0).bold('Type /commands for a list of commands')
    ); // TODO: LIST AVAIL COMMANDS SELECT-LINE
    console.log(
      chalk.bold.black.bgWhite('Here is a list of the Chat History: ')
    );
    //prompt user to type a message
    messagePrompt();
  })
  .catch(console.error);

//Listen for event message from the server
socket.on('client:message', (text) => {
  // Erase last line > prompt
  // erases the current line in the console and rewrites something
  process.stdout.write('\r\x1b[K');
  // log out text of message
  if (text.length) console.log(text);
  //console log out arrow without doing a new line
  process.stdout.write('> ');
});

//Listen for emoticon names being sent from server
socket.on('selectList', async ([names, list]) => {
  const prompt = inquirer.prompt({
    type: 'list',
    message: 'Select Emoticon',
    name: 'select',
    choices: names,
  });

  await prompt
    .then((answer) => {
      const choice = list.find((entry) => {
        return answer.select === entry.name;
      });
      socket.emit('emitEmoticon', choice.string);
    })
    .catch((error) => console.log(error));
});
