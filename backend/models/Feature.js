// models/Feature.js
const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String }
});

const Feature = mongoose.model('Feature', featureSchema);
module.exports = Feature;
