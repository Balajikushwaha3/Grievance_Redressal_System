import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function Login({ setToken, setIsAdmin, setIsLoggedIn }) { 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axios.post(`${API_BASE_URL}/api/login`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (response.data.access_token) {
        // --- DATA SAVING ---
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem("isAdmin", response.data.is_admin);
        
        // Zaroori: 'isAdmin' aur 'is_admin' dono set karein taaki koi confusion na rahe
        const adminStatus = response.data.is_admin;
        localStorage.setItem('isAdmin', adminStatus); 
        localStorage.setItem('is_admin', adminStatus);

        // --- STATE UPDATING ---
        if(setToken) setToken(response.data.access_token);
        if(setIsAdmin) setIsAdmin(adminStatus);
        if(setIsLoggedIn) setIsLoggedIn(true);

        alert("Login Successful! Welcome back.");
        
        // Dashboard par bhejein aur page refresh karein taaki Navbar naya data utha sake
        window.location.href = "/"; 
      }
      
    } catch (err) {
      console.error("Login Error Details:", err);
      if (!err.response) {
        alert("Connectivity Issue: Backend server chalu nahi hai.");
      } else {
        const errorMsg = err.response?.data?.detail || "Invalid Username or Password";
        alert("Error: " + errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <div className="form-container" style={{ background: '#fff', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', textAlign: 'center', width: '100%', maxWidth: '400px' }}>
        <h2 className="page-title" style={{ color: '#1e3c72', marginBottom: '10px' }}>Grievance Portal Login</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>Apne account mein login karein</p>
        
        <form onSubmit={handleLogin}>
          <input 
            className="form-input"
            type="text" 
            placeholder="Username or Email" 
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
            required 
            style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '5px' }}
          />
          
          <input 
            className="form-input"
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '12px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '5px' }}
          />
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '12px', 
              background: '#1e3c72', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              fontWeight: 'bold',
              opacity: loading ? 0.7 : 1, 
              cursor: loading ? 'not-allowed' : 'pointer' 
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <p style={{ marginTop: '15px', fontSize: '14px' }}>
          Account nahi hai? <span 
            style={{ color: '#1e3c72', cursor: 'pointer', fontWeight: 'bold' }} 
            onClick={() => navigate('/signup')}
          >
            Signup Karein
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;