const { messageTypes } = require('./types');
const socketworks = require('./node');
const debug = require('debug')(
  `${process.env.APP_NAME}:applicationInteractions`
);

module.exports = () => {
  socketworks.on('connection', (client) => {
    console.log('interactions :: Drill Down on Clientele :: ', client);
    broadcastJoinNotification(client);
    broadcastConnectionCount();
    client.on('disconnect', () => {
      broadcastConnectionCount();
      broadcastDisconnect();
    });
  });
};

function broadcastDisconnect() {
  debug('send disconnect message');
  socketworks.emit(messageTypes.MESSAGE_TEXT, `has disconnected`);
}
function broadcastConnectionCount() {
  socketworks.clients((error, clients) => {
    if (error) throw error;
    const currentlyConnected = `${clients.length} currently connected`;
    debug(currentlyConnected);
    socketworks.emit(messageTypes.MESSAGE_TEXT, currentlyConnected);
  });
}

function broadcastJoinNotification(client) {
  const joinNotification = `${client.id} has joined the room`;
  debug(joinNotification);
  socketworks.emit(messageTypes.MESSAGE_TEXT, joinNotification);
}
