const mongoose = require('mongoose');

const ParticpantsSchema = new mongoose.Schema({
  clientid: {
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
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: {},
  },
  device: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: {},
  },
  events: {
    type: [mongoose.Schema.Types.Mixed],
    required: true,
    default: [{ date: Date.now, event: {} }],
  },
});

module.exports = ParticpantsSchema;
