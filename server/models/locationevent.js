const mongoose = require('mongoose');
// const miscUtilities = require('../utility/misc');
// const eventsAPI = new require('../utility/cal_events')();

const LocationEventSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      maxLength: 6,
      required: true,
    },
    region: {
      type: String,
      maxLength: 6,
      required: true,
    },
    date: {
      type: Date,
      required: true,
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

LocationEventSchema.statics.yourHolidayEvents = async (
  country,
  region,
  year,
  month
) => {
  try {
    let locationevent = await LocationEvent.find(
      {
        country: country,
        $and: [
          { $expr: { $eq: [{ $month: '$date' }, month] } },
          { $expr: { $eq: [{ $year: '$date' }, year] } },
        ],
        $or: [
          { $expr: { $eq: ['$region', 'All'] } },
          { $expr: { $eq: ['$region', region] } },
        ],
      },
      { _id: 0, payload: 1 }
    );
    return locationevent.map((h) => h.payload);
  } catch (err) {
    return [];
  }
};

LocationEventSchema.statics.espoungeEvents = async (country, year, month) => {
  // const locationevent =
  await LocationEvent.deleteMany({
    country: country,
    $and: [
      { $expr: { $eq: [{ $month: '$date' }, month] } },
      { $expr: { $eq: [{ $year: '$date' }, year] } },
    ],
  });
};

LocationEventSchema.statics.logEvent = async (obj) => {
  const { country, region, date, payload } = obj;
  const locationevent = await LocationEvent.find({ country, region, date });
  if (locationevent.length) {
    // need to deleted actually in a global statics method
    await LocationEvent.updateOne(
      {
        country,
        region,
        date,
        'payload.name': payload.name,
      },
      { $set: { payload } }
    );
    return locationevent[0]._id;
  } else {
    const newEvtData = await new LocationEvent({
      country,
      region,
      date,
      payload,
    }).save();
    return newEvtData ? newEvtData._id : null;
  }
};

LocationEventSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * process.env.EVENTS_UPDATE_TIMELINE } // lifetime of process.env.EVENTS_UPDATE_TIMELINE days(s)
);

const LocationEvent = mongoose.model('LocationEvent', LocationEventSchema);

module.exports = LocationEvent;
