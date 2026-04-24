import React from 'react';
import '../styles/Home.css'; // Reuse home styles

function About() {
  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-left">
          <div className="illustration">
            <svg viewBox="0 0 400 400" className="grievance-svg">
              <circle cx="200" cy="150" r="60" fill="#4A90E2" opacity="0.8"/>
              <rect x="170" y="210" width="60" height="80" fill="#FF6B9D"/>
              <rect x="140" y="290" width="120" height="40" fill="#7B68EE" rx="20"/>
              <circle cx="180" cy="130" r="20" fill="white"/>
              <circle cx="220" cy="130" r="20" fill="white"/>
            </svg>
          </div>
        </div>

        <div className="home-right">
          <h1 className="home-title">About Our System</h1>
          <p className="home-description">
            The Grievance Management System is designed to provide a seamless platform
            for students and users to report their concerns and issues. Our system ensures
            that every complaint is handled efficiently and transparently.
          </p>
           <div>
            <p className="home-description"> 
              Features include:
            </p>
            <ul>
              <li>Easy complaint registration</li>
               <li>Real-time status tracking</li>
             <li>Admin dashboard for management</li>
              <li>Secure authentication</li>
              <li>Responsive design</li>
            </ul>
           </div>
          </div>
      </div>
    </div>
  );
}

export default About;