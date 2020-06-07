const mongoose = require('mongoose');
const { getDistanceFromLatLonInKm } = require('../utility/geometry');

// IP Address
const ipadd1 = '105.112.55.239';
const ipadd2 = '161.149.146.201';
const ipadd3 = '83.104.251.43';
// GeoCordinate Search
const geo1 = {
  status: 'success',
  countryName: 'Nigeria',
  countryCode: 'NG',
  regionCode: 'LA',
  regionName: 'Lagos',
  cityName: 'Lagos',
  zipCode: '',
  latitide: 6.4474,
  longitude: 3.3903,
  timezone: 'Africa/Lagos',
  place: 'Lagos, Nigeria',
  location: '6.4474, 3.3903',
};
const geo2 = {
  status: 'success',
  countryName: 'United States',
  countryCode: 'US',
  regionCode: 'CA',
  regionName: 'California',
  cityName: 'Los Angeles',
  zipCode: '90012',
  latitide: 34.0531,
  longitude: -118.242,
  timezone: 'America/Los_Angeles',
  place: 'Los Angeles, California, United States',
  location: '34.0531, -118.242',
};

const geo3 = {
  status: 'success',
  countryName: 'United Kingdom',
  countryCode: 'GB',
  regionCode: 'ENG',
  regionName: 'England',
  cityName: 'Newent',
  zipCode: 'GL18',
  latitide: 51.9417,
  longitude: -2.4149,
  timezone: 'Europe/London',
  place: 'Newent, England, United Kingdom',
  location: '51.9417, -2.4149',
};
// Device Info
const deviceinfo1 = {
  isYaBrowser: false,
  isAuthoritative: true,
  isMobile: false,
  isTablet: false,
  isiPad: false,
  isiPod: false,
  isiPhone: false,
  isAndroid: false,
  isBlackberry: false,
  isOpera: false,
  isIE: false,
  isEdge: false,
  isIECompatibilityMode: false,
  isSafari: false,
  isFirefox: false,
  isWebkit: false,
  isChrome: true,
  isKonqueror: false,
  isOmniWeb: false,
  isSeaMonkey: false,
  isFlock: false,
  isAmaya: false,
  isPhantomJS: false,
  isEpiphany: false,
  isDesktop: true,
  isWindows: false,
  isLinux: false,
  isLinux64: false,
  isMac: true,
  isChromeOS: false,
  isBada: false,
  isSamsung: false,
  isRaspberry: false,
  isBot: false,
  isCurl: false,
  isAndroidTablet: false,
  isWinJs: false,
  isKindleFire: false,
  isSilk: false,
  isCaptive: false,
  isSmartTV: false,
  isUC: false,
  isFacebook: false,
  isAlamoFire: false,
  isElectron: false,
  silkAccelerated: false,
  browser: 'Chrome',
  version: '83.0.4103.61',
  os: 'OS X',
  platform: 'Apple Mac',
  geoIp: {},
  source:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
};

const deviceinfo2 = {
  isYaBrowser: false,
  isAuthoritative: true,
  isMobile: false,
  isTablet: false,
  isiPad: false,
  isiPod: false,
  isiPhone: false,
  isAndroid: false,
  isBlackberry: false,
  isOpera: false,
  isIE: false,
  isEdge: false,
  isIECompatibilityMode: false,
  isSafari: false,
  isFirefox: false,
  isWebkit: false,
  isChrome: true,
  isKonqueror: false,
  isOmniWeb: false,
  isSeaMonkey: false,
  isFlock: false,
  isAmaya: false,
  isPhantomJS: false,
  isEpiphany: false,
  isDesktop: true,
  isWindows: false,
  isLinux: false,
  isLinux64: false,
  isMac: true,
  isChromeOS: false,
  isBada: false,
  isSamsung: false,
  isRaspberry: false,
  isBot: false,
  isCurl: false,
  isAndroidTablet: false,
  isWinJs: false,
  isKindleFire: false,
  isSilk: false,
  isCaptive: false,
  isSmartTV: false,
  isUC: false,
  isFacebook: false,
  isAlamoFire: false,
  isElectron: false,
  silkAccelerated: false,
  browser: 'Chrome',
  version: '83.0.4103.61',
  os: 'OS X',
  platform: 'Apple Mac',
  geoIp: {},
  source:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
};

