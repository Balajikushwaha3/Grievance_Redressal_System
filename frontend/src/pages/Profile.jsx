import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css'; // Reuse dashboard styles

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function Profile({ token }) {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserInfo(response.data);
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        // Fallback to localStorage
        const isAdmin = localStorage.getItem('is_admin') === 'true';
        setUserInfo({
          username: 'Current User',
          email: 'user@example.com',
          role: isAdmin ? 'Admin' : 'User',
          is_admin: isAdmin
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserInfo();
    }
  }, [token]);

  if (loading) {
    return <div className="dashboard-container"><p>Loading profile...</p></div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>My Profile</h2>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <h3>User Information</h3>
          <div className="profile-details">
            <p><strong>Username:</strong> {userInfo.username}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
            <p><strong>Role:</strong> {userInfo.role}</p>
            <p><strong>Admin Access:</strong> {userInfo.is_admin ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;