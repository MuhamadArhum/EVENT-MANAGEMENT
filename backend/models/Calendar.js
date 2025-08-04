const mongoose = require('mongoose');

const calendarSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Booking', 'Custom'], default: 'Custom' },
}, { timestamps: true });

module.exports = mongoose.model('Calendar', calendarSchema);
