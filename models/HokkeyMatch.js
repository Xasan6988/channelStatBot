const {Schema, model} = require('mongoose');

const schema = new Schema({
  date: {type: String, required: true},
  half: {type: Boolean, default: false},
  one: {type: Boolean, default: false},
  coef: {type: [Number], default: [1.5, 1.5]}
});


module.exports = model('HokkeyMatch', schema);
