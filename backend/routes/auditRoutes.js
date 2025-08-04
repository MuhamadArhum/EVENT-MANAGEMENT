const express = require('express');
const AuditLog = require('../models/AuditLog');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();

// 📌 Get all audit logs (Admin only)
router.get('/', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('performedBy', 'username email')
      .populate('affectedUser', 'username email')
      .sort({ createdAt: -1 });
    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
