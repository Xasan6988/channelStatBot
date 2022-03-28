const {Schema, model} = require('mongoose');

const schema = new Schema({
  date: {type: String, required: true},
  itb: {type: Boolean, required: true},
  coef: {type: Number, required: true}
});


module.exports = model('Basket23Match', schema);
