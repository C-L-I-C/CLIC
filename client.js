const io = require('socket.io-client');
const socket = io('https://cli-c.herokuapp.com/');
const inquirer = require('inquirer');
const chalk = require('chalk');
const CFonts = require('cfonts');

const {
  stringToBinary,
  binaryToString,
  stringToPigLatin,
} = require('./lib/utils/command-functions');


const chalkBackgroundColors = [
  chalk.bgCyan,
  chalk.bgBlue,
  chalk.bgRed,
  chalk.bgYellow,
];

const randomBackgroundColor =
  chalkBackgroundColors[Math.floor(Math.random() * chalkBackgroundColors.length)];

const chalkTextColors = [
  chalk.redBright,
  chalk.yellowBright,
  chalk.greenBright,
  chalk.blueBright,
  chalk.whiteBright,
  chalk.magentaBright,
  chalk.cyanBright,
];

CFonts.say('C.L.I.C', {
  font: 'slick',
  align: 'left',
  colors: 'red',
  background: 'transparent',
  letterSpacing: 2,
  lineHeight: 1,
  space: true,
  maxLength: '0',
  gradient: 'red,blue',
  independentGradient: false,
  transitionGradient: false,
  env: 'node',
});

CFonts.say('The No.1|CLI Chat App', {
  font: 'chrome',
  align: 'left',
  colors: 'magenta',
  background: 'transparent',
  letterSpacing: 1,
  lineHeight: 1,
  space: true,
  maxLength: '60',
  gradient: false,
  independentGradient: false,
  transitionGradient: false,
  env: 'node',
});

inquirer
  .prompt({
    type: 'input',
    message: chalk.green('Enter your username: '),
    name: 'username',
  })
  .then(({ username }) => {
    socket.emit('new user', username.trim());
    console.log(chalk.bold.magentaBright('You joined the chat'));
    console.log(chalk.rgb(255, 136, 0).bold('Type /commands for a list of commands'));
    messagePrompt();
  })
  .catch(console.error);


function randomTextColor() {
  return chalkTextColors[Math.floor(Math.random() * chalkTextColors.length)];
}

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

function promptOperation() {
  return inquirer.prompt({
    type: 'list',
    message: 'Which operation would you like to choose?',
    name: 'operation',
    choices: ['print', 'create'],
  });
}

function promptHistory() {
  return inquirer
    .prompt({
      type: 'list',
      message: 'How many recent chat messages would you like to peek at?',
      name: 'history',
      choices: ['5', '10', '15', '20'],
    })
    .then((answer) => {
      console.log(
        chalk.bold.rgb(224, 212, 153)('Here is a list of the Chat History: ')
      );
      socket.emit('getHistory', answer.history);
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

async function handleToBinary() {
  return inquirer
    .prompt({
      type: 'input',
      message: 'Convert your message to binary code',
      name: 'input',
    })
    .then((answer) => {
      const binary = stringToBinary(answer.input);
      socket.emit('server:message', binary);
    });
}

async function handleToString() {
  return inquirer
    .prompt({
      type: 'input',
      message: 'Translate your binary code',
      name: 'input',
    })
    .then((answer) => {
      const message = binaryToString(answer.input);
      socket.emit('server:message', message);
    });
}

async function handleToPigLatin() {
  return inquirer
    .prompt({
      type: 'input',
      message: 'Translate your message to Pig Latin',
      name: 'input',
    })
    .then((answer) => {
      const message = stringToPigLatin(answer.input);
      socket.emit('server:message', message);

    });
}

async function checkInput(text) {
  if (text.charAt(0) === '/') {
    switch (text) {
      case '/about':
        console.log(chalk.rgb(255, 136, 0).bold('About the developers!\n'));
        console.log(chalk.rgb(255, 192, 203)('Alice H. is a software dev living in Beaverton, OR.\nHer favorite emoticon: ღゝ◡╹)ノ♡'));
        console.log(chalk.rgb(175, 105, 240)('Clayton K. is a software dev living in Portland, OR.\nHis favorite emoticon: (づ￣ ³￣)づ'));
        console.log(chalk.rgb(255, 0, 0)('Denzel B. is a software dev living in Vancouver, WA.\nHis favorite emoticon: ( ͡❛ ͜ʖ ͡❛)'));
        console.log(chalk.rgb(0, 255, 0)('Ryan F. is a software dev living in Portland, OR.\nHis favorite emoticon: ≧◠‿◠≦✌\n'));
        break;
      case '/emoticon':
        await handleEmoticon(promptOperation());
        break;
      case '/commands':
        console.log(randomTextColor()('/about - See about the developers'));
        console.log(randomTextColor()('/history - View Chat History'));
        console.log(randomTextColor()('/emoticon - Print or Create Emoticon Art'));
        console.log(randomTextColor()('/quote - Get a random quote'));
        console.log(randomTextColor()('/dad - Get a random dad joke'));
        console.log(randomTextColor()('/encode - Encode and send a message in binary'));
        console.log(randomTextColor()('/decode - Decode a binary coded message'));
        console.log(randomTextColor()('/piglatin - Translate and send your message in pig latin'));
        console.log(randomTextColor()('/signout - Leave Chatroom'));
        break;
      case '/quote':
        socket.emit('getQuote');
        break;
      case '/dad':
        socket.emit('getJoke');
        break;
      case '/history':
        await promptHistory();
        break;
      case '/signout':
        socket.disconnect();
        break;
      case '/encode':
        await handleToBinary();
        break;
      case '/decode':
        await handleToString();
        break;
      case '/piglatin':
        await handleToPigLatin();
        break;
    }
  } else {
    if (text.trim().length) socket.emit('server:message', text.trim());
  }
}

socket.on('client:message', (text) => {
  process.stdout.write('\r\x1b[K');
  if (text.length) console.log(randomBackgroundColor(text));
  process.stdout.write('> ');
});

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

