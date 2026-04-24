import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Components aur Pages
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RegisterComplaint from './pages/RegisterComplaint';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact'; 
import ThankYou from './pages/ThankYou';
import AdminInbox from './pages/AdminInbox';
import UserHistory from './pages/UserHistory';
import AdminDashboard from './pages/AdminDashboard';

import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function App() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state add ki
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  
  const [isAdmin, setIsAdmin] = useState(() => {
    const saved = localStorage.getItem('is_admin');
    return saved === 'true'; 
  });

  // fetchComplaints ko useCallback mein wrap kiya taaki baar-baar render na ho
  const fetchComplaints = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/complaints/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(response.data);
    } catch (err) {
      console.error("Connectivity Issue:", err);
      // Agar token expire ho gaya ho (401 Error)
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchComplaints();
    }
  }, [token, fetchComplaints]);

  const handleLogout = () => {
    setToken(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem('token');
    localStorage.removeItem('is_admin');
    window.location.href = '/login'; // Force redirect to login
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} onLogout={handleLogout} />
        
        {/* Loading Spinner logic agar complaints load ho rahi hain */}
        {loading && <div className="loading-bar">Updating Data...</div>}

        <div className="app-content">
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<Home />} />
          
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* --- Auth Routes --- */}
            <Route path="/login" element={!isLoggedIn ? 
              <Login setToken={setToken} setIsAdmin={setIsAdmin} setIsLoggedIn={setIsLoggedIn} /> 
              : <Navigate to="/dashboard" />} 
            />
            <Route path="/signup" element={!isLoggedIn ? <Signup /> : <Navigate to="/dashboard" />} />

            {/* --- Private Routes --- */}
            <Route path="/dashboard" element={isLoggedIn ? (
              <Dashboard 
                token={token} 
                complaints={complaints} 
                onRefresh={fetchComplaints} 
                isAdmin={isAdmin} // Admin check pass kiya
              />
            ) : <Navigate to="/login" />} />
            
            <Route path="/register" element={isLoggedIn ? (
              <RegisterComplaint onRefresh={fetchComplaints} token={token} />
            ) : <Navigate to="/login" />} />

            <Route path="/profile" element={isLoggedIn ? <Profile token={token} onLogout={handleLogout} /> : <Navigate to="/login" />} />

            {/* --- Admin Only Route (Advanced) --- */}
            <Route path="/admin-panel" element={(isLoggedIn && isAdmin) ? (
                <div className="admin-view">Admin Features Coming Soon</div>
            ) : <Navigate to="/dashboard" />} />

            {/* Error Handling */}
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/admin/inbox" element={<AdminInbox />} />
         
            <Route path="/admin/user-history" element={<UserHistory />} />
            <Route path="/admin/history" element={<AdminDashboard />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;