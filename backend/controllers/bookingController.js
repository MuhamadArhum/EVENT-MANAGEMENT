const Booking = require('../models/Booking');

// ✅ Create Booking
exports.createBooking = async (req, res) => {
  try {
    let {
      customerName,
      customerEmail,
      customerPhone,
      service,
      bookingDate,
      assignedTo,
      notes,
      totalPrice,
      advanceAmount
    } = req.body;

    // Ensure numeric values
    totalPrice = Number(totalPrice);
    advanceAmount = Number(advanceAmount) || 0;

    const booking = new Booking({
      customerName,
      customerEmail,
      customerPhone,
      service,
      bookingDate,
      assignedTo,
      notes,
      createdBy: req.user.userId,
      totalPrice,
      advanceAmount,
      remainingAmount: totalPrice - advanceAmount,
      isAdvancePaid: advanceAmount > 0,
      isFinalPaid: advanceAmount >= totalPrice,
      paymentStatus:
        advanceAmount >= totalPrice
          ? 'Paid'
          : advanceAmount > 0
          ? 'Advance Paid'
          : 'Unpaid',
    });

    await booking.save();

    // 🔔 Emit Socket.IO notification
    const io = req.app.get('io');
    io.emit('bookingNotification', {
      type: 'New Booking',
      message: `New booking created by ${customerName} for ${service}`,
      booking,
    });

    res.status(201).json({ success: true, message: 'Booking created successfully', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating booking', error: error.message });
  }
};

// ✅ Update Booking (supports updating payments too)
exports.updateBooking = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.totalPrice) updates.totalPrice = Number(updates.totalPrice);
    if (updates.advanceAmount) updates.advanceAmount = Number(updates.advanceAmount);

    // Auto calculate remaining + payment status if amounts provided
    if (updates.totalPrice || updates.advanceAmount) {
      const totalPrice = updates.totalPrice ?? 0;
      const advanceAmount = updates.advanceAmount ?? 0;
      updates.remainingAmount = totalPrice - advanceAmount;
      updates.isAdvancePaid = advanceAmount > 0;
      updates.isFinalPaid = advanceAmount >= totalPrice;
      updates.paymentStatus =
        advanceAmount >= totalPrice
          ? 'Paid'
          : advanceAmount > 0
          ? 'Advance Paid'
          : 'Unpaid';
    }

    const booking = await Booking.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // 🔔 Emit Socket.IO notification
    const io = req.app.get('io');
    io.emit('bookingNotification', {
      type: 'Booking Updated',
      message: `Booking for ${booking.customerName} has been updated`,
      booking,
    });

    res.json({ success: true, message: 'Booking updated successfully', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating booking', error: error.message });
  }
};

// ✅ Cancel Booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'Cancelled' }, { new: true });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // 🔔 Emit Socket.IO notification
    const io = req.app.get('io');
    io.emit('bookingNotification', {
      type: 'Booking Cancelled',
      message: `Booking for ${booking.customerName} has been cancelled`,
      booking,
    });

    res.json({ success: true, message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error cancelling booking', error: error.message });
  }
};

// ✅ Get All Bookings (Admin/Manager)
exports.getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = search
      ? {
          $or: [
            { customerName: { $regex: search, $options: 'i' } },
            { customerEmail: { $regex: search, $options: 'i' } },
            { service: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const bookings = await Booking.find(query)
      .populate('assignedTo', 'username email role')
      .populate('createdBy', 'username email role')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalBookings = await Booking.countDocuments(query);

    res.json({ success: true, bookings, totalBookings, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching bookings', error: error.message });
  }
};

// ✅ Get Assigned Bookings (Cashier)
exports.getAssignedBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ assignedTo: req.user.userId })
      .populate('createdBy', 'username email role')
      .sort({ bookingDate: 1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching assigned bookings', error: error.message });
  }
};
