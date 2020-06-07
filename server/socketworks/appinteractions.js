const requestIp = require('request-ip');
const useragent = require('express-useragent');
const { communicationType } = require('./types');
const { resolveip } = require('../utility');
const debug = require('debug')(
  `${process.env.APP_NAME}:applicationInteractions`
);
const models = require('../models');
const controller = require('../controllers')(models);

module.exports = (socketworks) => {
  socketworks.on('connection', (client) => {
    client.on('disconnect', () => {
      broadcastConnectionCount(socketworks);
      broadcastDisconnect(socketworks);
    });
    client.on(communicationType.ALL_DISCOVERED, (message) => {
      debug(`Applicants received & broadcast: ${message}`);
      //socketworks.emit(communicationType.MESSAGE_TEXT, message);
      console.log(`Applicants received :: ${message}`);
    });
  });
};

function broadcastDisconnect(socketworks) {
  debug('send disconnect message');
  socketworks.emit(communicationType.MESSAGE_TEXT, `has disconnected`);
}
function broadcastConnectionCount(socketworks) {
  socketworks.clients((error, clients) => {
    if (error) throw error;
    const currentlyConnected = `${clients.length} currently connected`;
    debug(currentlyConnected);
    socketworks.emit(communicationType.MESSAGE_TEXT, currentlyConnected);
  });
}

function broadcastJoinNotification(socketworks, client) {
  const joinNotification = `${client.id} has joined the room`;
  debug(joinNotification);
  socketworks.emit(communicationType.MESSAGE_TEXT, joinNotification);
}
