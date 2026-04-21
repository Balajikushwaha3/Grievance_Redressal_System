import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

      const response = await axios.post('http://127.0.0.1:8000/api/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('is_admin', JSON.stringify(response.data.is_admin));

        setToken(response.data.access_token);
        setIsAdmin(response.data.is_admin);
        setIsLoggedIn(true);

        alert("Login Successful! Welcome back.");
        navigate('/dashboard'); 
      }
      
    } catch (err) {
      console.error("Login Error Details:", err);
      
      // Connectivity issue ke liye check
      if (!err.response) {
        alert("Connectivity Issue: Backend server se baat nahi ho pa rahi. Check karein ki Terminal mein server chalu hai (uvicorn).");
      } else {
        const errorMsg = err.response?.data?.detail || "Invalid Username or Password";
        alert("Error: " + errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="form-container">
        <h2 className="page-title">Grievance Portal Login</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>Apne account mein login karein</p>
        
        <form onSubmit={handleLogin}>
          <input 
            className="form-input"
            type="text" 
            placeholder="Username or Email" 
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
          
          <input 
            className="form-input"
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
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