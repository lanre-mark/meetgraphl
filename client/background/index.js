/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

console.log('Background.js file loaded');

import io from 'socket.io-client';

const socket = io('https://meetgrapheek.glitch.me');

/* const defaultUninstallURL = () => {
  return process.env.NODE_ENV === 'production'
    ? 'https://wwww.github.com/kryptokinght'
    : '';
}; */

socket.on('connect', async () => {
  console.log('Connected to the Socket Now');
  // connectionStatus = messagePayloads.CONNECTED;
  // const packet = {
  //   type: messageTypes.CONNECTION_CHANGE,
  //   payload: connectionStatus,
  // };
  try {
    // await sendChromeMessage(packet);
  } catch (err) {}
});

socket.on('disconnect', async () => {
  console.log('Disconnected from the Socket Now');
  // connectionStatus = messagePayloads.DISCONNECTED;
  // const packet = {
  //   type: messageTypes.CONNECTION_CHANGE,
  //   payload: connectionStatus,
  // };
  try {
    // await sendChromeMessage(packet);
  } catch (err) {}
});

function dispatchToServer(message) {
  console.log('Dispatching message to the Server');
  socket.emit('messageTypes.SEND_MESSAGE', message);
}

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('request :: ', request);
  console.log('sender :: ', sender);
  console.log('sendResponse :: ', sendResponse);
  switch (
    request.type
    // case
    // default:
  ) {
  }
});

browser.webNavigation.onCompleted.addListener(function(navigationEvent) {
  let tabId = navigationEvent.tabId;
  console.log('navigationEvent :: ', tabId);
});
