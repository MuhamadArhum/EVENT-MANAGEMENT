const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware'); // ✅ moved to top
const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ 
      username, 
      email, 
      password: hashedPassword, 
      role: role || 'User'
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error('Register Error:', err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Protected Profile Route
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error('Profile Error:', err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Assign Features (Admin only)
router.put('/assign-features/:userId', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  const { userId } = req.params;
  const { features } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.assignedFeatures = features;
    await user.save();

    res.json({ 
      success: true, 
      message: 'Features assigned successfully', 
      assignedFeatures: user.assignedFeatures 
    });
  } catch (err) {
    console.error('Assign Features Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Dashboards with role-based access
router.get('/admin-dashboard', authMiddleware, roleMiddleware(['Admin']), (req, res) => {
  res.json({ success: true, message: 'Welcome Admin, you have full control!' });
});

router.get('/manager-dashboard', authMiddleware, roleMiddleware(['Admin', 'Manager']), (req, res) => {
  res.json({ success: true, message: 'Welcome Manager/Admin, you can manage bookings and staff!' });
});

router.get('/cashier-dashboard', authMiddleware, roleMiddleware(['Admin', 'Manager', 'Cashier']), (req, res) => {
  res.json({ success: true, message: 'Welcome Cashier/Manager/Admin, you can manage payments!' });
});

module.exports = router;
