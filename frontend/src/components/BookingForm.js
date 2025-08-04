import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function BookingForm() {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [service, setService] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [notes, setNotes] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/bookings',
        {
          customerName,
          customerEmail,
          customerPhone,
          service,
          bookingDate,
          notes,
          totalPrice,
          advanceAmount
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage('Booking created successfully!');
      setTimeout(() => navigate('/bookings'), 1500);
    } catch (error) {
      console.error("Booking Error:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || 'Error creating booking');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create Booking</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Customer Name</label>
          <input type="text" className="form-control"
            value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control"
            value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Phone</label>
          <input type="text" className="form-control"
            value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Service</label>
          <input type="text" className="form-control"
            value={service} onChange={(e) => setService(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Booking Date</label>
          <input type="date" className="form-control"
            value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Notes</label>
          <textarea className="form-control"
            value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Total Price</label>
          <input type="number" className="form-control"
            value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Advance Amount</label>
          <input type="number" className="form-control"
            value={advanceAmount} onChange={(e) => setAdvanceAmount(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Create Booking</button>
      </form>
    </div>
  );
}

export default BookingForm;
