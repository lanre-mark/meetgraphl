const { messageTypes } = require('./types');
const debug = require('debug')(`${process.env.APP_NAME}:manageParticipants`);

module.exports = (socketworks) => {
  socketworks.on('connection', (client) => {
    //Receive from client broadcast to everyone - but this client.
    console.log('participants :: Drill Down on Clientele :: ', client);
    client.on(messageTypes.SEND_MESSAGE, (message) => {
      debug(`Message received & broadcast: ${message}`);
      socketworks.emit(messageTypes.MESSAGE_TEXT, message);
    });
  });
};
