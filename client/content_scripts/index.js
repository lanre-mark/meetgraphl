/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

if (typeof commMessage === 'undefined') var commMessage = false;
if (typeof lclMeetDict === 'undefined') var lclMeetDict = {};

window.addEventListener('message', (event) => {
  // console.log('addEventListener event.source :: ', event.source);
  // console.log('addEventListener window :: ', window);
  // if (event.source !== window) return; // Only accept messages from ourselves
  // console.log('addEventListener event :: ', event);
  // console.log('addEventListener window :: ', window);
  // const thisObject = event.currentTarget.document.scripts;
  // if (thisObject) {
  //   console.log(thisObject);
  // } else {
  //   console.log('No Scripts here');
  // }
  if (event && event.currentTarget && event.currentTarget.document) {
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
