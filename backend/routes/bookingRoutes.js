const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// ✅ Create Booking
router.post('/', authMiddleware, roleMiddleware(['Admin', 'Manager']), bookingController.createBooking);

// ✅ Update Booking
router.put('/:id', authMiddleware, roleMiddleware(['Admin', 'Manager']), bookingController.updateBooking);

// ✅ Cancel Booking
router.put('/:id/cancel', authMiddleware, roleMiddleware(['Admin', 'Manager']), bookingController.cancelBooking);

// ✅ Get All Bookings
router.get('/', authMiddleware, roleMiddleware(['Admin', 'Manager']), bookingController.getAllBookings);

// ✅ Get Assigned Bookings (Cashier)
router.get('/my-bookings', authMiddleware, roleMiddleware(['Cashier']), bookingController.getAssignedBookings);

module.exports = router;
