const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  location: { type: String, required: true },
  dateAdded: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Inventory', InventorySchema); 