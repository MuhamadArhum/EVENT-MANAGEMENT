import React from 'react';
import { Link } from 'react-router-dom';

function Profile() {
  return (
    <div className="container mt-5">
      <h2>Your Profile</h2>
      
      {/* Profile Info Section */}
      <div className="profile-info">
        <div className="row">
          <div className="col-md-4">
            <div className="profile-avatar">
              <img 
                src="https://via.placeholder.com/150" 
                alt="User Avatar" 
                className="img-fluid rounded-circle" 
              />
            </div>
          </div>
          <div className="col-md-8">
            <h4>John Doe</h4>
            <p>Email: john.doe@example.com</p>
            <p>Phone: +123 456 7890</p>
            <p>Role: Admin</p>
          </div>
        </div>
      </div>

      {/* Profile Actions Section */}
      <div className="profile-actions mt-4">
        <Link to="/edit-profile" className="btn btn-primary mr-2">
          Edit Profile
        </Link>
        <Link to="/change-password" className="btn btn-secondary">
          Change Password
        </Link>
      </div>
      
      {/* Other Profile Info */}
      <div className="other-info mt-5">
        <h5>Other Information</h5>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus feugiat purus ac turpis blandit, et euismod purus consectetur.</p>
      </div>
    </div>
  );
}

export default Profile;
