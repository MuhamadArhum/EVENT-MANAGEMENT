const Calendar = require('../models/Calendar');
const AuditLog = require('../models/AuditLog');

// ✅ Create Calendar Entry
exports.createCalendar = async (req, res) => {
  try {
    const { title, description, start, end, bookingId, type } = req.body;

    const calendar = new Calendar({
      title,
      description,
      start,
      end,
      bookingId,
      type,
      createdBy: req.user.userId,
    });

    await calendar.save();

    // 🔹 Audit Log
    await AuditLog.create({
      action: 'Create',
      calendarId: calendar._id,
      performedBy: req.user.userId,
      details: { title, start, end }
    });

    const io = req.app.get('io');
    io.emit('calendarUpdate', { action: 'create', calendar });

    res.status(201).json({ success: true, calendar });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating calendar entry', error: error.message });
  }
};

// ✅ Update Calendar Entry
exports.updateCalendar = async (req, res) => {
  try {
    const calendar = await Calendar.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!calendar) return res.status(404).json({ success: false, message: 'Calendar entry not found' });

    // 🔹 Audit Log
    await AuditLog.create({
      action: 'Update',
      calendarId: calendar._id,
      performedBy: req.user.userId,
      details: req.body
    });

    const io = req.app.get('io');
    io.emit('calendarUpdate', { action: 'update', calendar });

    res.json({ success: true, calendar });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating calendar entry', error: error.message });
  }
};

// ✅ Get All Calendar Entries
exports.getCalendars = async (req, res) => {
  try {
    const calendars = await Calendar.find()
      .populate('bookingId createdBy', 'customerName username');
    res.json({ success: true, calendars });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching calendar entries', error: error.message });
  }
};


// ✅ Delete Calendar Entry
exports.deleteCalendar = async (req, res) => {
  try {
    const calendar = await Calendar.findByIdAndDelete(req.params.id);
    if (!calendar) return res.status(404).json({ success: false, message: 'Calendar entry not found' });

    // 🔹 Audit Log
    await AuditLog.create({
      action: 'Delete',
      calendarId: req.params.id,
      performedBy: req.user.userId,
      details: { deletedTitle: calendar.title }
    });

    const io = req.app.get('io');
    io.emit('calendarUpdate', { action: 'delete', calendarId: req.params.id });

    res.json({ success: true, message: 'Calendar entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting calendar entry', error: error.message });
  }
};
