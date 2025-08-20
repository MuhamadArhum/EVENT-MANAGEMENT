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
      <h1>Create Booking</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label for='customer-name'>Customer Name</label>
          <input id='customer-name' name='customerName' type="text" className="form-control" placeholder='Enter Customer Name'
            value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label for='customer-email'>Email</label>
          <input id='customer-email' name='customerEmail' type="email" className="form-control" placeholder='Enter Customer Email'
            value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label for='customer-phone'>Phone</label>
          <input id='customer-phone' name='customerPhone' type="text" className="form-control" placeholder='Enter Customer Phone'
            value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label for='service'>Service</label>
          <input id='service' name='service' type="text" className="form-control" placeholder='Enter Service'
            value={service} onChange={(e) => setService(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label for='booking-date'>Booking Date</label>
          <input id='booking-date' name='bookingDate' type='date' className="form-control" placeholder='Select Booking Date'
            value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label for='notes'>Notes</label>
          <textarea id='notes' name='notes' className="form-control" placeholder='Enter Notes'
            value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div className="mb-3">
          <label for='total-price'>Total Price</label>
          <input id='total-price' name='totalPrice' type="number" className="form-control" placeholder='Enter Total Price'
            value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label for='advance-amount'>Advance Amount</label>
          <input id='advance-amount' name='advanceAmount' type="number" className="form-control" placeholder='Enter Advance Amount'
            value={advanceAmount} onChange={(e) => setAdvanceAmount(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Create Booking</button>
      </form>
    </div>
  );
}

export default BookingForm;
