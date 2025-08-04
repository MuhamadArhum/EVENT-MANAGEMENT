const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const socket = require('socket.io');
require('dotenv').config();

// ✅ Connect to MongoDB
connectDB();

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json()); // Parse JSON

// ✅ Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); // 🔥 User Management
const featureRoutes = require('./routes/featureRoutes');
const auditRoutes = require('./routes/auditRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const paymentRoutes = require('./routes/paymentRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const reportRoutes = require('./routes/reportRoutes'); // 🔥

// ✅ Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // 🔥 User management routes
app.use('/api/features', featureRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes); // 🔥 Payment routes
app.use('/api/calendars', calendarRoutes); // 🔥 Calendar routes
app.use('/api/reports', reportRoutes); // 🔥 Report routes

// ✅ Protected test profile route
app.get('/api/user/profile', authMiddleware, (req, res) => {
  res.json({ message: `Welcome, user ${req.user.userId}` });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

// ✅ Setup Socket.IO with CORS
const io = socket(server, {
  cors: {
    origin: '*', // ⚠️ replace * with frontend URL in production
    methods: ['GET', 'POST']
  }
});

// Make io available globally
app.set('io', io);

// ✅ Socket.IO connection
io.on('connection', (socket) => {
  console.log('✅ A user connected:', socket.id);

  // Custom test event (optional)
  socket.on('pingServer', () => {
    socket.emit('pongServer', { message: 'Pong from backend!' });
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// ✅ Export app for testing or further use
module.exports = app;
