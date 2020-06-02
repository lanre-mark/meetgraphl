#!/usr/bin/env node

/**
 * Above line is the shabang command (#!) to instruct the linux shell environment
 * in which this project is running to use node to execute all the commands
 * and this file will not be executed as a bash script.
 * For instance, when you write a JS file and want to run it manually from the
 * command line you often use node "FILENAME.JS"
 * Becos we are running this program/file automatically, node will be used to
 * execute the file. So the above command goes into all the linux shell environment
 * locates/finds node and uses it to execute this file
 * https://frontendmasters.com/courses/digging-into-node/setting-up-a-command-line-script/
 */

/**
 *   The www file is the entry point of this project. This is file creates the Node.js server
 *   using hte http module in node.
 *   It setups up debugging and loads the entire app using the server.js as the nucleus/proxy
 *   Declares the port in which the server runs and add an error listerner on the routes
 */

/**
 * Module dependencies.
 */

var app = require('../server');
const grafikParticipants = require('../socketworks/manageparticipants');
const grafikInteractions = require('../socketworks/appinteractions');
var debug = require('debug')(`${process.env.APP_NAME}:server`);
var http = require('http');

var port = normalizePort(4815);
app.set('port', port);

var server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Initiating socket.io workers
 */
grafikParticipants();
grafikInteractions();

/**
 * Normalize a port into a number, string, or false.
 */
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

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
