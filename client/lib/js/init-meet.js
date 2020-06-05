// Initialise all the hooks we need for google meet.
(function() {
  setUpConferenceHooks();
  // fetch participant data
  function getConferenceParticipantsData(inputObject) {
    // magic functions
    const isSpacesStr = (i) => typeof i === 'string' && i.startsWith('spaces/');
    const isHost = (...bools) =>
      bools.every((b) => b === false) ||
      (bools[0] === false && bools.slice(1).every((b) => b === true));
    const isLocal = (...bools) =>
      bools.every((b) => b === true) ||
      (bools[0] === false && bools.slice(1).every((b) => b === true));

    // Finds the listing of map keys, and the object that contains it
    let conferenceKeys, conferenceObject;
    for (let confObj of Object.values(inputObject)) {
      if (confObj && typeof confObj === 'object') {
        for (let confObjValues of Object.values(confObj)) {
          if (
            Array.isArray(confObjValues) &&
            confObjValues.length &&
            confObjValues.every(isSpacesStr)
          ) {
            if (conferenceKeys && confObjValues != conferenceKeys) {
              throw new Error('Failed');
            } else {
              conferenceKeys = confObjValues;
              conferenceObject = confObj;
            }
          }
        }
      }
    }
    if (!conferenceObject) {
      // You're the only participant on the call.
      return;
    }
    let gMeetMap;
    for (let mItm of Object.values(conferenceObject)) {
      if (
        mItm instanceof Map &&
        mItm.size &&
        Array.from(mItm.keys()).every(isSpacesStr)
      ) {
        gMeetMap = mItm;
      }
    }
    const meetParticipants = Array.from(gMeetMap.values()).map((prt) => ({
      instance: prt.constructor.name,
      name: prt.name,
      avatar: prt.avatarUrl,
      isHost: isHost(prt.U_, prt.Ve, prt.Yo, prt.oe),
      isLocal: prt.oe,
      id: prt.id,
    }));
    // .reduce(
    //   (participants, eachParticipant) =>
    //     participants.filter((prt) => prt.id === eachParticipant.id).length > 0
    //       ? participants
    //       : participants.concat(eachParticipant),
    //   []
    // );
    window.postMessage({
      sender: 'meetgraphík',
      messageType: 'ALL_DISCOVERED',
      payload: meetParticipants,
    });
  }

  function MeetingsUIProxyHandler() {
    return {
      set: function(obj, prop, value) {
        if (value && typeof value === 'function') {
          const m = /\.([A-Za-z]+)\([a-zA-Z,.]+\{[^\x05]*?Infinity[^\x05]*?this\.([A-Za-z]+)=[A-Za-z]+\(this\)/.exec(
            value.toString()
          );
          if (m) {
            value = new Proxy(value, RefreshVideoProxyHandler(m[2], m[1]));
          }
        }
        return Reflect.set(obj, prop, value);
      },
    };
  }
  function RefreshVideoProxyHandler(objKey, funcKey) {
    return {
      construct: function(target, argumentsList) {
        const ret = Reflect.construct(target, argumentsList);
        ret[objKey] = new Proxy(
          ret[objKey],
          LayoutVideoProxyHandler(ret, funcKey)
        );
        return ret;
      },
    };
  }

  // This overrides the Map that returns which layout to use, as called by the above Proxy
  // If grid view is enabled we always try to call our custom layout function.
  // If our layout function errors, or grid view is disabled, we return the actual function.
  function LayoutVideoProxyHandler(parent, funcKey) {
    return {
      get: function(target, name) {
        let ret = Reflect.get(target, name);
        if (typeof ret === 'function') {
          ret = ret.bind(target);
        }

        if (name == 'get') {
          return (idx) => ({
            [funcKey]: (videoOrdering, windowData) => {
              try {
                getConferenceParticipantsData(parent);
              } catch (e) {
                console.error(
                  '[google-meet-graphík] Error in function that fetches conference participants` data',
                  e
                );
              }

              return ret(idx)[funcKey](videoOrdering, windowData);
            },
          });
        }

        return ret;
      },
    };
  }

  function setUpConferenceHooks() {
    setInterval(() => {
      if (window.default_MeetingsUi) {
        if (!window.default_MeetingsUi.__conference_gotten) {
          const p = new Proxy(
            window.default_MeetingsUi,
            MeetingsUIProxyHandler()
          );
          p.__conference_gotten = true;
          window.default_MeetingsUi = p;
        }
      }
    }, 1000);
  }
})();
