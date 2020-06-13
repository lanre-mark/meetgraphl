const Conference = require('./conferences');
const IpLocation = require('./iplocation');
const ParticpantsSchema = require('./participants');
const WeatherKeyController = require('./weatherkeycontroller');
const WeatherRepo = require('./weatherrepo');

module.exports = {
  Conference,
  ParticpantsSchema,
  IpLocation,
  WeatherKeyController,
  WeatherRepo,
};
