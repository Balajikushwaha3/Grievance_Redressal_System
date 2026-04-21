import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RegisterComplaint from './pages/RegisterComplaint';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [complaints, setComplaints] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  
  const [isAdmin, setIsAdmin] = useState(() => {
    const saved = localStorage.getItem('is_admin');
    return saved === 'true'; 
  });

  // API Call setup with Headers
  const fetchComplaints = async () => {
    if (!token) return;

    try {
      const response = await axios.get('http://127.0.0.1:8000/api/complaints/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(response.data);
    } catch (err) {
      console.error("Connectivity Issue:", err);
      if (err.response && err.response.status === 401) {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchComplaints();
    }
  }, [token]);

  const handleLogout = () => {
    setToken(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem('token');
    localStorage.removeItem('is_admin');
  };

  const handleResolve = async (id) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/complaints/${id}/resolve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Complaint Resolved!");
      fetchComplaints();
    } catch (err) {
      alert("Resolution failed: Connection or Permission error");
    }
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        
        <div className="app-content">
          <Routes>
            {/* Home Route */}
            <Route path="/" element={!isLoggedIn ? <Home /> : <Navigate to="/dashboard" />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={!isLoggedIn ? <Login setToken={setToken} setIsAdmin={setIsAdmin} setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/dashboard" />} />
            <Route path="/signup" element={!isLoggedIn ? <Signup /> : <Navigate to="/dashboard" />} />

            {/* Dashboard Route */}
            <Route path="/dashboard" element={isLoggedIn ? (
              <Dashboard token={token} onLogout={handleLogout} />
            ) : <Navigate to="/login" />} />
            
            {/* Catch all route */}
            <Route path="/register" element={isLoggedIn ? <RegisterComplaint onRefresh={fetchComplaints} token={token} /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;