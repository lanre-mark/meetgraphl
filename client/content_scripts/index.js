/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

window.addEventListener('message', (event) => {
  console.log('window addListener message :: ', event);
});

// Add our user script
const s = document.createElement('script');
s.setAttribute('data-version', browser.runtime.getManifest().version);
s.src = browser.extension.getURL('init-meet.js');
document.body.appendChild(s);
