import React from 'react';
import './App.css';
import AuthPage from './pages/Auth.js';
import EventPage from './pages/Events.js';
import BookingPage from './pages/Booking.js';
import MainNaviagation from './pages/components/MainNavigation.js';


import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';



function App() {
  return (
    <Router>
      <MainNaviagation/>
      <main className='main-content'>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />  
        <Route path="/events"element={<EventPage />} />
        <Route path="/booking" element={<BookingPage />} />
      </Routes>
      </main>
    </Router>
  );
}

export default App;
