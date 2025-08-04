const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  type: { type: String, enum: ['Daily', 'Weekly', 'Monthly', 'Yearly', 'Custom'], required: true },
  generatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  data: { type: Object, required: true } // yahan summary data store hoga
});

module.exports = mongoose.model('Report', ReportSchema);
