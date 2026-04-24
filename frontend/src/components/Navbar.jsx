import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();
  const [isAdminState, setIsAdminState] = useState(false);

  // Yeh useEffect har bar check karega ki user admin hai ya nahi
  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin");
    // SQLite se 1 aata hai aur localStorage string save karta hai
    if (adminStatus === "true" || adminStatus === "1") {
      setIsAdminState(true);
    } else {
      setIsAdminState(false);
    }
  }, [isLoggedIn]); // Jab login status badle, tab dobara check karein

  const handleLogout = () => {
    localStorage.removeItem("isAdmin"); // Logout ke waqt admin status clear karein
    localStorage.removeItem("token");
    onLogout(); 
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <Link to="/" className="navbar-logo">
          BALAJI <span>Grievance</span>
        </Link>
        
        <div className="nav-menu">
          {/* Public Links */}
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About Us</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          
          {isLoggedIn ? (
            <>
              {/* Private Links */}
              <Link to="/dashboard" className="nav-link">User Dashboard</Link>

              {isAdminState && (
              <Link to="/admin/history" className="nav-link admin-special-link" style={{ color: '#ffcc00' }}>
              Admin
              </Link>
              )}

              <Link to="/profile" className="nav-link">Profile</Link>
              
              <button className="nav-link logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signup" className="nav-link">Register</Link>
              <Link to="/login" className="nav-link login-special">Login</Link>

            </>


          )}
             {isAdminState && (
             <Link to="/admin/history" className="nav-link admin-special-link" style={{ color: '#ffcc00' }}>
             Admin
            </Link>
        )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;