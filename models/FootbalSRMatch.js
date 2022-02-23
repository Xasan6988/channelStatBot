const {Schema, model} = require('mongoose');

const schema = new Schema({
  date: {type: String, required: true},
  win: {type: Boolean, default: false},
  half: {type: Boolean, default: false},
  winCoef: {type: Number},
  halfCoef: {type: Number}
});


module.exports = model('FootbalSRMatch', schema);
