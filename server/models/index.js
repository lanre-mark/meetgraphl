const Conference = require('./conferences');
const IpLocation = require('./iplocation');
const ParticpantsSchema = require('./participants');
const WeatherKeyController = require('./weatherkeycontroller');
const WeatherRepo = require('./weatherrepo');
const LocationEvent = require('./locationevent');

module.exports = {
  Conference,
  ParticpantsSchema,
  IpLocation,
  LocationEvent,
  WeatherKeyController,
  WeatherRepo,
};
