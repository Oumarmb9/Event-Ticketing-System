const express = require('express');
const Event = require('../models/event');
const { authenticate, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const { category, date } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (date) filter.date = new Date(date);
  const events = await Event.find(filter);
  res.json(events);
});

router.get('/:id', async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  res.json(event);
});

router.post('/', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

router.put('/:id', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (req.body.seatCapacity < event.bookedSeats) {
      return res.status(400).json({ error: 'New seat capacity < booked seats' });
    }

    Object.assign(event, req.body);
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: 'Error updating event' });
  }
});

router.delete('/:id', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    await event.deleteOne();
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting event' });
  }
});

module.exports = router;