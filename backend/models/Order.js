const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'shipped', 'delivered'], default: 'pending' },
  dateOrdered: { type: Date, default: Date.now },
  customerName: { type: String, required: true },
  address: { type: String, required: true },
  pinCode: { type: String, required: true },
  mobile: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema); 