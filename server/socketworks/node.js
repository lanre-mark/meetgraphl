const app = require('../server');
require('dotenv').config({
  path: __dirname + '../.env',
});
const debug = require('debug')(`${process.env.APP_NAME}:socket`);

const socketserver = require('http').Server(app);

const port = normalizePort(process.env.PORT);

const socketworks = require('socket.io')(socketserver, {
  // Prioritise websocket first.
  transports: ['websocket', 'polling'],
});

socketserver.listen(port, function() {
  console.log('Express server listening on port ' + port);
});

debug('Start socket.io server and listening');
module.exports = socketworks;

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
