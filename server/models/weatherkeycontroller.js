const mongoose = require('mongoose');
const miscUtilities = require('../utility/misc');

const weatherKeyControllerSchema = new mongoose.Schema(
  {
    apiKey: { type: String, required: true },
  },
  { timestamps: true }
);

weatherKeyControllerSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 } // lifetime of 1 minute
);

weatherKeyControllerSchema.statics.nextAPIKey = async function() {
  let lstkey = await WeatherKeyController.aggregate([
    {
      $group: {
        _id: '$apiKey',
        lastUsage: { $last: '$createdAt' },
        usage: { $sum: 1 },
      },
    },
    { $sort: { lastUsage: -1 } },
    { $limit: 1 },
  ]);
  // console.log('Last apiKey data :: ', lstkey);
  if (lstkey.length) {
    // be sure that the number of the last one and the new one to be returned is within limit of the number of calls per API key within the expected limit
    // count the number of records
    if (lstkey[0].usage + 1 <= process.env.WEATHER_API_SIZE_RANGE - 5) {
      // console.log('Use the current max :: ', lstkey[0]._id);
      return lstkey[0]._id;
    } else {
      // console.log('Use the one after the max');
      return miscUtilities.NextKeyInSequence(lstkey[0]._id);
    }
  } else {
    // use the first one
    // console.log('Use the first one');
    return miscUtilities.NextKeyInSequence();
  }
};

weatherKeyControllerSchema.statics.logAPIKey = async function(apiKey) {
  await new WeatherKeyController({
    apiKey,
  }).save();
};

const WeatherKeyController = mongoose.model(
  'WeatherKeyController',
  weatherKeyControllerSchema
);

module.exports = WeatherKeyController;
