const { messageTypes } = require('./types');
const debug = require('debug')(
  `${process.env.APP_NAME}:applicationInteractions`
);

module.exports = (socketworks) => {
  socketworks.on('connection', (client) => {
    console.log('interactions :: Drill Down on Clientele :: ', client);
    broadcastJoinNotification(socketworks, client);
    broadcastConnectionCount(socketworks);
    client.on('disconnect', () => {
      broadcastConnectionCount(socketworks);
      broadcastDisconnect(socketworks);
    });
  });
};

function broadcastDisconnect(socketworks) {
  debug('send disconnect message');
  socketworks.emit(messageTypes.MESSAGE_TEXT, `has disconnected`);
}
function broadcastConnectionCount(socketworks) {
  socketworks.clients((error, clients) => {
    if (error) throw error;
    const currentlyConnected = `${clients.length} currently connected`;
    debug(currentlyConnected);
    socketworks.emit(messageTypes.MESSAGE_TEXT, currentlyConnected);
  });
}

function broadcastJoinNotification(socketworks, client) {
  const joinNotification = `${client.id} has joined the room`;
  debug(joinNotification);
  socketworks.emit(messageTypes.MESSAGE_TEXT, joinNotification);
}
