import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Naya import
import '../styles/Home.css';

function Contact() {
  const navigate = useNavigate(); // Navigation initialize karein
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await fetch('http://127.0.0.1:8000/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      navigate('/thank-you');
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Backend connect nahi ho pa raha!");
  } finally {
    setLoading(false);
  

      // Alert ki jagah ab hum next page par bhej rahe hain
      navigate('/thank-you'); 
    }
};

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-left">
          <div className="illustration">
            <svg viewBox="0 0 400 400" className="grievance-svg">
              <rect x="100" y="100" width="200" height="150" fill="#7B68EE" rx="10"/>
              <circle cx="150" cy="140" r="15" fill="white"/>
              <circle cx="200" cy="140" r="15" fill="white"/>
              <circle cx="250" cy="140" r="15" fill="white"/>
              <rect x="120" y="180" width="160" height="8" fill="white"/>
              <rect x="120" y="200" width="160" height="8" fill="white"/>
              <rect x="120" y="220" width="160" height="8" fill="white"/>
            </svg>
          </div>
        </div>

        <div className="home-right">
          <h1 className="home-title">Contact Us</h1>
          <p className="home-description">
            Have questions or need help? Get in touch with us.
          </p>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full p-2 border rounded"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-2 border rounded"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                className="w-full p-2 border rounded"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ background: '#7B68EE', color: 'white', padding: '10px 20px', borderRadius: '5px', width: '100%' }}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;