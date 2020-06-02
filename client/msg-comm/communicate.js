export default (payload) => {
  console.log('Sending chromeMessage: ', payload);
  return new Promise((resolve, reject) => {
    browser.runtime.sendMessage(payload, function(response) {
      //eslint-disable-line no-undef
      if (response) {
        resolve(response);
      } else {
        reject('browserAction not open');
      }
    });
  });
};
