const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// ✅ Create Payment (Advance or Full)
router.post('/', authMiddleware, roleMiddleware(['Admin', 'Manager']), paymentController.createPayment);

// ✅ Get All Payments (Admin only)
router.get('/', authMiddleware, roleMiddleware(['Admin']), paymentController.getAllPayments);

module.exports = router;
