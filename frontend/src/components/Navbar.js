import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip, IconButton, Avatar, Menu, MenuItem, ListItemIcon, Divider } from '@mui/material';
import { PersonAdd, Settings, Logout } from '@mui/icons-material';

function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Function to open the menu when Avatar is clicked
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);  // This opens the menu
  };

  // Function to close the menu when clicked anywhere outside
  const handleClose = () => {
    setAnchorEl(null);  // This closes the menu
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light">
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

            {/* Avatar inside the Navbar */}
            <li className="nav-item">
              <Tooltip title="Account settings">
                <IconButton onClick={handleClick} size="small">
                  <Avatar sx={{ width: 32, height: 32 }}>A</Avatar> {/* Avatar here */}
                </IconButton>
              </Tooltip>
            </li>

          </ul>
        </div>
      </div>

      {/* Profile Menu: Appears when Avatar is clicked */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </nav>
  );
}

export default Navbar;
