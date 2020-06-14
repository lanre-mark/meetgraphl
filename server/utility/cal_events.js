'use strict';
/*
  using Calendarific API
*/
const useRequest = require('request');

const CalEvents = function() {
  if (!(this instanceof CalEvents)) {
    return new CalEvents();
  }
  this.key = process.env.EVENTS_API_KEY;
  this.apiEndpoint = process.env.EVENTS_API_URL;
};

const processResponse = async (err, res, body) => {
  return new Promise((resolve, reject) => {
    if (err) {
      return reject(err.message);
    }
    if (body.meta && body.meta.code) {
      if (body.meta.code !== 200) {
        let error = new Error(
          body.meta.error_detail
            ? body.meta.error_detail
            : body.meta.error_type
            ? body.meta.error_type
            : ''
        );
        error.status = body.meta.code;
        return reject(error);
      } else {
        return resolve(body.response);
      }
    } else {
      return reject('no response');
    }
  });
};

const invokeAPI = async (url) => {
  return new Promise((resolve, reject) => {
    useRequest(
      url,
      {
        json: true,
      },
      async (err, res, body) => {
        try {
          const rsp = await processResponse(err, res, body);
          return resolve(rsp);
        } catch (err) {
          return reject(err);
        }
      }
    );
  });
};

CalEvents.prototype.holidays = async function(parameters) {
  let querystring = '?api_key=' + this.key;

  if ('object' === typeof parameters) {
    for (var parameter in parameters) {
      querystring += '&' + parameter + '=' + parameters[parameter];
    }
  }

  const url = `${this.apiEndpoint}/holidays${querystring}`;

  return await invokeAPI(url);
};

/**
 *  add country to argumnents so that this can be used for all countries or a single country
 */
CalEvents.prototype.countries = async function(country) {
  let querystring = `?api_key=${this.key}${
    country ? '&country=' + country : null
  }`;
  const url = `${this.apiEndpoint}/countries${querystring}`;
  return await invokeAPI(url);
};

module.exports = CalEvents;
