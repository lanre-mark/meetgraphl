const { getDistanceFromLatLonInKm } = require('../utility/geometry');
const miscUtilities = require('../utility/misc');

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
  latitude: 6.4474,
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
  latitude: 34.0531,
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
  latitude: 51.9417,
  longitude: -2.4149,
  timezone: 'Europe/London',
  place: 'Newent, England, United Kingdom',
  location: '51.9417, -2.4149',
};
// Device Info
const deviceinfo1 = {
  ua:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
  browser: { name: 'Chrome', version: '83.0.4103.61', major: '83' },
  engine: { name: 'Blink', version: '83.0.4103.61' },
  os: { name: 'Mac OS', version: '10.15.4' },
  device: { vendor: undefined, model: undefined, type: undefined },
  cpu: { architecture: undefined },
};
const deviceinfo2 = {
  ua:
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/535.2 (KHTML, like Gecko) Ubuntu/11.10 Chromium/15.0.874.106 Chrome/15.0.874.106 Safari/535.2',
  browser: { name: 'Chromium', version: '15.0.874.106', major: '15' },
  engine: { name: 'WebKit', version: '535.2' },
  os: { name: 'Ubuntu', version: '11.10' },
  device: { vendor: undefined, model: undefined, type: undefined },
  cpu: { architecture: 'amd64' },
};
const deviceinfo3 = {
  ua:
    'Mozilla/5.0 (PlayBook; U; RIM Tablet OS 1.0.0; en-US) AppleWebKit/534.11 (KHTML, like Gecko) Version/7.1.0.7 Safari/534.11',
  browser: { name: 'Safari', version: '7.1.0.7', major: '7' },
  engine: { name: 'WebKit', version: '534.11' },
  os: { name: 'RIM Tablet OS', version: '1.0.0' },
  device: { vendor: 'RIM', model: 'PlayBook', type: 'tablet' },
  cpu: { architecture: undefined },
};

module.exports = ({
  Conference,
  WeatherKeyController,
  WeatherRepo,
  LocationEvent,
}) => {
  // need to add other models weatherkeycontroller, weatherrepo, events...
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
              ['device']: deviceinfo1, //deviceInfo,
            };
            // if (
            //   participant.name === 'olanrewaju Mark' ||
            //   participant.name === 'olanrewaju Markin'
            // ) {
            //   db_row[db_row.length - 1] = {
            //     ...db_row[db_row.length - 1],
            //     ['network']: ipadd1, //ipaddress,
            //     ['geo']: geo1, //geoCoords,
            //     ['device']: deviceinfo1, //deviceInfo,
            //   };
            // } else if (participant.name === 'Fliptop Consulting') {
            //   db_row[db_row.length - 1] = {
            //     ...db_row[db_row.length - 1],
            //     ['network']: ipadd2, //ipaddress,
            //     ['geo']: geo2, //geoCoords,
            //     ['device']: deviceinfo2, //deviceInfo,
            //   };
            // } else if (participant.name === 'Oluwatosin Makinde') {
            //   db_row[db_row.length - 1] = {
            //     ...db_row[db_row.length - 1],
            //     ['network']: ipadd3, //ipaddress,
            //     ['geo']: geo3, //geoCoords,
            //     ['device']: deviceinfo3, //deviceInfo,
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
        geoCoords.latitude,
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
                    geo.latitude,
                    geo.longitude
                  )
                : null;

            controlData.participants[ii].timezone = geo.timezone
              ? geo.timezone
              : null;
            controlData.participants[ii].deviceinfo =
              device && device.ua ? this.parseDeviceInfo(device).devinfo : null;
            // console.log({ network, events, avatar, name, geo, device });

            const checkGeoinWeather = await WeatherRepo.retrieveWeatherDetails(
              WeatherKeyController,
              geoLat,
              geoLon
            );
            controlData.participants[ii].weatherinfo = checkGeoinWeather;
            console.log("Participant's Weather :: ", checkGeoinWeather);

            const evtHolidays = await miscUtilities.holidayEvents(
              LocationEvent,
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              geo.countryCode.toLowerCase(),
              geo.regionCode.toLowerCase()
            );

            controlData.participants[ii].holidayinfo = evtHolidays;
            console.log("Participant's Holiday Event :: ", evtHolidays);
          }
        } catch (err) {
          console.error(err);
        }
      };
      await fetchParticipantsinDb(participants);
      return controlData;
    },
    infuseLocalDetails: async function() {},
    parseDeviceInfo: function(dInfo) {
      const details = JSON.parse(process.env.DEVICE_DIRECTORY);
      return details.reduce(
        (deviceinfo, det) => {
          const struc = dInfo[Object.keys(det)[0]];
          if (struc) {
            if (det[Object.keys(det)[0]].some((k) => struc[k])) {
              deviceinfo['devinfo'].push(
                det[Object.keys(det)[0]]
                  .map((k, ii) =>
                    struc[k]
                      ? ii === 0
                        ? struc[k]
                        : ii === 1
                        ? `v${struc[k]}`
                        : `(${struc[k].toTitleCase()})`
                      : ''
                  )
                  .join(' ')
              );
              if (Object.keys(det)[0] === 'os') {
                deviceinfo['devinfo'][deviceinfo['devinfo'].length - 1] +=
                  dInfo.cpu && dInfo.cpu.architecture
                    ? ' (' + dInfo.cpu.architecture.toLowerCase() + ')'
                    : '';
              }
            }
          }
          return deviceinfo;
        },
        { devinfo: [] }
      );
      /* STATIC METHOD
      const dinf = [];
      if (dInfo.device && dInfo.device.vendor) {
        dinf.push(
          `${dInfo.device.vendor.toUpperCase()} ${
            dInfo.device.model ? dInfo.device.model.toTitleCase() : ''
          } ${
            dInfo.device.type ? '(' + dInfo.device.type.toTitleCase() + ')' : ''
          }`
        );
      }
      if (dInfo.os && dInfo.os.name) {
        dinf.push(
          `${dInfo.os.name} ${dInfo.os.version ? 'v' + dInfo.os.version : ''}${
            dInfo.cpu && dInfo.cpu.architecture
              ? ' (' + dInfo.cpu.architecture.toLowerCase() + ')'
              : ''
          }`
        );
      }
      if (dInfo.browser && dInfo.browser.name) {
        dinf.push(
          `${dInfo.browser.name} ${
            dInfo.browser.version ? 'v' + dInfo.browser.version : ''
          }`
        );
      }
      if (dInfo.engine && dInfo.engine.name) {
        dinf.push(
          `${dInfo.engine.name} ${
            dInfo.engine.version ? 'v' + dInfo.engine.version : ''
          }`
        );
      }
      return { devinfo: dinf };
      */
    },
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
