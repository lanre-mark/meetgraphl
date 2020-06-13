const mongoose = require('mongoose');
const CoodinatesSchema = require('./coordinate');
const miscUtilities = require('../utility/misc');
const weatherAPI = new require('../utility/weather')();

const WeatherRepoSchema = new mongoose.Schema(
  {
    coords: {
      type: CoodinatesSchema,
      required: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },
    apiKey: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

WeatherRepoSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * process.env.WEATHER_UPDATE_TIMELINE } // lifetime of process.env.WEATHER_UPDATE_TIMELINE minute(s)
);

WeatherRepoSchema.index({ coords: '2dsphere' });

WeatherRepoSchema.statics.retrieveWeatherDetails = async function(
  modelComponent,
  lat,
  lon
) {
  //modelComponent === WeatherKeyController model
  // use WEATHER_API_DEFAULT_COVERAGE for range of coverage of an already existing weather payload
  // but use WEATHER_API_DEFAULT_COVERAGE / 2 since the distance search in geoSpatial queries uses radius
  // hence if a payload already exist where (lat, lon) is needed WEATHER_API_DEFAULT_COVERAGE/2 radius
  const weatherRepo = await WeatherRepo.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lon, lat],
        },
        distanceField: 'coords',
        maxDistance:
          parseFloat(process.env.WEATHER_API_DEFAULT_COVERAGE * 1000) / 2,
        spherical: true,
        distanceField: 'distance',
      },
    },
    {
      $project: {
        _id: 0,
        payload: 1,
        distance: 1,
      },
    },
  ]);
  if (weatherRepo.length) {
    return weatherRepo[0].payload ? weatherRepo[0].payload : null;
  } else {
    const apiKey = await miscUtilities.requireNextKey(modelComponent);
    await modelComponent.logAPIKey(apiKey);
    const currentWeather = await weatherAPI.getCurrentWeatherByGeoCoords(
      apiKey,
      'metric',
      lat,
      lon
    );
    await this.logWeatherPayload(apiKey, currentWeather, lat, lon);
    return currentWeather;
  }
};

WeatherRepoSchema.statics.logWeatherPayload = async function(
  apiKey,
  payload,
  latitude,
  longitude
) {
  await new WeatherRepo({
    coords: {
      type: 'Point',
      coordinates: [longitude, latitude],
    },
    apiKey,
    payload,
  }).save();
};

const WeatherRepo = mongoose.model('WeatherRepo', WeatherRepoSchema);

module.exports = WeatherRepo;
