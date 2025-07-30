const express = require('express');
const History = require('../models/History');
const router = express.Router();

module.exports = (io) => {
  // Get all history events
  router.get('/', async (req, res) => {
    const events = await History.find({}).sort({ date: -1 });
    res.json(events);
  });

  // Add a new history event
  router.post('/', async (req, res) => {
    try {
      const event = new History(req.body);
      await event.save();
      res.json(event);
    } catch (err) {
      res.status(500).json({ msg: 'Failed to add history event', error: err.message });
    }
  });

  // Update a history event
  router.put('/:id', async (req, res) => {
    try {
      const event = await History.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(event);
    } catch (err) {
      res.status(500).json({ msg: 'Failed to update history event', error: err.message });
    }
  });

  // Delete a history event
  router.delete('/:id', async (req, res) => {
    try {
      await History.findByIdAndDelete(req.params.id);
      res.json({ msg: 'History event deleted' });
    } catch (err) {
      res.status(500).json({ msg: 'Failed to delete history event', error: err.message });
    }
  });

  return router;
}; 