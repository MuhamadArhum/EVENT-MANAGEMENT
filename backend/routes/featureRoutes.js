const express = require('express');
const Feature = require('../models/Feature');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();

// 📌 Create new feature (Admin only)
router.post('/', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  try {
    const { name, description } = req.body;
    const feature = new Feature({ name, description });
    await feature.save();

    const io = req.app.get('io');
    io.emit('featureCreated', { message: 'New feature created', feature });

    res.status(201).json({ success: true, feature });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 📌 Get all features (Admin only)
router.get('/', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  try {
    const features = await Feature.find();
    res.json({ success: true, features });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 📌 Update feature (Admin only)
router.put('/:id', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  try {
    const { name, description } = req.body;
    const feature = await Feature.findById(req.params.id);
    if (!feature) return res.status(404).json({ success: false, message: 'Feature not found' });

    if (name) feature.name = name;
    if (description) feature.description = description;

    await feature.save();

    const io = req.app.get('io');
    io.emit('featureUpdated', { message: 'Feature updated', feature });

    res.json({ success: true, message: 'Feature updated successfully', feature });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 📌 Delete feature (Admin only)
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  try {
    const feature = await Feature.findByIdAndDelete(req.params.id);
    if (!feature) return res.status(404).json({ success: false, message: 'Feature not found' });

    const io = req.app.get('io');
    io.emit('featureDeleted', { message: 'Feature deleted', featureId: req.params.id });

    res.json({ success: true, message: 'Feature deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 📌 Assign features to a user (Admin only)
router.put('/assign/:userId', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  const { userId } = req.params;
  const { features } = req.body; // Array of feature IDs

  try {
    const user = await User.findById(userId).populate('assignedFeatures'); // populate for live list
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.assignedFeatures = features;
    await user.save();
    await user.populate('assignedFeatures'); // repopulate after save

    const io = req.app.get('io');

    // 🔥 Send notification
    io.emit('featuresAssigned', { 
      message: 'Features assigned to user', 
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        assignedFeatures: user.assignedFeatures
      }
    });

    // 🔥 Also broadcast updated live list of all users
    const allUsers = await User.find().populate('assignedFeatures').select('-password');
    io.emit('liveUserFeatures', { message: 'Live user features list updated', users: allUsers });

    res.json({ 
      success: true, 
      message: 'Features assigned successfully', 
      assignedFeatures: user.assignedFeatures 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