module.exports = ({ Conference }) => {
  return {
    addConferenceInfo: async function(
      participantsObject,
      ipaddress = ipadd1,
      geoCoords = geo1,
      deviceInfo = deviceinfo1
    ) {
      const operationData = parseParticipantToServerObject(participantsObject);
      const conferenceRoot = await Conference.find({
        conference_id: operationData.operate['conf-meet-id'],
      });
      let participants = operationData.operate.participants
        .slice()
        .reduce((db_row, participant) => {
          db_row.push({
            clientid: participant.id,
            participant_id: participant.participant_id,
            name: participant.name,
            avatar: participant.avatar,
            point: participant.point,
            geo: {},
            device: {},
            events: [{ date: Date.now, event: {} }],
          });
          if (participant.point) {
            db_row[db_row.length - 1] = {
              ...db_row[db_row.length - 1],
              ['network']: ipadd1, //ipaddress,
              ['geo']: geo1, //geoCoords,
              ['device']: deviceInfo,
            };
            // if (
            //   participant.name === 'olanrewaju Mark' ||
            //   participant.name === 'olanrewaju Markin'
            // ) {
            //   db_row[db_row.length - 1] = {
            //     ...db_row[db_row.length - 1],
            //     ['network']: ipadd1, //ipaddress,
            //     ['geo']: geo1, //geoCoords,
            //     ['device']: deviceInfo,
            //   };
            // } else if (participant.name === 'Fliptop Consulting') {
            //   db_row[db_row.length - 1] = {
            //     ...db_row[db_row.length - 1],
            //     ['network']: ipadd2, //ipaddress,
            //     ['geo']: geo2, //geoCoords,
            //     ['device']: deviceInfo,
            //   };
            // } else if (participant.name === 'Oluwatosin Makinde') {
            //   db_row[db_row.length - 1] = {
            //     ...db_row[db_row.length - 1],
            //     ['network']: ipadd3, //ipaddress,
            //     ['geo']: geo3, //geoCoords,
            //     ['device']: deviceInfo,
            //   };
            // }
            // // may need to get events as well as weather
            // //['events']: deviceInfo,
          }
          return db_row;
        }, []);
      if (conferenceRoot.length === 0) {
        await new Conference({
          conference_id: operationData.operate['conf-meet-id'],
          participants,
        }).save();
      } else {
        let updateConferenceData = async () => {
          try {
            for (let ii = 0; ii < participants.length; ii++) {
              // QUERY IDEA
              // https://stackoverflow.com/questions/41761660/mongodb-inc-and-setoninsert-for-nested-array
              // https://stackoverflow.com/questions/61234012/mongoose-update-array-or-add-to-the-array
              if (!participants[ii].point) {
                await Conference.findOneAndUpdate(
                  {
                    conference_id: operationData.operate['conf-meet-id'],
                  },
                  [
                    {
                      $set: {
                        participants: {
                          $cond: [
                            {
                              $gt: [
                                {
                                  $size: {
                                    $filter: {
                                      input: '$participants',
                                      cond: {
                                        $eq: [
                                          '$$this.avatar',
                                          participants[ii].avatar,
                                        ],
                                      },
                                    },
                                  },
                                },
                                0,
                              ],
                            },
                            {
                              $reduce: {
                                input: '$participants',
                                initialValue: [],
                                in: {
                                  $concatArrays: [
                                    '$$value',
                                    [
                                      {
                                        $cond: [
                                          {
                                            $eq: [
                                              '$$this.avatar',
                                              participants[ii].avatar,
                                            ],
                                          },
                                          {
                                            $mergeObjects: [
                                              '$$this',
                                              {
                                                clientid:
                                                  participants[ii].clientid,
                                              },
                                              {
                                                participant_id:
                                                  participants[ii]
                                                    .participant_id,
                                              },
                                              {
                                                name: participants[ii].name,
                                              },
                                              {
                                                avatar: participants[ii].avatar,
                                              },
                                            ],
                                          },
                                          '$$this',
                                        ],
                                      },
                                    ],
                                  ],
                                },
                              },
                            },
                            {
                              $concatArrays: [
                                '$participants',
                                [participants[ii]],
                              ],
                            },
                          ],
                        },
                      },
                    },
                  ],
                  { new: true }
                );
              } else {
                // console.log('updating/inserting');
                await Conference.findOneAndUpdate(
                  {
                    conference_id: operationData.operate['conf-meet-id'],
                  },
                  [
                    {
                      $set: {
                        participants: {
                          $cond: [
                            {
                              $gt: [
                                {
                                  $size: {
                                    $filter: {
                                      input: '$participants',
                                      cond: {
                                        $eq: [
                                          '$$this.avatar',
                                          participants[ii].avatar,
                                        ],
                                      },
                                    },
                                  },
                                },
                                0,
                              ],
                            },
                            {
                              $reduce: {
                                input: '$participants',
                                initialValue: [],
                                in: {
                                  $concatArrays: [
                                    '$$value',
                                    [
                                      {
                                        $cond: [
                                          {
                                            $eq: [
                                              '$$this.avatar',
                                              participants[ii].avatar,
                                            ],
                                          },
                                          {
                                            $mergeObjects: [
                                              '$$this',
                                              {
                                                clientid:
                                                  participants[ii].clientid,
                                              },
                                              {
                                                participant_id:
                                                  participants[ii]
                                                    .participant_id,
                                              },
                                              {
                                                name: participants[ii].name,
                                              },
                                              {
                                                geo: participants[ii].geo,
                                              },
                                              {
                                                device: participants[ii].device,
                                              },
                                              {
                                                events: participants[ii].events,
                                              },
                                            ],
                                          },
                                          '$$this',
                                        ],
                                      },
                                    ],
                                  ],
                                },
                              },
                            },
                            {
                              $concatArrays: [
                                '$participants',
                                [participants[ii]],
                              ],
                            },
                          ],
                        },
                      },
                    },
                  ],
                  { new: true }
                );
              }
            }
          } catch (err) {
            console.error(err);
          }
        };
        await updateConferenceData(participants);
      }
      // console.log('Completed :: ', participants);
      const returnData = await this.generateParticipantsResponse(
        Conference,
        participants,
        operationData.operate['conf-meet-id'],
        geoCoords.latitide,
        geoCoords.longitude,
        operationData.resp
      );
      return returnData;
    },
    generateParticipantsResponse: async function(
      modelObj,
      participants,
      conference_id,
      geoLat,
      geoLon,
      controlData
    ) {
      //
      let fetchParticipantsinDb = async () => {
        try {
          for (let ii = 0; ii < participants.length; ii++) {
            const participantInDb = await modelObj.find(
              {
                conference_id,
                // 'participants.avatar': participants[ii].avatar,
              },
              {
                participants: {
                  $elemMatch: { avatar: participants[ii].avatar },
                },
              }
            );
            const {
              network,
              events,
              avatar,
              name,
              geo,
              device,
            } = participantInDb[0].participants[0];
            controlData.participants[ii].distance =
              geo.latitide && geo.longitude
                ? getDistanceFromLatLonInKm(
                    geoLat,
                    geoLon,
                    geo.latitide,
                    geo.longitude
                  )
                : null;

            controlData.participants[ii].timezone = geo.timezone
              ? geo.timezone
              : null;
            // console.log({ network, events, avatar, name, geo, device });
          }
        } catch (err) {
          console.error(err);
        }
      };
      await fetchParticipantsinDb(participants);
      return controlData;
    },
    infuseLocalDetails: async function() {},
  };
};

/* closed function implementing *****PLSRD******
 */

function parseParticipantToServerObject(prt) {
  return prt
    .map((p) => {
      return {
        id: p.id,
        conference_id: p.id.split('/')[1],
        participant_id: p.id.split('/')[3],
        name: p.name,
        avatar: p.avatar,
        point: p.isLocal,
      };
    })
    .reduce((conferenceObject, participant) => {
      !conferenceObject['operate']
        ? Object.assign(conferenceObject, {
            operate: Object.assign(
              { 'conf-meet-id': participant.conference_id },
              { participants: [] }
            ),
          })
        : null;
      !conferenceObject['resp']
        ? Object.assign(conferenceObject, {
            resp: Object.assign(
              {
                'conn-id': `${participant.conference_id}_${participant.participant_id}`,
              },
              { participants: [] }
            ),
          })
        : null;
      conferenceObject.operate.participants.push(
        ({ id, name, avatar, point, participant_id } = participant)
      );
      conferenceObject.resp.participants.push(
        ({ id, name, avatar, point, participant_id } = participant)
      );
      return conferenceObject;
    }, {});
}
