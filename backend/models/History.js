const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  type: String,
  name: String,
  action: String,
  details: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', HistorySchema); 