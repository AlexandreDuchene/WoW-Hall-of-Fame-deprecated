const mongoose = require('mongoose');
const Achievement = require('./achievement');

const Character = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
    validate: val =>
      val.length >= 2 && val.length <= 12
  },
  guid: {
    type: Number,
    required: true,
    validate: val =>
      _.isInteger(val) && val > 0
  },
  achievements: [{
    achievement: Achievement,
    date: {
      type: Date,
      required: true,
    }
  }]
});

module.exports = mongoose.model('Character', Character);
