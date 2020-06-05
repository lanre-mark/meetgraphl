const mongoose = require('mongoose');
const ParticpantsSchema = require('./participants');

const Schema = mongoose.Schema;

const conferenceSchema = new Schema(
  {
    conference_id: { type: String, required: true, unique: true, expires: 24 },
    participants: {
      type: [ParticpantsSchema],
    },
  },
  { timestamps: true }
);

conferenceSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 5 }); //60*60*24

module.exports = mongoose.model('Conference', conferenceSchema);
