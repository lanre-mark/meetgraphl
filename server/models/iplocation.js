const mongoose = require('mongoose');
const { resolveip } = require('../utility');
const CoodinatesSchema = require('./coordinate');

const IpLocationSchema = new mongoose.Schema({
  ipaddress: {
    type: String,
    required: true,
    unique: true,
  },
  coords: {
    type: CoodinatesSchema,
    required: true,
  },
  payload: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: {},
  },
  timeLine: {
    type: mongoose.Schema.Types.Date,
    default: Date.now,
  },
});

IpLocationSchema.methods.toJSON = function() {
  const ipLocation = this;
  const ipLocationObject = ipLocation.toObject();
  delete ipLocationObject._id;

  return ipLocationObject;
};

IpLocationSchema.statics.ipAddressResolve = async function(ipaddress) {
  const chkIp = await IpLocation.find({ ipaddress });
  if (chkIp.length) {
    // validate the time it was last updated
    return chkIp[0].payload;
  } else {
    const rspcoordgeo = await resolveip(ipaddress);
    await new IpLocation({
      ipaddress,
      coords: {
        type: 'Point',
        coordinates: [rspcoordgeo.longitude, rspcoordgeo.latitide],
      },
      payload: rspcoordgeo,
    }).save();
    return rspcoordgeo;
  }
};

const IpLocation = mongoose.model('IpLocation', IpLocationSchema);

module.exports = IpLocation;
