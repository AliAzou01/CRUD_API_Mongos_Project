import React from 'react';
import './App.css';
import AuthPage from './pages/Auth.js';
import EventPage from './pages/Events.js';
import BookingPage from './pages/Booking.js';

import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />  
        <Route path="/events"element={<EventPage />} />
        <Route path="/booking" element={<BookingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
