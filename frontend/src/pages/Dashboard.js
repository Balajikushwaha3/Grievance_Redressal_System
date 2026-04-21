import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

function Dashboard({ token, onLogout }) {
  const [activeTab, setActiveTab] = useState('add-complaint');
  const [complaints, setComplaints] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical'
  });
  const [loading, setLoading] = useState(false);

  // Fetch user info
  useEffect(() => {                 
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserInfo(response.data);
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };
    
    if (token) {
      fetchUserInfo();
    }
  }, [token]);

  // Fetch complaints
  const fetchComplaints = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/complaints/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(response.data);
    } catch (err) {
      console.error("Failed to fetch complaints:", err);
    }
  };

  useEffect(() => {
    if (activeTab === 'check-status' || activeTab === 'history') {
      fetchComplaints();
    }
  }, [activeTab]);

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/complaints/', 
        formData, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("Shikayat darj ho gayi hai!");
        setFormData({ title: '', description: '', category: 'Technical' });
        fetchComplaints();
      }
    } catch (err) {
      console.error("Complaint Error:", err);
      alert("Error: " + (err.response?.data?.detail || "Shikayat darj nahi ho payi"));
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('is_admin');
    onLogout();
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-wrapper">
      {/* Left Sidebar */}
      <div className="dashboard-sidebar">
        <div className="user-profile">
          <div className="profile-avatar">
            {userInfo?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-info">
            <p className="username">Username: {userInfo?.username}</p>
            <p className="role">Role: Student</p>
          </div>
        </div>

        <div className="sidebar-menu">
          <button 
            className={`menu-item ${activeTab === 'add-complaint' ? 'active' : ''}`}
            onClick={() => setActiveTab('add-complaint')}
          >
            <span className="icon">📋</span>
            <span className="label">Add Complaints</span>
          </button>

          <button 
            className={`menu-item ${activeTab === 'check-status' ? 'active' : ''}`}
            onClick={() => setActiveTab('check-status')}
          >
            <span className="icon">🔍</span>
            <span className="label">Check Status</span>
          </button>

          <button 
            className={`menu-item ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <span className="icon">📜</span>
            <span className="label">History</span>
          </button>

          <button 
            className={`menu-item ${activeTab === 'support' ? 'active' : ''}`}
            onClick={() => setActiveTab('support')}
          >
            <span className="icon">💬</span>
            <span className="label">Support</span>
          </button>
        </div>

        <button className="logout-btn" onClick={handleLogoutClick}>
          <span className="icon">🚪</span>
          <span className="label">Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Add Complaints Tab */}
        {activeTab === 'add-complaint' && (
          <div className="content-section">
            <h2>Add Complaints</h2>
            <form onSubmit={handleSubmitComplaint} className="complaint-form">
              <input 
                type="text"
                placeholder="Your username"
                value={userInfo?.username || ''}
                disabled
                className="form-field"
              />
              <input 
                type="text"
                placeholder="UID Number"
                className="form-field"
              />
              <input 
                type="text"
                placeholder="Name of the Person Incharge"
                className="form-field"
              />
              
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="form-field"
              >
                <option>Select complaint Branch</option>
                <option value="Technical">Technical</option>
                <option value="Academic">Academic</option>
                <option value="Administrative">Administrative</option>
                <option value="Other">Other</option>
              </select>

              <input 
                type="text"
                placeholder="Complaint Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="form-field"
                required
              />

              <textarea 
                placeholder="Write your complaint here..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="form-field"
                rows="5"
                required
              ></textarea>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        )}

        {/* Check Status Tab */}
        {activeTab === 'check-status' && (
          <div className="content-section">
            <h2>Check Status</h2>
            <div className="status-container">
              <div className="status-circle">
                <span>Status</span>
              </div>
              <button className="view-btn">View Last</button>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="content-section">
            <h2>Track History</h2>
            {complaints.length === 0 ? (
              <p className="no-data">No complaints found.</p>
            ) : (
              <div className="complaints-list">
                {complaints.map((c) => (
                  <div key={c.id} className="complaint-card">
                    <div className="card-header">
                      <h4>{c.title}</h4>
                      <span className={`status-badge ${c.status?.toLowerCase()}`}>
                        {c.status}
                      </span>
                    </div>
                    <p className="card-description">{c.description}</p>
                    <p className="card-category">Category: {c.category}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Support Tab */}
        {activeTab === 'support' && (
          <div className="content-section">
            <h2>Support</h2>
            <div className="support-container">
              <h3>Need Help?</h3>
              <p>If you face any issues, please contact our support team:</p>
              <ul className="support-list">
                <li>📧 Email: support@sankalp.com</li>
                <li>📞 Phone: +91-XXXX-XXXX</li>
                <li>⏰ Timings: Monday - Friday, 9 AM - 6 PM</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
