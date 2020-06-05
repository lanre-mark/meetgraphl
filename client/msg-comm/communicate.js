/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */

if (typeof commMessage === 'undefined') var commMessage = false;
if (typeof lclMeetDict === 'undefined') var lclMeetDict = {};
if (typeof deliverMsg === 'undefined') var deliverMsg = false;

const communicationType = {
  ALL_DISCOVERED: 'ALL_DISCOVERED',
  PARTICIPANT_PAYLOAD: 'PARTICIPANT_PAYLOAD',
  SETUP_COMM: 'SETUP_COMM',
};

const initiateBrowserCall = () => {
  browser.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
      deliverMsg = true;
    }
  });
};

const sendBrowserMessage = (payload) => {
  // return new Promise((resolve, reject) => {
  if (deliverMsg) {
    browser.tabs.query({ active: true }).then(function(tabs) {
      browser.tabs.sendMessage(tabs[0].id, { message: payload });
      // resolve();
    });
  }
  // });
};

const dispatchToBackground = (messageType, payload) => {
  browser.runtime.sendMessage({ messageType: messageType, payload: payload });
  // .then((response) => {
  // console.log(`Here is the repsonse from background ${response}`);
  // });
};

const mutateConnState = (state) => {
  commMessage = state;
};

const participantSocket = (skt) => {
  return !lclMeetDict[skt]
    ? (function() {
        lclMeetDict[skt] = true;
        return false;
      })()
    : lclMeetDict[skt];
};

export {
  lclMeetDict,
  sendBrowserMessage,
  initiateBrowserCall,
  commMessage,
  mutateConnState,
  dispatchToBackground,
  communicationType,
  participantSocket,
};
