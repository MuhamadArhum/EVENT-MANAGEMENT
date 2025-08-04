const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
  },
  password: { type: String, required: true, minlength: 6 },
  role: { 
    type: String, 
    enum: ['Admin', 'Manager', 'Cashier', 'User'], // allowed roles
    default: 'User' 
  },
  // models/User.js
assignedFeatures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feature' }],
  createdAt: { type: Date, default: Date.now }
});




const User = mongoose.model('User', userSchema, 'users');
module.exports = User;
