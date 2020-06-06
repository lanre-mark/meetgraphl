const mongoose = require('mongoose');
const ParticpantsSchema = require('./participants');

const Schema = mongoose.Schema;

const conferenceSchema = new Schema(
  {
    conference_id: { type: String, required: true, unique: true },
    participants: {
      type: [ParticpantsSchema],
    },
  },
  { timestamps: true }
);

conferenceSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 3 }
); //60*60*24

const Conference = mongoose.model('Conference', conferenceSchema);

module.exports = Conference;
