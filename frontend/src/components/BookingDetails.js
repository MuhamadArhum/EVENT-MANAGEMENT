import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function BookingDetails() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const foundBooking = response.data.bookings.find(b => b._id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        } else {
          setError('Booking not found');
        }
      } catch (error) {
        setError('Error fetching booking details');
      }
    };
    fetchBookingDetails();
  }, [id]);

  return booking ? (
    <div className="container mt-5">
      <h2>Booking Details</h2>
      <p><strong>Customer:</strong> {booking.customerName}</p>
      <p><strong>Email:</strong> {booking.customerEmail}</p>
      <p><strong>Phone:</strong> {booking.customerPhone}</p>
      <p><strong>Service:</strong> {booking.service}</p>
      <p><strong>Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
      <p><strong>Notes:</strong> {booking.notes}</p>
      <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
      <p><strong>Advance Paid:</strong> ${booking.advanceAmount}</p>
      <p><strong>Remaining:</strong> ${booking.remainingAmount}</p>
      <p><strong>Payment Status:</strong> {booking.paymentStatus}</p>
      <p><strong>Status:</strong> {booking.status || 'Active'}</p>
    </div>
  ) : (
    <p className="container mt-5 text-danger">{error || 'Loading booking details...'}</p>
  );
}

export default BookingDetails;
