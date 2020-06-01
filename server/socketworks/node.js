require('dotenv').config({
  path: __dirname + '../.env',
});
const debug = require('debug')(`${process.env.APP_NAME}:socket`);
const socketserver = require('http').createServer();

const socketworks = require('socket.io')(socketserver, {
  // Prioritise websocket first.
  transports: ['websocket', 'polling'],
});

debug('Start socket.io server and listening');
socketworks.listen(3000);
module.exports = socketworks;
