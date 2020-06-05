import * as actionTypes from './types/actionTypes';

export const receivedParticipantsData = (payload) => {
  return {
    type: actionTypes.PARTICIPANT_DATA,
    payload,
  };
};

export const initialiseActionState = (params) => async (dispatch) => {
  browser.runtime.onMessage.addListener(function(
    request,
    sender,
    sendResponse
  ) {
    console.log(
      'Content Script request browser.runtime.onMessage :: ',
      request
    );
    console.log('Content Script sender browser.runtime.onMessage :: ', sender);
    console.log(
      'Content Script sendResponse browser.runtime.onMessage :: ',
      sendResponse
    );
    switch (request.type) {
      case actionTypes.communicationType.PARTICIPANT_PAYLOAD:
        // dispatch(connectionChanged(request.payload));
        break;
      case actionTypes.communicationType.ALL_DISCOVERED:
        // dispatch(textMessageReceived(request.payload));
        break;
      default:
        break;
    }
    sendResponse({ ping: 'pong' });
  });
};
