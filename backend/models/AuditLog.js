const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // Create, Update, Delete
  module: { type: String, default: 'Calendar' },
  calendarId: { type: mongoose.Schema.Types.ObjectId, ref: 'Calendar' },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  details: { type: Object },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
