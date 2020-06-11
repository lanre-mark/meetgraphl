const mongoose = require('mongoose');

const CoodinatesSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    default: 'Point',
  },
  coordinates: {
    type: [mongoose.Schema.Types.Decimal128], // [longitude, latitude]
    required: true,
  },
});

module.exports = CoodinatesSchema;
