/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import {
  initiateBrowserCall,
  mutateConnState,
  // lclMeetDict,
  communicationType,
  participantSocket,
} from '../msg-comm/communicate';
import io from 'socket.io-client';

const socket = io('https://meetgrapheek.glitch.me');

initiateBrowserCall();

socket.on('connect', async (client) => {
  mutateConnState(true);
});

socket.on('disconnect', async () => {
  console.log('Disconnected from the Socket Now');
  mutateConnState(false);
  // connectionStatus = messagePayloads.DISCONNECTED;
  // const packet = {
  //   type: messageTypes.CONNECTION_CHANGE,
  //   payload: connectionStatus,
  // };
  // try {
  //   // await sendChromeMessage(packet);
  // } catch (err) {}
});

function dispatchToServer(message) {
  socket.emit('SEND_MESSAGE', message);
}

function dispatchParticipants(message) {
  socket.emit(message.messageType, message.payload);
}

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // console.log('Background sender browser.runtime.onMessage :: ', request);
  const { payload } = request;
  switch (request.messageType) {
    case communicationType.SETUP_COMM:
      console.log('Now we have been connected');
      if (payload && payload['cnf-event-id']) {
        socket.on(
          payload['cnf-event-id'].split('spaces/')[1],
          async (payload) => {
            console.log(
              `Received Meeting/Participant Payload as thus ::`,
              payload
            );
          }
        );
      }
      sendResponse({});
      break;
    case communicationType.ALL_DISCOVERED:
      if (Array.isArray(payload)) {
        const idDetails = payload
          .filter((p) => p.isLocal === true)[0]
          .id.split('/');
        if (!participantSocket(`${idDetails[1]}_${idDetails[3]}`)) {
          console.log(`Listenening on ${idDetails[1]}_${idDetails[3]}`);
          socket.on(`${idDetails[1]}_${idDetails[3]}`, async (payload) => {
            console.log(
              `Received Meeting/Participant Payload as thus ::`,
              payload
            );
          });
        }
        dispatchParticipants(request);
      }
      sendResponse({});
      break;
    default:
      break;
  }
});
