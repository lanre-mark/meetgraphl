const mongoose = require('mongoose');

const ParticpantsSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  participant_id: {
    type: String,
  },
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  network: {
    type: String,
    required: true,
    default: '0.0.0.0',
  },
  geo: {
    type: [mongoose.Schema.Types.Decimal128],
    required: true,
    default: [],
  },
});

module.exports = ParticpantsSchema;
