const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createCalendar,
  getCalendars,
  updateCalendar,
  deleteCalendar
} = require('../controllers/calendarController');

// 📌 Routes
router.post('/create', authMiddleware, createCalendar);
router.get('/', authMiddleware, getCalendars);
router.put('/:id', authMiddleware, updateCalendar);
router.delete('/:id', authMiddleware, deleteCalendar);

module.exports = router;
