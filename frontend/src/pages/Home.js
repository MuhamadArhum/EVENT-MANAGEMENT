import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mt-5">
      <h1>Welcome to the Booking Management System</h1>
      <p>Please <Link to="/login">Login</Link> to continue.</p>
    </div>
  );
}

export default Home;
