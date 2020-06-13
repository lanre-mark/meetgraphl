'use strict';

const useRequest = require('request');

function OpenWeatherAPI() {
  if (!(this instanceof OpenWeatherAPI)) {
    return new OpenWeatherAPI();
  }
}

async function processResponse(err, data) {
  return new Promise((resolve, reject) => {
    if (err) reject(err);
    if (data) {
      if (data.statusCode !== 200) {
        let e = JSON.parse(data.body);
        let error = new Error(e.message);
        error.status = e.cod;
        return reject(error);
      }
      return resolve(JSON.parse(data.body));
    }
  });
}

OpenWeatherAPI.prototype.getCurrentWeatherByCityName = async function(
  apiKey,
  unitType,
  cityName
) {
  return new Promise((resolve) => {
    useRequest.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}${
        unitType ? '&units=' + unitType : ''
      }&APPID=${apiKey}`,
      async (err, data) => {
        const rsp = await processResponse(err, data);
        return resolve(rsp);
      }
    );
  });
};

OpenWeatherAPI.prototype.getCurrentWeatherByGeoCoords = async function(
  apiKey,
  unitType,
  latitude,
  longitude
) {
  return new Promise((resolve) => {
    useRequest.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${parseFloat(
        latitude
      )}&lon=${parseFloat(longitude)}${
        unitType ? '&units=' + unitType : ''
      }&APPID=${apiKey}`,
      async (err, data) => {
        const rsp = await processResponse(err, data);
        return resolve(rsp);
      }
    );
  });
};

OpenWeatherAPI.prototype.getForecastByCityName = async function(
  apiKey,
  unitType,
  cityName
) {
  return new Promise((resolve) => {
    useRequest.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}${
        unitType ? '&units=' + unitType : ''
      }&APPID=${apiKey}`,
      async (err, data) => {
        const rsp = await processResponse(err, data);
        return resolve(rsp);
      }
    );
  });
};

OpenWeatherAPI.prototype.getForecastByGeoCoords = async function(
  apiKey,
  unitType,
  latitude,
  longitude
) {
  return new Promise((resolve) => {
    useRequest.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${parseFloat(
        latitude
      )}&lon=${parseFloat(longitude)}${
        unitType ? '&units=' + unitType : ''
      }&APPID=${apiKey}`,
      async (err, data) => {
        const rsp = await processResponse(err, data);
        return resolve(rsp);
      }
    );
  });
};
// units 'kelvin' == default || 'imperial' || 'metric'

module.exports = OpenWeatherAPI;
