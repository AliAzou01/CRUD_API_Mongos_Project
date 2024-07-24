import React, {useState}from 'react';
import './App.css';
import AuthPage from './pages/Auth.js';
import EventPage from './pages/Events.js';
import BookingPage from './pages/Booking.js';
import MainNaviagation from './pages/components/MainNavigation.js';
import AuthContext from './context/auth-context.js';


import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';



function App() {
  const [token, setToken] = useState(null);
  const [userId,setUserId] = useState(null);

  const login = (token, userid, tokenExpiration) => {
      setToken(token);
      setUserId(userid);
  };

  const logout = () => {
      setToken(null);
      setUserId(null);
  };


  return (
    <Router>
      <AuthContext.Provider value={{token:token, userId:userId, login:login, logout:logout }}>
      <MainNaviagation/>
      <main className='main-content'>
      <Routes>
        {!token && <Route path="/" element={<Navigate to="/auth" />} />}
        {token && <Route path="/" element={<Navigate to="/events" />} />}
        {token && <Route path="/auth" element={<Navigate to="/booking" />} />}
        {!token && (<Route path="/auth" element={<AuthPage />} /> )} 
        {token && (<Route path="/booking" element={<BookingPage />} />)}
        <Route path="/events"element={<EventPage />} />
        
      </Routes>
      </main>
      </AuthContext.Provider>
    </Router>
  );
}

export default App;
