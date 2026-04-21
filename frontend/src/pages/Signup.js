import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '' 
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 422 Error se bachne ke liye data ko saaf (clean) karein
      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(), // Email hamesha lowercase aur bina space ke hona chahiye
        password: formData.password
      };

      console.log("Sending to Backend:", payload);

      const response = await axios.post('http://127.0.0.1:8000/api/register', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200 || response.status === 201) {
        alert("Registration Successful!"); 
        navigate('/login');
      }
      
    } catch (err) {
      if (err.response && err.response.status === 422) {
        // FastAPI validation errors yahan dikhayega
        console.error("Validation Error:", err.response.data.detail);
        alert("Input Error: Kripya email ka format sahi bharein (example@mail.com)");
      } else {
        alert("Error: " + (err.response?.data?.detail || "Kuch galat hua"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page" style={{ padding: '50px', textAlign: 'center', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <div className="form-container" style={{ display: 'inline-block', background: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '10px' }}>Naya Account Banayein</h2>
        
        <form onSubmit={handleSignup}>
          <input 
            className="form-input"
            type="text" 
            placeholder="Username" 
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})} 
            required 
            style={{padding: '12px', margin: '10px 0', width: '300px', borderRadius: '8px', border: '1px solid #ddd'}} 
          /><br/>

          <input 
            className="form-input"
            type="email" 
            placeholder="Email Address" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            required 
            style={{padding: '12px', margin: '10px 0', width: '300px', borderRadius: '8px', border: '1px solid #ddd'}} 
          /><br/>

          <input 
            className="form-input"
            type="password" 
            placeholder="Password" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
            required 
            style={{padding: '12px', margin: '10px 0', width: '300px', borderRadius: '8px', border: '1px solid #ddd'}} 
          /><br/>

          <button 
            type="submit" 
            disabled={loading}
            className="submit-btn"
            style={{ 
              backgroundColor: loading ? '#bdc3c7' : '#2ecc71', 
              color: 'white', 
              padding: '14px 0', 
              width: '100%',
              border: 'none', 
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer', 
              marginTop: '20px',
              fontWeight: 'bold'
            }}
          >
            {loading ? "Registering..." : "Register Now"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;