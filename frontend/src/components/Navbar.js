import React from 'react';  
  import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('is_admin');
    onLogout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          SANKALP
        </Link>
        
        <div className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          
          {isLoggedIn ? (
            <>
              <Link to="/register" className="nav-link">Register Complaint</Link>
              <button className="nav-link logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signup" className="nav-link">Register</Link>
              <Link to="/login" className="nav-link">Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;