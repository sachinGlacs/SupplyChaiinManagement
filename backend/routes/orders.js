const express = require('express');
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const History = require('../models/History');
const router = express.Router();

module.exports = (io) => {
  // Get all orders
  router.get('/', async (req, res) => {
    try {
      const orders = await Order.find({}).populate('product');
      res.json(orders);
    } catch (err) {
      res.status(500).json({ msg: 'Failed to fetch orders', error: err.message });
    }
  });

  // Add new order and decrement inventory
  router.post('/', async (req, res) => {
    try {
      const { product, quantity, customerName, address, pinCode, mobile, status } = req.body;
      const inventoryItem = await Inventory.findById(product);
      if (!inventoryItem) return res.status(400).json({ msg: 'Inventory item not found' });
      if (inventoryItem.quantity < quantity) return res.status(400).json({ msg: 'Not enough inventory to fulfill order' });
      inventoryItem.quantity -= Number(quantity);
      await inventoryItem.save();
      const order = new Order({
        product,
        quantity,
        status: status || 'pending',
        customerName,
        address,
        pinCode,
        mobile
      });
      await order.save();
      await History.create({ type: 'Order', name: inventoryItem.name, action: 'Added', details: `Quantity: ${quantity}, Status: ${order.status}, Customer: ${customerName}, Address: ${address}, Pin: ${pinCode}, Mobile: ${mobile}` });
      io.emit('ordersUpdated');
      io.emit('inventoryUpdated');
      io.emit('historyUpdated');
      res.json(order);
    } catch (err) {
      res.status(500).json({ msg: 'Failed to save order', error: err.message });
    }
  });

  // Update order
  router.put('/:id', async (req, res) => {
    try {
      const { product, quantity, status, customerName, address, pinCode, mobile } = req.body;
      const oldOrder = await Order.findById(req.params.id).populate('product');
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { product, quantity, status, customerName, address, pinCode, mobile },
        { new: true }
      ).populate('product');
      await History.create({ type: 'Order', name: order.product?.name || 'N/A', action: 'Edited', details: `Old: ${oldOrder.product?.name || 'N/A'},${oldOrder.quantity},${oldOrder.status},${oldOrder.customerName},${oldOrder.address},${oldOrder.pinCode},${oldOrder.mobile} -> New: ${order.product?.name || 'N/A'},${quantity},${status},${customerName},${address},${pinCode},${mobile}` });
      io.emit('ordersUpdated');
      io.emit('historyUpdated');
      res.json(order);
    } catch (err) {
      res.status(500).json({ msg: 'Failed to update order', error: err.message });
    }
  });

  // Delete order
  router.delete('/:id', async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).populate('product');
      await Order.findByIdAndDelete(req.params.id);
      await History.create({ type: 'Order', name: order && order.product ? order.product.name : 'N/A', action: 'Deleted', details: order ? `Quantity: ${order.quantity}, Status: ${order.status}` : '' });
      io.emit('ordersUpdated');
      io.emit('historyUpdated');
      res.json({ msg: 'Order deleted' });
    } catch (err) {
      res.status(500).json({ msg: 'Failed to delete order', error: err.message });
    }
  });

  return router;
}; 