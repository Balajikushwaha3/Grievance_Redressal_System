import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-left">
          <div className="illustration">
            <svg viewBox="0 0 400 400" className="grievance-svg">
              <circle cx="100" cy="150" r="50" fill="#FF6B9D" opacity="0.8"/>
              <rect x="80" y="200" width="40" height="100" fill="#4A90E2"/>
              <rect x="130" y="180" width="40" height="120" fill="#FF6B9D"/>
              <rect x="60" y="80" width="200" height="100" fill="#7B68EE" rx="10"/>
              <circle cx="80" cy="110" r="15" fill="white"/>
              <circle cx="120" cy="110" r="15" fill="white"/>
              <circle cx="160" cy="110" r="15" fill="white"/>
            </svg>
          </div>
        </div>

        <div className="home-right">
          <h1 className="home-title">GRIEVANCE MANAGEMENT SYSTEM</h1>
          <p className="home-description">
            Our project is an online platform to receive and act on complaints 
            reported by students of Universities, enabling prompt actions on 
            any issue raised by them.
          </p>
          
          <div className="home-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/signup')}
            >
              Register
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/login')}
            >
              LOGIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
