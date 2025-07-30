const express = require('express');
const Inventory = require('../models/Inventory');
const History = require('../models/History');
const router = express.Router();

module.exports = (io) => {
  // Normalize all inventory items before any operation (one-time fix)
  async function normalizeAllInventory() {
    const all = await Inventory.find({});
    for (const item of all) {
      const normName = item.name.trim().toLowerCase();
      const normLocation = item.location.trim().toLowerCase();
      if (item.name !== normName || item.location !== normLocation) {
        await Inventory.updateOne({ _id: item._id }, { $set: { name: normName, location: normLocation } });
      }
    }
  }

  // Get all inventory items
  router.get('/', async (req, res) => {
    try {
      const items = await Inventory.find({});
      res.json(items);
    } catch (err) {
      res.status(500).json({ msg: 'Failed to fetch inventory', error: err.message });
    }
  });

  // Add new inventory item or increase quantity if same name and location
  router.post('/', async (req, res) => {
    try {
      const { name, quantity, location } = req.body;
      const normName = name.trim().toLowerCase();
      const normLocation = location.trim().toLowerCase();
      let item = await Inventory.findOne({ name: normName, location: normLocation });
      if (item) {
        item.quantity += Number(quantity);
        await item.save();
        await History.create({ type: 'Inventory', name: item.name, action: 'Edited', details: `Quantity increased by ${quantity}` });
        io.emit('inventoryUpdated');
        io.emit('historyUpdated');
        return res.json(item);
      } else {
        item = new Inventory({ name: normName, quantity, location: normLocation });
        await item.save();
        await History.create({ type: 'Inventory', name: item.name, action: 'Added', details: `Location: ${item.location}, Quantity: ${item.quantity}` });
        io.emit('inventoryUpdated');
        io.emit('historyUpdated');
        return res.json(item);
      }
    } catch (err) {
      res.status(500).json({ msg: 'Failed to add inventory', error: err.message });
    }
  });

  // Update inventory item
  router.put('/:id', async (req, res) => {
    try {
      const { name, quantity, location } = req.body;
      const normName = name.trim().toLowerCase();
      const normLocation = location.trim().toLowerCase();
      const oldItem = await Inventory.findById(req.params.id);
      const item = await Inventory.findByIdAndUpdate(
        req.params.id,
        { name: normName, quantity, location: normLocation },
        { new: true }
      );
      await History.create({ type: 'Inventory', name: item.name, action: 'Edited', details: `Old: ${oldItem.name},${oldItem.quantity},${oldItem.location} -> New: ${item.name},${item.quantity},${item.location}` });
      io.emit('inventoryUpdated');
      io.emit('historyUpdated');
      res.json(item);
    } catch (err) {
      res.status(500).json({ msg: 'Failed to update inventory', error: err.message });
    }
  });

  // Delete inventory item
  router.delete('/:id', async (req, res) => {
    try {
      const item = await Inventory.findById(req.params.id);
      await Inventory.findByIdAndDelete(req.params.id);
      await History.create({ type: 'Inventory', name: item ? item.name : 'Unknown', action: 'Deleted', details: item ? `Location: ${item.location}, Quantity: ${item.quantity}` : '' });
      io.emit('inventoryUpdated');
      io.emit('historyUpdated');
      res.json({ msg: 'Item deleted' });
    } catch (err) {
      res.status(500).json({ msg: 'Failed to delete inventory', error: err.message });
    }
  });

  return router;
}; 