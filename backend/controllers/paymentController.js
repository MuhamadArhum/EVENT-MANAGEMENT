const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const generateReceipt = require('../utils/receiptGenerator'); // 🔥 add this utility
const { v4: uuidv4 } = require('uuid');

// ✅ Create Payment with Receipt
exports.createPayment = async (req, res) => {
  try {
    const { bookingId, amount, method, paymentType } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // Create Payment Record
    const payment = new Payment({
      booking: bookingId,
      amount,
      method,
      paymentType,
      status: 'Paid',
      transactionId: uuidv4(),
      paidBy: req.user.userId,
    });

    await payment.save();

    // Update Booking according to Payment Type
    if (paymentType === 'Advance') {
      booking.advanceAmount += amount;
      booking.remainingAmount = booking.totalPrice - booking.advanceAmount;
      booking.isAdvancePaid = true;
      booking.paymentStatus = 'Advance Paid';
    } else if (paymentType === 'Full') {
      booking.remainingAmount = 0;
      booking.isFinalPaid = true;
      booking.paymentStatus = 'Paid';
      booking.status = 'Completed';
    }

    await booking.save();

    // ✅ Generate Receipt PDF
    const receiptUrl = await generateReceipt(payment, booking);
    payment.receiptUrl = receiptUrl;
    await payment.save();

    res.status(201).json({ 
      success: true, 
      message: `${paymentType} payment recorded successfully`, 
      payment, 
      booking, 
      receiptUrl 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating payment', error: error.message });
  }
};

// ✅ Get All Payments (Admin)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('booking', 'customerName service bookingDate totalPrice advanceAmount remainingAmount')
      .populate('paidBy', 'username email role')
      .sort({ createdAt: -1 });

    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching payments', error: error.message });
  }
};
