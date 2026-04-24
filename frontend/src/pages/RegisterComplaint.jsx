import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function RegisterComplaint() {
  const [formData, setFormData] = useState({
    title: '', 
    description: '', 
    category: 'Technical'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Token nikalna (Kyuki sirf logged-in user hi complaint kar sakta hai)
    const token = localStorage.getItem('token');

    if (!token) {
      alert("Error: Aap login nahi hain. Pehle login karein.");
      setLoading(false);
      return;
    }

    try {
      // 2. Authorization header ke saath request bhejna
      const response = await axios.post(`${API_BASE_URL}/api/complaints/`, 
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
        // Page reload ki jagah form reset karna behtar practice hai
        setFormData({ title: '', description: '', category: 'Technical' });
        window.location.reload(); 
      }
    } catch (err) {
      console.error("Complaint Error:", err);
      if (!err.response) {
        alert("Connectivity Issue: Backend server band hai.");
      } else {
        alert("Error: " + (err.response.data.detail || "Shikayat darj nahi ho payi"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="complaint-form" style={{ marginTop: '20px', border: '1px solid #ddd', padding: '20px', borderRadius: '10px', backgroundColor: '#fff' }}>
      <h3 style={{ borderBottom: '2px solid #2ecc71', paddingBottom: '10px' }}>Nayi Shikayat Darj Karein</h3>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Title:</label><br/>
          <input 
            type="text" 
            placeholder="Shikayat ka sirshak" 
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})} 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Description:</label><br/>
          <textarea 
            placeholder="Puri jaankari likhein..." 
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})} 
            required 
            style={{ width: '100%', padding: '10px', height: '100px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Category:</label><br/>
          <select 
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          >
            <option value="Technical">Technical</option>
            <option value="Billing">Billing</option>
            <option value="General">General</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            background: loading ? '#ccc' : '#2ecc71', 
            color: 'white', 
            padding: '12px 25px', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
}

export default RegisterComplaint;