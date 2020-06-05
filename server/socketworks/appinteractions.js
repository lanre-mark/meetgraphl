const { commmunicationType } = require('./types');
const debug = require('debug')(
  `${process.env.APP_NAME}:applicationInteractions`
);

module.exports = (socketworks) => {
  socketworks.on('connection', (client) => {
    console.log(
      'applicationInteractions :: Drill Down on Clientele :: ',
      client.id
    );
    // console.log('interactions :: Drill Down on Clientele :: ', client.handshake.headers);
    broadcastJoinNotification(socketworks, client);
    broadcastConnectionCount(socketworks);
    client.on('disconnect', () => {
      broadcastConnectionCount(socketworks);
      broadcastDisconnect(socketworks);
    });
    client.on(commmunicationType.MESSAGE_TEXT, (message) => {
      debug(`Message received & broadcast: ${message}`);
      socketworks.emit(commmunicationType.MESSAGE_TEXT, message);
    });
    client.on('SEND_MESSAGE', (message) => {
      debug(`Message received & broadcast: ${message}`);
      //socketworks.emit(commmunicationType.MESSAGE_TEXT, message);
      console.log(`Just received ${message}`);
    });
  });
};

function broadcastDisconnect(socketworks) {
  debug('send disconnect message');
  socketworks.emit(commmunicationType.MESSAGE_TEXT, `has disconnected`);
}
function broadcastConnectionCount(socketworks) {
  socketworks.clients((error, clients) => {
    if (error) throw error;
    const currentlyConnected = `${clients.length} currently connected`;
    debug(currentlyConnected);
    socketworks.emit(commmunicationType.MESSAGE_TEXT, currentlyConnected);
  });
}

function broadcastJoinNotification(socketworks, client) {
  const joinNotification = `${client.id} has joined the room`;
  debug(joinNotification);
  socketworks.emit(commmunicationType.MESSAGE_TEXT, joinNotification);
}
