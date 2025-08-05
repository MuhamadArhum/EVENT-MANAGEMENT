import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Booking Management</Link>
        <div>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>

            <li className="nav-item">
               <Link className="nav-link" to="/reports">Reports</Link>
            </li>

           <li className="nav-item">
               <Link className="nav-link" to="/calendar">Calendar</Link>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
