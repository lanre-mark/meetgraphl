'use strict';

const https = require('https');
const useRequest = require('request');
const { randomBrowserChoice } = require('./userbrowseagent');

const _https = async function(ipaddress) {
  var options = {
    host: `freegeoip.app`,
    path: `/json/${ipaddress}`,
    headers: await randomBrowserChoice(),
  };

  const locationendpoint = new Promise((resolve, reject) => {
    var req = https.get(options, function(resp) {
      var body = '';
      resp.on('data', function(data) {
        body += data;
      });
      resp.on('end', function() {
        return resolve(ipaddformat(JSON.parse(body), 2));
      });
    });
    req.on('error', function(e) {
      return reject(new Error(e));
    });
  });

  const endpointCall = await locationendpoint.then((rsp) => {
    return rsp;
  });

  return endpointCall;
};

const _requests = async (ipaddress) => {
  const locationendpoint = new Promise((resolve, reject) => {
    useRequest(`http://ip-api.com/json/${ipaddress}`, function(
      error,
      response,
      body
    ) {
      if (error) {
        console.error('error:', error);
        return resolve(_https(ipaddress));
      }
      return response.statusCode == '200'
        ? resolve(ipaddformat(JSON.parse(body)))
        : resolve(_https(ipaddress));
    });
  });

  const endpointCall = await locationendpoint.then((rsp) => {
    return rsp;
  });

  return endpointCall;
};

const placeformat = (country, region, city) => {
  return region === city
    ? `${city}, ${country}`
    : `${city}, ${region}, ${country}`;
};

const ipaddformat = (resp, type = 1) => {
  return {
    status: type == 1 ? resp.status : 'success',
    countryName: type == 1 ? resp.country : resp.country_name,
    countryCode: type == 1 ? resp.countryCode : resp.country_code,
    regionCode: type == 1 ? resp.region : resp.region_code,
    regionName: type == 1 ? resp.regionName : resp.region_name,
    cityName: resp.city,
    zipCode: type == 1 ? resp.zip : resp.zip_code,
    latitide: type == 1 ? resp.lat : resp.latitude,
    longitude: type == 1 ? resp.lon : resp.longitude,
    timezone: type == 1 ? resp.timezone : resp.time_zone,
    place: placeformat(
      type == 1 ? resp.country : resp.country_name,
      type == 1 ? resp.regionName : resp.region_name,
      resp.city
    ),
    location: `${type == 1 ? resp.lat : resp.latitude}, ${
      type == 1 ? resp.lon : resp.longitude
    }`,
  };
};

const resolveip = async (ipaddress) => {
  // _requests('105.112.178.209')
  try {
    const rsp = await _requests(ipaddress);
    return rsp;
  } catch (exc) {
    return { status: 'fail', message: exc.toString() };
  }
};

// for (let ii = 0; ii <= 50; ii++) {
// const resp = _requests("105.112.178.209").then((rsp) => {
//   console.log(rsp);
// });
// }

module.exports = {
  resolveip,
};
