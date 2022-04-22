# C.L.I.C - Command Line Chatroom

C.L.I.C. is a colorful, multi-functional terminal-based chatroom app that allows multiple users to message in real-time, see chat history, create fun emoticons, fetch inspiring quotes, fetch dad jokes, turn messages to binary and back, turn messages to pig-latin, all using back-end technologies and a terminal command line interface.

Link to client npm package:
https://www.npmjs.com/package/@csjknapp/clic-client


### Libraries

Node.js | Socket.IO | Inquirer.js | Chalk | cFonts | Express | Supertest

### Group Members
[Ryan](https://github.com/ryanflitcroft) | [Clayton](https://github.com/clayton-knapp) | [Denzel](https://github.com/xDenzelB) | [Alice](https://github.com/alicehsing)

### Instructions
To use CLIC, install the package with following terminal command: 
npm i @csjknapp/clic-client
and then run the package with the following command:
npx @csjknapp/clic-client

Follow the command line instructions to start playing and chatting in your terminal!

### Available /Commands

/emoticons - View a list of Emoticons or create your own fun Emoticons!

/history - View past chat history to pick up where you have left off.

/encode - Convert you message to binary code.

/decode - Translate your binary code to message.

/quote - Fetch daily inspirational quote to sparkle ✨ your day!

/dad - Fetch and display a random dad joke.

/piglatin - Translate your message to Pig Latin 🐷 .

/about - Our team is what really makes us tick. Meet the brains behind CLIC!

/signout - Sign out of chatroom.

### Routes (For Admin Use Only)

#### GET

The following are descriptions of the data that should be returned from the various `GET` methods.

##### `GET /user`

```
[{ id, username, email }]
```

##### `GET /user/:id`

```
{ id, email, username }
```

##### `GET /message/`

```
{ id, username, userId, message, createdAt}
```

##### `GET /message/:id`

```
{ id, username, userId, message, createdAt}
```

##### `GET /emoticon`

```
{ id, name, string}
```

##### `GET /emoticon/:name`

```
{ id, name, string}
```

#### PATCH

The following are descriptions of the data that should be returned from the various `PATCH` methods.

##### `PATCH /message/:id`

- PATCH: username, message can be updated by id

##### `PATCH /emoticon/:name`

- PATCH: name, string can be updated by name

#### DELETE

The following are descriptions of the data that should be returned from the various `DELETE` methods.

##### `DELETE /message/:id`

Admin can delete an instance of message by id

##### `DELETE /emoticon/:name`

Admin can delete an instance of Emoticon by name

#### POST

##### `POST /`

- POST: Admin can insert an instance of admin with email and password

##### `POST /session`

- POST: Sign in an existing Admin with an email and password.
