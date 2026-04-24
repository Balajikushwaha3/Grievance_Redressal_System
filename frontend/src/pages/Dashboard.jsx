import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function Dashboard({ token, onLogout }) {
  const [activeTab, setActiveTab] = useState('add-complaint');
  const [complaints, setComplaints] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical',
    uid_number: '', // Naya field add kiya
    incharge_name: '' // Naya field add kiya
  });
  const [loading, setLoading] = useState(false);

  // Fetch User Info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserInfo(response.data);
      } catch (err) {
        console.error("User info fetch failed:", err);
      }
    };
    if (token) fetchUserInfo();
  }, [token]);

  // Fetch Complaints (useCallback for efficiency)
  const fetchComplaints = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/complaints/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(response.data);
    } catch (err) {
      console.error("Complaints fetch failed:", err);
    }
  }, [token]);

  // Load complaints when tab changes
  useEffect(() => {
    if (activeTab === 'check-status' || activeTab === 'history') {
      fetchComplaints();
    }
  }, [activeTab, fetchComplaints]);

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/complaints/`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200 || response.status === 201) {
        alert("Shikayat darj ho gayi hai!");
        setFormData({ title: '', description: '', category: 'Technical', uid_number: '', incharge_name: '' });
        setActiveTab('history'); // Submit ke baad history tab par bhejein
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.detail || "Server Error"));
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = () => {
    localStorage.clear();
    if (onLogout) onLogout();
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar Section */}
      <div className="dashboard-sidebar">
        <div className="user-profile">
          <div className="profile-avatar">
            {userInfo?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-info">
            <p className="username"><strong>{userInfo?.username || 'Loading...'}</strong></p>
            <p className="role">Student Portal</p>
          </div>
        </div>

        <div className="sidebar-menu">
          <button className={`menu-item ${activeTab === 'add-complaint' ? 'active' : ''}`} onClick={() => setActiveTab('add-complaint')}>
            <span className="icon">📋</span> <span className="label">Add Complaints</span>
          </button>
          <button className={`menu-item ${activeTab === 'check-status' ? 'active' : ''}`} onClick={() => setActiveTab('check-status')}>
            <span className="icon">🔍</span> <span className="label">Check Status</span>
          </button>
          <button className={`menu-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
            <span className="icon">📜</span> <span className="label">History</span>
          </button>
          <button className={`menu-item ${activeTab === 'support' ? 'active' : ''}`} onClick={() => setActiveTab('support')}>
            <span className="icon">💬</span> <span className="label">Support</span>
          </button>
        </div>

        <button className="logout-btn" onClick={handleLogoutClick}>
          <span className="icon">🚪</span> <span className="label">Logout</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-content">
        
        {/* Tab 1: Add Complaints */}
        {activeTab === 'add-complaint' && (
          <div className="content-section">
            <h2>Submit a New Complaint</h2>
            <form onSubmit={handleSubmitComplaint} className="complaint-form">
              <input type="text" value={userInfo?.username || ''} disabled className="form-field disabled-input" title="Username cannot be changed" />
              
              <input type="text" placeholder="UID Number" className="form-field" 
                value={formData.uid_number} onChange={(e) => setFormData({...formData, uid_number: e.target.value})} required />
              
              <input type="text" placeholder="Name of Person Incharge" className="form-field" 
                value={formData.incharge_name} onChange={(e) => setFormData({...formData, incharge_name: e.target.value})} required />

              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="form-field">
                <option value="Technical">Technical Branch</option>
                <option value="Academic">Academic Branch</option>
                <option value="Administrative">Administrative Branch</option>
                <option value="Other">Other</option>
              </select>

              <input type="text" placeholder="Complaint Title" className="form-field" 
                value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />

              <textarea placeholder="Describe your issue in detail..." className="form-field" rows="5" 
                value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Check Status */}
        {activeTab === 'check-status' && (
          <div className="content-section">
            <h2>Current Status</h2>
            <div className="status-container">
               {complaints.length > 0 ? (
                 <div className="status-display">
                    <div className="status-circle">
                      <p>{complaints[0].status || 'Pending'}</p>
                    </div>
                    <p>Last update for: <strong>{complaints[0].title}</strong></p>
                 </div>
               ) : (
                 <p>No complaints to track.</p>
               )}
            </div>
          </div>
        )}

        {/* Tab 3: History */}
        {activeTab === 'history' && (
          <div className="content-section">
            <h2>Complaint History</h2>
            <div className="complaints-list">
              {complaints.length === 0 ? <p>No history found.</p> : complaints.map((c) => (
                <div key={c.id} className="complaint-card">
                  <div className="card-header">
                    <h4>{c.title}</h4>
                    <span className={`status-badge ${c.status?.toLowerCase()}`}>{c.status}</span>
                  </div>
                  <p>{c.description}</p>
                  <small>Category: {c.category} | Date: {new Date(c.created_at).toLocaleDateString()}</small>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Support (Fixed Visibility) */}
        {activeTab === 'support' && (
          <div className="content-section animate-fade-in">
            <h2>Help & Support</h2>
            <div className="support-container card-style">
              <h3>Direct Contact Support</h3>
              <p>Hume contact karein agar aapko portal chalane mein koi samasya aa rahi hai:</p>
              <ul className="support-list">
                <li><strong>📧 Email:</strong> <a href="mailto:balajikushwaha03@gmail.com">balajikushwaha03@gmail.com</a></li>
                <li><strong>📞 Phone:</strong> +91-9329336086</li>
                <li><strong>⏰ Working Hours:</strong> Mon-Fri, 9 AM to 6 PM</li>
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;