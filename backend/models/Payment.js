const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['Cash', 'Card', 'Stripe', 'PayPal'], required: true },
    paymentType: { type: String, enum: ['Advance', 'Full'], required: true },
    status: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Refunded'], default: 'Paid' },
    transactionId: { type: String, default: null },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiptUrl: { type: String, default: null }, // later PDF receipts
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
