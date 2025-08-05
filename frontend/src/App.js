import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import './App.css'; // Custom CSS
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BookingForm from './components/BookingForm';
import BookingList from './components/BookingList';
import BookingDetails from './components/BookingDetails';
import BookingCalendar from './components/Calendar';
import ReportsPage from './pages/ReportsPage'; // Import the ReportsPage component

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-booking" element={<BookingForm />} />
        <Route path="/bookings" element={<BookingList />} />
        <Route path="/booking/:id" element={<BookingDetails />} />
        <Route path="/calendar" element={<BookingCalendar />} />
        
        {/* Add Route for Reports Page */}
        <Route path="/reports" element={<ReportsPage />} />
        
      </Routes>
    </Router>
  );
}

export default App;
