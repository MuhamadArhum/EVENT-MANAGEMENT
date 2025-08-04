const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog'); // ✅ new
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();

// 📌 Helper: Save and Emit Audit Log
async function createAuditLog(req, action, affectedUserId, details) {
  const log = await new AuditLog({
    action,
    performedBy: req.user.userId,
    affectedUser: affectedUserId,
    details,
  }).save();

  const io = req.app.get('io');
  io.emit('auditLog', { 
    action, 
    by: req.user.userId, 
    user: affectedUserId, 
    details,
    createdAt: log.createdAt 
  });
}

// 📌 Get all users (Admin only) with search & pagination
router.get('/', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = search
      ? {
          $or: [
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { role: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const users = await User.find(query)
      .populate('assignedFeatures')
      .select('-password')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalUsers = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        total: totalUsers,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 📌 Get single user (Admin or Self)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'Admin' && req.user.userId !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const user = await User.findById(req.params.id).populate('assignedFeatures').select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 📌 Update user info (Admin only)
router.put('/:id', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  const { username, email, role, assignedFeatures } = req.body;

  try {
    const user = await User.findById(req.params.id).populate('assignedFeatures');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    if (assignedFeatures) user.assignedFeatures = assignedFeatures;

    await user.save();
    await user.populate('assignedFeatures');

    const io = req.app.get('io');
    io.emit('userUpdated', { message: 'User updated', user });

    await createAuditLog(req, 'User Updated', user._id, `Updated info/role/features`);

    const allUsers = await User.find().populate('assignedFeatures').select('-password');
    io.emit('liveUserList', { message: 'User list updated', users: allUsers });

    res.json({ success: true, message: 'User updated successfully', user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 📌 Delete user (Admin only)
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const io = req.app.get('io');
    io.emit('userDeleted', { message: 'User deleted', userId: req.params.id });

    await createAuditLog(req, 'User Deleted', user._id, `Deleted user ${user.username}`);

    const allUsers = await User.find().populate('assignedFeatures').select('-password');
    io.emit('liveUserList', { message: 'User list updated', users: allUsers });

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 📌 Change User Role (Admin only)
router.put('/:id/role', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  const { role } = req.body;

  try {
    const user = await User.findById(req.params.id).populate('assignedFeatures');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.role = role;
    await user.save();
    await user.populate('assignedFeatures');

    const io = req.app.get('io');
    io.emit('roleChanged', { message: 'User role changed', user });

    await createAuditLog(req, 'Role Changed', user._id, `Role changed to ${role}`);

    const allUsers = await User.find().populate('assignedFeatures').select('-password');
    io.emit('liveUserList', { message: 'User list updated', users: allUsers });

    res.json({ success: true, message: 'User role updated successfully', user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 📌 Change password (Self)
router.put('/:id/change-password', authMiddleware, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    if (req.user.userId !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Old password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await createAuditLog(req, 'Password Changed', user._id, `User changed own password`);

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 📌 Reset password (Admin only)
router.put('/:id/reset-password', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  const { newPassword } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    const io = req.app.get('io');
    io.emit('passwordReset', { message: 'Password reset by Admin', userId: user._id });

    await createAuditLog(req, 'Password Reset', user._id, `Admin reset the password`);

    res.json({ success: true, message: 'Password reset successfully by Admin' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
