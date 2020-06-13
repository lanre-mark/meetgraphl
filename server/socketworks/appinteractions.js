const requestIp = require('request-ip');
const userparser = require('ua-parser-js');
const { communicationType } = require('./types');
const { resolveip } = require('../utility');
const debug = require('debug')(
  `${process.env.APP_NAME}:applicationInteractions`
);
const models = require('../models');
const controller = require('../controllers')(models);

module.exports = (socketworks) => {
  socketworks.on('connection', (client) => {
    // console.log('applicationInteractions :: Drill Down on Clientele :: ', client.id);
    client.on('disconnect', () => {
      broadcastConnectionCount(socketworks);
      broadcastDisconnect(socketworks);
    });

    client.on(communicationType.ALL_DISCOVERED, async (message) => {
      debug(`Applicants received & broadcast: ${message}`);
      //socketworks.emit(communicationType.MESSAGE_TEXT, message);
      console.log(`Applicants received :: ${message}`);

      const clientIp = await requestIp.getClientIp(client.handshake);
      const participantPayload = await controller.addConferenceInfo(
        message,
        clientIp,
        await models.IpLocation.ipAddressResolve(clientIp), //await resolveip(clientIp),
        await userparser(client.handshake.headers['user-agent'])
      );
      if (
        participantPayload &&
        participantPayload['conn-id'] &&
        participantPayload.participants &&
        participantPayload.participants.length > 0
      ) {
        broadcastParticipantPayload(
          socketworks,
          participantPayload['conn-id'],
          participantPayload.participants
        );
      }

      // console.log(`Trying for the IP using library :: ${clientIp}`);
      // const rspcoordgeo = await resolveip(clientIp);
      // console.log(rspcoordgeo);
      // console.log(`Request Headers :: ${client.handshake.headers['user-agent']}`)
      // const ua = await useragent.parse(client.handshake.headers['user-agent']);
      // console.log(`Obtaining User Information :: ${JSON.stringify(ua, null, '\t')}`);
    });
  });
};

function broadcastParticipantPayload(socketworks, connid, payload) {
  debug(`send pariticipant payload to ${connid}`);
  socketworks.emit(connid, payload);
}

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

function printClientDetails(ip, geo, ua, uaparse) {
  console.log(`=======================================`);
  console.log(`Client IP using library :: ${ip}`);
  console.log(`=======================================`);
  console.log(`Client GeoCoordinates :: ${JSON.stringify(geo, null, '\t')}`);
  console.log(`=======================================`);
  console.log(`User Device Information :: ${JSON.stringify(ua, null, '\t')}`);
  console.log(`=======================================`);
  console.log(`User Device Details :: ${JSON.stringify(uaparse, null, '\t')}`);
}
