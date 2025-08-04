const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
      lowercase: true,
      match: [/.+\@.+\..+/, 'Invalid email format'],
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer phone is required'],
      match: [/^[0-9]{10,15}$/, 'Invalid phone number'],
    },
    service: {
      type: String,
      required: [true, 'Service is required'],
      trim: true,
    },
    bookingDate: {
      type: Date,
      required: [true, 'Booking date is required'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: {
      type: String,
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Advance Paid', 'Paid', 'Refunded'],
      default: 'Unpaid',
    },

    // 🔥 Better Handling for Payments
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price cannot be negative'],
      set: v => Number(v), // String ko bhi Number bana dega
    },
    advanceAmount: {
      type: Number,
      default: 0,
      min: [0, 'Advance cannot be negative'],
      set: v => Number(v),
    },
    remainingAmount: {
      type: Number,
      default: function () {
        return this.totalPrice - this.advanceAmount;
      },
    },
    isAdvancePaid: {
      type: Boolean,
      default: false,
    },
    isFinalPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// 🔹 Auto-calculate remainingAmount every save
bookingSchema.pre('save', function (next) {
  this.remainingAmount = this.totalPrice - this.advanceAmount;
  if (this.advanceAmount > 0 && this.advanceAmount < this.totalPrice) {
    this.paymentStatus = 'Advance Paid';
  }
  if (this.advanceAmount >= this.totalPrice) {
    this.paymentStatus = 'Paid';
    this.isFinalPaid = true;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
