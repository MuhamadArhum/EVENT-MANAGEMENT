import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer>
      <p>&copy; 2025 Booking Management System. All rights reserved.</p>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
}


export default Footer;
