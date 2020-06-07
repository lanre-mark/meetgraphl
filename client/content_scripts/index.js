/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import {
  lclMeetDict,
  dispatchToBackground,
  communicationType,
} from '../msg-comm/communicate';

// browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   console.log('Content Script request browser.runtime.onMessage :: ', request);
//   console.log('Content Script sender browser.runtime.onMessage :: ', sender);
//   console.log(
//     'Content Script sendResponse browser.runtime.onMessage :: ',
//     sendResponse
//   );
//   switch (request.type) {
//     // case
//     // default:
//     case 'CONNECTION_CHANGE':
//       console.log('Connection juts changed');
//       break;
//     default:
//       console.log('Cannot do anything');
//       break;
//   }
// });

window.addEventListener('message', (event) => {
  if (event.source !== window) return; // Only accept messages from ourselves
  if (event && event.data && typeof event.data === 'object') {
    if (event.data.sender !== 'meetgraphík') return;
    // TODO : Consider a diffing algorithm here
    try {
      dispatchToBackground(event.data.messageType, event.data.payload);
      addtodict('participants', event.data.payload);
    } catch (err) {
      console.error(err);
    }
  } else if (event && event.currentTarget && event.currentTarget.document) {
    // can start this meet
    const thisObject = event.currentTarget.document;
    if (thisObject.images) {
      if (thisObject.images.length) {
        addtodict(
          'imageKey',
          thisObject.images[thisObject.images.length - 1]
            ? thisObject.images[thisObject.images.length - 1].src
            : null
        );
      }
    }
    const dataObject = event.currentTarget;
    if (dataObject) {
      if (dataObject.localStorage) {
        for (let lstre of Object.keys(dataObject.localStorage)) {
          if (lstre !== 'scp') {
            const lcl = JSON.parse(dataObject.localStorage[lstre]);
            try {
              addtodict(
                'cnf-event-id',
                lcl && lcl[1] && lcl[1].length >= 14 ? lcl[1][13] : null
              );
            } catch (e) {
              addtodict('cnf-event-id', null);
              console.error(
                '[google-meet-graphík] Error in function that returns google-meet id and google-meet conference event id',
                e
              );
            }
            try {
              addtodict(
                'meet-id',
                lcl && lcl[1] && lcl[1].length >= 14 ? lcl[1][12] : null
              );
            } catch (e) {
              addtodict('meet-id', null);
              console.error(
                '[google-meet-graphík] Error in function that returns google-meet id and google-meet conference event id',
                e
              );
            }
            try {
              dispatchToBackground(communicationType.SETUP_COMM, lclMeetDict);
            } catch (err) {
              console.error(err);
            }
          }
        }
      }
    }
  }
});

function addtodict(k, v) {
  Object.assign(lclMeetDict, { [k]: v });
}

// Add our user script
const s = document.createElement('script');
s.setAttribute('data-version', browser.runtime.getManifest().version);
s.src = browser.extension.getURL('lib/js/init-meet.js');
document.body.appendChild(s);
