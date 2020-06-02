console.log('Google Meet Helper');
(function() {
  Main();
  console.log('What is going on');
  function Main() {
    // Variables
    let container = null;
    let toggleButton = null;
    let settingsOverlay = null;
    let forceReflow = () => {};
    let lastStyles = [];
    let screenCaptureModeAllocations = new Map(); // participantID -> order index
    let screenCaptureModeLookup = new Map(); // `${name}|${presentation}|${dedupeID}` -> {id,active,order}
    let hiddenIDs = new Set();
    let ownID = null;
    let settings = {
      enabled: false,
      'show-settings-overlay': false,
      'show-only-video': false,
      'highlight-speaker': true,
      'include-own-video': true,
      'auto-enable': true,
      'screen-capture-mode': true,
      'bottom-toolbar': 'resize',
      'right-toolbar': 'resize',
      'own-video': 'native',
      presentation: 'never',
      names: 'native',
    };

    const authorized = true;
    const performDuplicateCheck = true;
    const version = '1.0.1';
    let firstRun = true;
    setInterval(() => {
      // 660
      if (window.default_MeetingsUi) {
        // 818
        let m;
        for (let [_k, v] of Object.entries(window.default_MeetingsUi)) {
          if (v && v.prototype) {
            for (let k of Object.keys(v.prototype)) {
              const p = Object.getOwnPropertyDescriptor(v.prototype, k);
              if (p && p.value && !v.prototype[k].__grid_ran) {
              }
            }
          } // 863
          // 864
          if (v && typeof v === 'function' && !v.__grid_ran) {
            m = /function\(a,b,c\){return!0===c\?/.exec(v.toString());
          }
        } // 889
        if (!window.default_MeetingsUi.__grid_ran) {
          // 890
        }
      } // 896
      // Auto-enable
      if (firstRun) {
        // 899  - && container && buttons
        firstRun = false;
      }
    }, 1000); // 903
  }
})();
