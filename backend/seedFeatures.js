const mongoose = require('mongoose');
require('dotenv').config();
const Feature = require('./models/Feature'); // path adjust if needed

const features = [
  { name: 'Payments', description: 'Access to payment section' },
  { name: 'Reports', description: 'Access to reports section' },
  { name: 'Bookings', description: 'Manage bookings' },
  { name: 'Notifications', description: 'Access to notifications' },
  { name: 'Calendar', description: 'Access to calendar' },
  { name: 'User Management', description: 'Manage users and roles' },
  { name: 'Dashboard', description: 'View dashboard overview' },
  { name: 'Finance', description: 'Access to financial data' },
  { name: 'Settings', description: 'Update application settings' },
  { name: 'Audit Logs', description: 'View system activity logs' }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    await Feature.deleteMany(); // Clear old features
    await Feature.insertMany(features);
    console.log('Features seeded successfully!');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Seeding Error:', err.message);
    mongoose.connection.close();
  });
