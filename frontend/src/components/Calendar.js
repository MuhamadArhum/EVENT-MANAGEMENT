import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';

function BookingCalendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch events from backend
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/calendars', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(response.data.calendars);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="container mt-5">
      <h3>Event Calendar</h3>
      <Calendar
        onChange={() => {}}
        value={new Date()}
        tileContent={({ date, view }) => {
          // Match event date with calendar date and display event title
          const event = events.find(event => new Date(event.start).toDateString() === date.toDateString());
          return event ? <p>{event.title}</p> : null;
        }}
      />
    </div>
  );
}

export default BookingCalendar;
