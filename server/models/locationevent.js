const mongoose = require('mongoose');
// const miscUtilities = require('../utility/misc');
// const eventsAPI = new require('../utility/cal_events')();

const LocationEventSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      maxLength: 6,
      reuqired: true,
    },
    region: {
      type: String,
      maxLength: 6,
      reuqired: true,
    },
    date: {
      type: mongoose.Schema.Types.Date,
      reuqired: true,
      set: function(v) {
        return new Date(v.getFullYear(), v.getMonth(), v.getDate());
      },
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

LocationEventSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * process.env.EVENTS_UPDATE_TIMELINE } // lifetime of process.env.EVENTS_UPDATE_TIMELINE minute(s)
);

const LocationEvent = mongoose.model('LocationEvent', LocationEventSchema);

module.exports = LocationEvent;
