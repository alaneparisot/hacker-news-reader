const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  _id: {type: String, required: true},
  elements: [{
    item: {type: Number, ref: 'Item'},
    rank: Number
  }]
});

module.exports = mongoose.model('List', listSchema);