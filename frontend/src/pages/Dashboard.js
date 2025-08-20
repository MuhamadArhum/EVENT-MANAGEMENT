import React from 'react';
import { Link } from 'react-router-dom';
import Notification from '../components/Notification';

function Dashboard() {
  return (
    <div className="container mt-5">
      <img id='dashboard-icon' src="./icon.ico" alt="BMS"/>
      
      <h2>Dashboard</h2>
      <Link to="/create-booking" className="btn btn-info me-2">Create Booking</Link>
      <Link to="/bookings" className="btn btn-info">View Bookings</Link>


      {/* Real-Time Notifications */}
      <Notification />
    </div>
  );
}

export default Dashboard;
