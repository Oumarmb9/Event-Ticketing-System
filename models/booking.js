const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  quantity: { type: Number, required: true },
  bookingDate: { type: Date, default: Date.now },
  qrCode: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
