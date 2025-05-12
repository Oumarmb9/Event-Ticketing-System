const QRCode = require('qrcode');
const sendEmail = require('../utils/sendEmail');
const express = require('express');
const Booking = require('../models/booking');
const Event = require('../models/event');
const { authenticate, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate('event');
  res.json(bookings);
});

router.get('/:id', authenticate, async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('event');
  if (!booking || booking.user.toString() !== req.user._id.toString()) {
    return res.status(404).json({ error: 'Booking not found or access denied' });
  }
  res.json(booking);
});

router.post('/', authenticate, authorizeRoles('user'), async (req, res) => {
  const { event: eventId, quantity } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (event.bookedSeats + quantity > event.seatCapacity) {
      return res.status(400).json({ error: 'Not enough seats available' });
    }

    event.bookedSeats += quantity;
    await event.save();

    const qrString = `${req.user._id}-${eventId}-${Date.now()}`;
    const qrCode = await QRCode.toDataURL(qrString);
    
    const booking = await Booking.create({
      user: req.user._id,
      event: eventId,
      quantity,
      qrCode,
    });

    await sendEmail(req.user.email, 'Booking Confirmed', `Booking ID: ${booking._id}`);

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Booking failed' });
    console.log(err)
  }

}); 

router.get('/validate/:qr', async (req, res) => {
    const qr = req.params.qr;
    const booking = await Booking.findOne({ qrCode: qr }).populate('user event');
    if (!booking) return res.status(404).json({ valid: false });
    res.json({ valid: true, booking });
});

module.exports = router;
