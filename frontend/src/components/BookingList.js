import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(response.data.bookings);
      } catch (err) {
        setError('Error fetching bookings');
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="container mt-5">
      <h2>All Bookings</h2>
      {error && <p className="text-danger">{error}</p>}
      {bookings && bookings.length > 0 ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Service</th>
              <th>Date</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.customerName}</td>
                <td>{booking.customerEmail}</td>
                <td>{booking.customerPhone}</td>
                <td>{booking.service}</td>
                <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                <td>{booking.status || 'Active'}</td>
                <td>{booking.paymentStatus}</td>
                <td>
                  <Link to={`/booking/${booking._id}`} className="btn btn-sm btn-info">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
}

export default BookingList;
